const explicitUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

export const API_BASE_URL = explicitUrl ?? "";
export const API_ORIGIN_URL = explicitUrl?.replace(/\/(?:api|v1)$/, "") ?? "";
