import { Platform, StyleSheet } from "react-native";
import type { TextStyle, ViewStyle } from "react-native";

export const zenDarkTheme = {
  canvas: "#EDEAE4",
  canvasAlt: "#E5E1DA",
  canvasDeep: "#D8D4CC",
  peachWash: "#E8E4DC",
  porcelain: "#E8E4DC",
  surface: "#E8E4DC",
  surfaceMuted: "#DEDAD2",
  surfaceGlass: "rgba(232,228,220,0.95)",
  surfaceOverlay: "rgba(237,234,228,0.90)",
  surfacePressed: "rgba(176,112,80,0.12)",
  card: "#E5E1DA",
  cardMuted: "#DEDAD2",
  border: "#CCC8C0",
  borderBright: "#CCC8C0",
  borderMuted: "#CCC8C0",
  accent: "#B07050",
  accentStrong: "#B07050",
  accentSoft: "rgba(176,112,80,0.12)",
  accentGlow: "rgba(176,112,80,0.14)",
  violet: "#2A2520",
  violetStrong: "#2A2520",
  violetSoft: "rgba(42,37,32,0.08)",
  violetGlow: "rgba(42,37,32,0.12)",
  buttonPrimary: "#B07050",
  textPrimary: "#1C1814",
  textSecondary: "#6A6560",
  textTertiary: "#9A9590",
  textInverse: "#EDEAE4",
  input: "#E8E4DC",
  sandSoft: "rgba(255,255,255,0.62)",
} as const;

export const zenGlassEffect: ViewStyle =
  Platform.OS === "web"
    ? ({
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      } as ViewStyle)
    : {};

export const zenCardStyle: ViewStyle = {
  backgroundColor: zenDarkTheme.surfaceGlass,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: zenDarkTheme.borderBright,
  ...zenGlassEffect,
};

export const zenCardShadow: ViewStyle = {
  shadowColor: zenDarkTheme.violet,
  shadowOffset: { width: 0, height: 18 },
  shadowOpacity: 0.1,
  shadowRadius: 28,
  elevation: 6,
};

export const zenPeachShadow: ViewStyle = {
  shadowColor: zenDarkTheme.accent,
  shadowOffset: { width: 0, height: 14 },
  shadowOpacity: 0.12,
  shadowRadius: 24,
  elevation: 5,
};

export const zenAmbientGlow = (
  opacity = 0.12,
  radius = 22,
  color: ViewStyle["shadowColor"] = zenDarkTheme.violet,
): ViewStyle => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: 16 },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation: 5,
});

export const zenEyebrowText: TextStyle = {
  color: zenDarkTheme.textTertiary,
  fontSize: 11,
  fontWeight: "500",
  letterSpacing: 1.2,
  textTransform: "uppercase",
};
