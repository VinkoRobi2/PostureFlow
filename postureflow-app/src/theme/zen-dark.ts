import type { TextStyle, ViewStyle } from "react-native";

export const zenDarkTheme = {
  canvas: "#020617",
  canvasAlt: "#09090B",
  surface: "#0F172A",
  surfaceMuted: "#111827",
  surfaceGlass: "rgba(15,23,42,0.52)",
  surfaceOverlay: "rgba(15,23,42,0.76)",
  card: "#111827",
  cardMuted: "#0B1120",
  border: "rgba(52,211,153,0.10)",
  borderMuted: "rgba(148,163,184,0.16)",
  accent: "#10B981",
  accentStrong: "#34D399",
  accentSoft: "rgba(16,185,129,0.16)",
  accentGlow: "rgba(16,185,129,0.24)",
  textPrimary: "#F4F4F5",
  textSecondary: "#A1A1AA",
  textTertiary: "#71717A",
  textInverse: "#020617",
  input: "rgba(2,6,23,0.82)",
  whiteSoft: "rgba(244,244,245,0.14)",
} as const;

export const zenCardStyle: ViewStyle = {
  backgroundColor: zenDarkTheme.surfaceGlass,
  borderWidth: 1,
  borderColor: zenDarkTheme.border,
};

export const zenCardShadow: ViewStyle = {
  shadowColor: zenDarkTheme.accent,
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.12,
  shadowRadius: 28,
  elevation: 6,
};

export const zenAmbientGlow = (
  opacity = 0.16,
  radius = 24,
): ViewStyle => ({
  shadowColor: zenDarkTheme.accent,
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation: 5,
});

export const zenEyebrowText: TextStyle = {
  color: zenDarkTheme.accentStrong,
  fontSize: 11,
  fontWeight: "700",
  letterSpacing: 1.2,
  textTransform: "uppercase",
};
