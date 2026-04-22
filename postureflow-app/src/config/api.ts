import Constants from "expo-constants";
import { Platform } from "react-native";

const explicitUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
const hostUri =
  (Constants.expoConfig as { hostUri?: string } | null)?.hostUri ?? "";
const host = hostUri.split(":")[0];

function getDefaultBaseUrl() {
  if (host) {
    return `http://${host}:3000/v1`;
  }

  return Platform.select({
    android: "http://10.0.2.2:3000/v1",
    default: "http://localhost:3000/v1",
  })!;
}

export const API_BASE_URL = explicitUrl ?? getDefaultBaseUrl();
