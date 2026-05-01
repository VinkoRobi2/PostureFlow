const explicitUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

export const API_BASE_URL = explicitUrl ?? "";
