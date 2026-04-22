import AsyncStorage from "@react-native-async-storage/async-storage";

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

export async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(key: string, value: T) {
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
  await AsyncStorage.removeItem(key);
}

export async function removeMany(keys: string[]) {
  if (keys.length === 0) {
    return;
  }

  await Promise.all(keys.map((key) => AsyncStorage.removeItem(key)));
}
