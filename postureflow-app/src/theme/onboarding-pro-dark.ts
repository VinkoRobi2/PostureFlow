import { Platform, StyleSheet } from "react-native";
import type { TextStyle, ViewStyle } from "react-native";

export const onboardingDarkTheme = {
  background: "#EDEAE4",
  backgroundRaised: "#DEDAD2",
  backgroundDeep: "#D8D4CC",
  peachWash: "#E8E4DC",
  porcelain: "#E8E4DC",
  card: "#E5E1DA",
  cardSoft: "#E8E4DC",
  cardSheen: "rgba(176,112,80,0.08)",
  surfaceMuted: "#DEDAD2",
  border: "#CCC8C0",
  borderBright: "#CCC8C0",
  borderStrong: "#CCC8C0",
  textPrimary: "#1C1814",
  textSecondary: "#6A6560",
  textTertiary: "#9A9590",
  accent: "#B07050",
  accentStrong: "#B07050",
  accentSoft: "rgba(176,112,80,0.12)",
  accentGlow: "rgba(176,112,80,0.14)",
  violet: "#2A2520",
  violetStrong: "#2A2520",
  violetSoft: "rgba(42,37,32,0.08)",
  crystal: "rgba(255,255,255,0.72)",
  divider: "#CCC8C0",
} as const;

export const onboardingGlass: ViewStyle =
  Platform.OS === "web"
    ? ({
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      } as ViewStyle)
    : {};

export const onboardingCardStyle: ViewStyle = {
  backgroundColor: onboardingDarkTheme.cardSoft,
  borderRadius: 30,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: onboardingDarkTheme.borderBright,
  overflow: "hidden",
  ...onboardingGlass,
};

export const onboardingGlow = (
  opacity = 0.12,
  radius = 22,
  color: ViewStyle["shadowColor"] = onboardingDarkTheme.violet,
): ViewStyle => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: 16 },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation: 5,
});

export const onboardingPeachGlow = (
  opacity = 0.16,
  radius = 24,
): ViewStyle => onboardingGlow(opacity, radius, onboardingDarkTheme.accent);

export const onboardingEyebrow: TextStyle = {
  color: onboardingDarkTheme.textTertiary,
  fontSize: 11,
  fontWeight: "500",
  letterSpacing: 1.7,
  textTransform: "uppercase",
};

export const onboardingTitle: TextStyle = {
  color: onboardingDarkTheme.textPrimary,
  fontSize: 36,
  fontWeight: "700",
  lineHeight: 44,
  letterSpacing: -0.55,
};

export const onboardingBody: TextStyle = {
  color: onboardingDarkTheme.textSecondary,
  fontSize: 16,
  fontWeight: "400",
  lineHeight: 25,
};

export const onboardingPrimaryButton: ViewStyle = {
  borderRadius: 26,
  backgroundColor: onboardingDarkTheme.accent,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: onboardingDarkTheme.borderStrong,
  paddingVertical: 18,
};
