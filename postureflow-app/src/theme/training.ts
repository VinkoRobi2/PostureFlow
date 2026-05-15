import type { ViewStyle } from "react-native";

export const trainingTheme = {
  background: "#332E2A",
  backgroundDeep: "#282420",
  surface: "#403934",
  surfaceRaised: "#4A433D",
  border: "rgba(244, 236, 226, 0.16)",
  borderStrong: "rgba(244, 236, 226, 0.28)",
  terracotta: "#B86F50",
  terracottaOverlay: "rgba(184, 111, 80, 0.58)",
  cinnamon: "#8C4A2F",
  cinnamonSoft: "rgba(140, 74, 47, 0.78)",
  cream: "#F4ECE2",
  textPrimary: "#F4ECE2",
  textSecondary: "#CFC2B6",
  textMuted: "#A99B91",
  shadow: "#1C1714",
} as const;

export const trainingShadow = (opacity = 0.2, radius = 22): ViewStyle => ({
  shadowColor: trainingTheme.shadow,
  shadowOffset: { width: 0, height: 16 },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation: 6,
});
