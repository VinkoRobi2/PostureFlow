import { Platform } from "react-native";
import type { TextStyle, ViewStyle } from "react-native";

export const onboardingDarkTheme = {
  background: "#0F172A",
  card: "rgba(255,255,255,0.04)",
  cardSoft: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(94,234,212,0.34)",
  textPrimary: "#CBD5E1",
  textSecondary: "#94A3B8",
  textTertiary: "#64748B",
  accent: "#5EEAD4",
  accentSoft: "rgba(94,234,212,0.14)",
  accentGlow: "rgba(94,234,212,0.22)",
  divider: "rgba(255,255,255,0.05)",
} as const;

export const onboardingGlass: ViewStyle =
  Platform.OS === "web"
    ? ({
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      } as ViewStyle)
    : {};

export const onboardingCardStyle: ViewStyle = {
  backgroundColor: onboardingDarkTheme.cardSoft,
  borderRadius: 32,
  borderWidth: 1,
  borderColor: onboardingDarkTheme.border,
  overflow: "hidden",
  ...onboardingGlass,
};

export const onboardingGlow = (
  opacity = 0.12,
  radius = 34,
): ViewStyle => ({
  shadowColor: onboardingDarkTheme.accent,
  shadowOffset: { width: 0, height: 18 },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation: 6,
});

export const onboardingEyebrow: TextStyle = {
  color: onboardingDarkTheme.accent,
  fontSize: 11,
  fontWeight: "500",
  letterSpacing: 1.8,
  textTransform: "uppercase",
};
