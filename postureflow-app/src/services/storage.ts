import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const STORAGE_KEYS = {
  locale: "@postureflow/locale",
  authSession: "@postureflow/auth-session",
  pendingVerification: "@postureflow/pending-verification",
  bootstrap: "@postureflow/bootstrap",
  dashboard: "@postureflow/dashboard",
  library: "@postureflow/library",
  paywall: "@postureflow/paywall",
  syncQueue: "@postureflow/sync-queue",
  successSummary: "@postureflow/success-summary",
} as const;

function isSecureKey(key: string) {
  return key === STORAGE_KEYS.authSession;
}

async function readSecureString(key: string) {
  try {
    const secureValue = await SecureStore.getItemAsync(key);
    if (secureValue) {
      return secureValue;
    }
  } catch {
    // SecureStore is unavailable in some runtimes, so keep AsyncStorage fallback.
  }

  return AsyncStorage.getItem(key);
}

async function writeSecureString(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
    await AsyncStorage.removeItem(key);
    return;
  } catch {
    await AsyncStorage.setItem(key, value);
  }
}

async function removeSecureItem(key: string) {
  await Promise.all([
    SecureStore.deleteItemAsync(key).catch(() => null),
    AsyncStorage.removeItem(key),
  ]);
}

export async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = isSecureKey(key)
      ? await readSecureString(key)
      : await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(key: string, value: T) {
  if (isSecureKey(key)) {
    await writeSecureString(key, JSON.stringify(value));
    return;
  }

  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function readString(key: string, fallback = "") {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function writeString(key: string, value: string) {
  await AsyncStorage.setItem(key, value);
}

export async function removeItem(key: string) {
  if (isSecureKey(key)) {
    await removeSecureItem(key);
    return;
  }

  await AsyncStorage.removeItem(key);
}

export async function removeMany(keys: string[]) {
  if (keys.length === 0) {
    return;
  }

  await Promise.all(keys.map((key) => removeItem(key)));
}
