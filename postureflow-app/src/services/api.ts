import { API_BASE_URL } from "../config/api";
import {
  AuthResult,
  BackendLocale,
  BootstrapResponse,
  CompleteSessionResponse,
  DashboardResponse,
  LibraryResponse,
  PaywallResponse,
  PendingSyncEvent,
  StartSessionResponse,
} from "../types/app";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: Record<string, unknown>;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    const text = await response.text();
    const data = text ? (JSON.parse(text) as T | { message?: string }) : undefined;

    if (!response.ok) {
      const message =
        typeof data === "object" && data && "message" in data
          ? data.message
          : `Request failed with status ${response.status}`;
      throw new ApiError(response.status, message || "Request failed.");
    }

    return data as T;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  getBootstrap(locale: BackendLocale, userId?: string) {
    const userQuery = userId ? `&userId=${encodeURIComponent(userId)}` : "";
    return request<BootstrapResponse>(`/bootstrap?locale=${locale}${userQuery}`);
  },
  registerWithEmail(
    firstName: string,
    email: string,
    password: string,
    locale: BackendLocale,
    lastName?: string,
  ) {
    return request<AuthResult>("/auth/register", {
      method: "POST",
      body: { firstName, lastName, email, password, locale },
    });
  },
  loginWithEmail(email: string, password: string, locale: BackendLocale) {
    return request<AuthResult>("/auth/login", {
      method: "POST",
      body: { email, password, locale },
    });
  },
  loginWithGoogle(
    email: string,
    firstName: string,
    locale: BackendLocale,
    lastName?: string,
    googleSubject?: string,
  ) {
    return request<AuthResult>("/auth/google", {
      method: "POST",
      body: { email, firstName, lastName, googleSubject, locale },
    });
  },
  verifyEmail(email: string, code: string, locale: BackendLocale) {
    return request<AuthResult>("/auth/verify-email", {
      method: "POST",
      body: { email, code, locale },
    });
  },
  resendVerification(email: string) {
    return request<AuthResult>("/auth/resend-verification", {
      method: "POST",
      body: { email },
    });
  },
  restoreSession(sessionToken: string, locale: BackendLocale) {
    return request<AuthResult>("/auth/session", {
      method: "POST",
      body: { sessionToken, locale },
    });
  },
  logout(sessionToken: string) {
    return request<{ ok: boolean }>("/auth/logout", {
      method: "POST",
      body: { sessionToken },
    });
  },
  updateLocale(userId: string, locale: BackendLocale) {
    return request<{ ok: boolean }>("/profile/locale", {
      method: "PATCH",
      body: { userId, locale },
    });
  },
  completeOnboarding(
    userId: string,
    locale: BackendLocale,
    painRegionIds: string[],
    setupOptionIds: string[],
  ) {
    return request("/onboarding/complete", {
      method: "POST",
      body: { userId, locale, painRegionIds, setupOptionIds },
    });
  },
  getDashboard(userId: string) {
    return request<DashboardResponse>(`/dashboard/${userId}`);
  },
  getLibrary(userId: string) {
    return request<LibraryResponse>(`/library/${userId}`);
  },
  downloadRoutine(userId: string, routineId: string) {
    return request<LibraryResponse>("/library/download", {
      method: "POST",
      body: { userId, routineId },
    });
  },
  getPaywall() {
    return request<PaywallResponse>("/paywall");
  },
  startSession(userId: string, routineId: string, locale: BackendLocale) {
    return request<StartSessionResponse>("/player/start", {
      method: "POST",
      body: { userId, routineId, locale },
    });
  },
  updateSessionProgress(sessionId: string, progress: number) {
    return request(`/player/${sessionId}/progress`, {
      method: "PATCH",
      body: { progress },
    });
  },
  completeSession(
    sessionId: string,
    userId: string,
    locale: BackendLocale,
    routineId?: string,
  ) {
    return request<CompleteSessionResponse>(`/player/${sessionId}/complete`, {
      method: "POST",
      body: { userId, locale, routineId },
    });
  },
  sync(userId: string, events: PendingSyncEvent[]) {
    return request("/sync", {
      method: "POST",
      body: {
        userId,
        events: events.map(({ type, payload }) => ({ type, payload })),
      },
    });
  },
};
