import { Platform } from "react-native";
import type { TextStyle, ViewStyle } from "react-native";

export const zenDarkTheme = {
  canvas: "#0F172A",
  canvasAlt: "#1E293B",
  surface: "rgba(255,255,255,0.04)",
  surfaceMuted: "rgba(255,255,255,0.02)",
  surfaceGlass: "rgba(255,255,255,0.03)",
  surfaceOverlay: "rgba(15,23,42,0.68)",
  card: "rgba(255,255,255,0.04)",
  cardMuted: "rgba(203,213,225,0.07)",
  border: "rgba(203,213,225,0.12)",
  borderMuted: "rgba(203,213,225,0.22)",
  accent: "#5EEAD4",
  accentStrong: "#99F6E4",
  accentSoft: "rgba(94,234,212,0.14)",
  accentGlow: "rgba(94,234,212,0.24)",
  textPrimary: "#CBD5E1",
  textSecondary: "#94A3B8",
  textTertiary: "#64748B",
  textInverse: "#0F172A",
  input: "rgba(255,255,255,0.05)",
  whiteSoft: "rgba(255,255,255,0.08)",
} as const;

export const zenGlassEffect: ViewStyle =
  Platform.OS === "web"
    ? ({
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      } as ViewStyle)
    : {};

export const zenCardStyle: ViewStyle = {
  backgroundColor: zenDarkTheme.surfaceGlass,
  borderWidth: 1,
  borderColor: zenDarkTheme.border,
  ...zenGlassEffect,
};

export const zenCardShadow: ViewStyle = {
  shadowColor: zenDarkTheme.accent,
  shadowOffset: { width: 0, height: 20 },
  shadowOpacity: 0.08,
  shadowRadius: 36,
  elevation: 5,
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
  fontWeight: "500",
  letterSpacing: 1.2,
  textTransform: "uppercase",
};
