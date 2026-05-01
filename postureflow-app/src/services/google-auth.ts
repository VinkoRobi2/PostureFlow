import { Platform } from "react-native";
import {
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
} from "../config/google";
import type { LocaleCode } from "../types/app";

declare const require: (path: string) => unknown;

type GoogleUser = {
  idToken: string | null;
  serverAuthCode: string | null;
  user: {
    id: string;
    email: string;
    name: string | null;
    givenName: string | null;
    familyName: string | null;
    photo: string | null;
  };
};

type SignInResponse =
  | {
      type: "success";
      data: GoogleUser;
    }
  | {
      type: "cancelled";
      data: null;
    };

type GoogleNativeError = Error & { code?: string };

type GoogleSigninModule = {
  GoogleSignin: {
    configure: (options: {
      webClientId: string;
      iosClientId?: string;
      offlineAccess: boolean;
      scopes: string[];
    }) => void;
    getTokens: () => Promise<{ idToken: string | null; accessToken: string }>;
    hasPlayServices: (options: {
      showPlayServicesUpdateDialog: boolean;
    }) => Promise<boolean>;
    signIn: () => Promise<SignInResponse>;
    signOut: () => Promise<unknown>;
  };
  isCancelledResponse?: (response: SignInResponse) => boolean;
  isErrorWithCode?: (error: unknown) => error is GoogleNativeError;
  isSuccessResponse?: (response: SignInResponse) => response is Extract<
    SignInResponse,
    { type: "success" }
  >;
};

export type GoogleProfile = {
  googleId: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
};

export type GoogleNativeAuthResult = {
  idToken: string;
  serverAuthCode?: string;
  profile: GoogleProfile;
};

export class GoogleAuthError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "GoogleAuthError";
    this.code = code;
  }
}

let googleConfigured = false;
let googleModule: GoogleSigninModule | null = null;
let googleModuleLoadFailed = false;

function getGoogleSignInModule() {
  if (googleModule) {
    return googleModule;
  }

  if (googleModuleLoadFailed) {
    return null;
  }

  try {
    googleModule = require(
      "@react-native-google-signin/google-signin",
    ) as GoogleSigninModule;
    return googleModule;
  } catch {
    googleModuleLoadFailed = true;
    googleConfigured = false;
    return null;
  }
}

function getGoogleMessage(locale: LocaleCode, code: string) {
  const spanish = locale === "es";
  const normalizedCode = code.toLowerCase();

  if (code === "missing-web-client-id") {
    return spanish
      ? "Configura EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID en tu archivo .env."
      : "Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in your .env file.";
  }

  if (code === "native-module-missing") {
    return spanish
      ? "Google Sign-In necesita una development build nueva. No funciona en Expo Go ni en una build anterior."
      : "Google Sign-In needs a new development build. It does not run in Expo Go or an older build.";
  }

  if (code === "missing-id-token") {
    return spanish
      ? "Google no devolvio un idToken. Revisa el webClientId."
      : "Google did not return an idToken. Check the webClientId.";
  }

  if (normalizedCode.includes("cancel")) {
    return spanish
      ? "Inicio con Google cancelado."
      : "Google sign-in was cancelled.";
  }

  if (normalizedCode.includes("play_services")) {
    return spanish
      ? "Google Play Services no esta disponible o necesita actualizarse."
      : "Google Play Services is unavailable or needs an update.";
  }

  if (normalizedCode.includes("progress")) {
    return spanish
      ? "Ya hay un inicio de sesion con Google en curso."
      : "Google sign-in is already in progress.";
  }

  return spanish
    ? "No se pudo iniciar sesion con Google."
    : "Google sign-in failed.";
}

export function configureGoogleSignIn() {
  if (!GOOGLE_WEB_CLIENT_ID || googleConfigured) {
    return Boolean(GOOGLE_WEB_CLIENT_ID && googleConfigured);
  }

  const nativeGoogle = getGoogleSignInModule();

  if (!nativeGoogle) {
    return false;
  }

  nativeGoogle.GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    offlineAccess: true,
    scopes: ["email", "profile"],
  });

  googleConfigured = true;
  return true;
}

function ensureGoogleConfigured(locale: LocaleCode) {
  if (!GOOGLE_WEB_CLIENT_ID) {
    throw new GoogleAuthError(
      "missing-web-client-id",
      getGoogleMessage(locale, "missing-web-client-id"),
    );
  }

  const nativeGoogle = getGoogleSignInModule();

  if (!nativeGoogle) {
    throw new GoogleAuthError(
      "native-module-missing",
      getGoogleMessage(locale, "native-module-missing"),
    );
  }

  if (!googleConfigured) {
    configureGoogleSignIn();
  }

  return nativeGoogle;
}

function isCancelledResponse(
  nativeGoogle: GoogleSigninModule,
  response: SignInResponse,
) {
  return nativeGoogle.isCancelledResponse
    ? nativeGoogle.isCancelledResponse(response)
    : response.type === "cancelled";
}

function isSuccessResponse(
  nativeGoogle: GoogleSigninModule,
  response: SignInResponse,
): response is Extract<SignInResponse, { type: "success" }> {
  return nativeGoogle.isSuccessResponse
    ? nativeGoogle.isSuccessResponse(response)
    : response.type === "success";
}

function normalizeGoogleError(error: unknown, locale: LocaleCode): GoogleAuthError {
  if (error instanceof GoogleAuthError) {
    return error;
  }

  const nativeGoogle = getGoogleSignInModule();
  const hasCode =
    nativeGoogle?.isErrorWithCode?.(error) ??
    (typeof error === "object" && error !== null && "code" in error);

  if (hasCode) {
    const code = String((error as GoogleNativeError).code ?? "unknown");
    return new GoogleAuthError(code, getGoogleMessage(locale, code));
  }

  return new GoogleAuthError("unknown", getGoogleMessage(locale, "unknown"));
}

export async function signInWithGoogle(
  locale: LocaleCode,
): Promise<GoogleNativeAuthResult> {
  try {
    const nativeGoogle = ensureGoogleConfigured(locale);

    if (Platform.OS === "android") {
      await nativeGoogle.GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
    }

    const response = await nativeGoogle.GoogleSignin.signIn();

    if (isCancelledResponse(nativeGoogle, response)) {
      throw new GoogleAuthError(
        "cancelled",
        getGoogleMessage(locale, "cancelled"),
      );
    }

    if (!isSuccessResponse(nativeGoogle, response)) {
      throw new GoogleAuthError("unknown", getGoogleMessage(locale, "unknown"));
    }

    const googleUser = response.data;
    let idToken = googleUser.idToken;

    if (!idToken) {
      const tokens = await nativeGoogle.GoogleSignin.getTokens().catch(() => null);
      idToken = tokens?.idToken ?? null;
    }

    if (!idToken) {
      throw new GoogleAuthError(
        "missing-id-token",
        getGoogleMessage(locale, "missing-id-token"),
      );
    }

    return {
      idToken,
      serverAuthCode: googleUser.serverAuthCode ?? undefined,
      profile: {
        googleId: googleUser.user.id,
        email: googleUser.user.email,
        name: googleUser.user.name ?? undefined,
        firstName: googleUser.user.givenName ?? undefined,
        lastName: googleUser.user.familyName ?? undefined,
        photo: googleUser.user.photo ?? undefined,
      },
    };
  } catch (error) {
    throw normalizeGoogleError(error, locale);
  }
}

export async function signOutGoogle() {
  const nativeGoogle = getGoogleSignInModule();

  if (!nativeGoogle || !googleConfigured) {
    return;
  }

  await nativeGoogle.GoogleSignin.signOut().catch(() => null);
}
