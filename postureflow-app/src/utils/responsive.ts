import { Dimensions, PixelRatio, Platform } from "react-native";

const BASE_WIDTH = 390;

const { width: W } = Dimensions.get("window");

// Escala proporcional al ancho, con cap en 1.15x para tablets
export const rs = (size: number): number =>
  Math.round(size * Math.min(W / BASE_WIDTH, 1.15));

// 1px fisico real para separadores y bordes finos en cualquier densidad Android
export const hairline = 1 / PixelRatio.get();

// Font family nativa por plataforma
export const ff = Platform.select({
  ios: "DM Sans",
  android: "Roboto",
  default: "System",
});

// Padding horizontal de pantalla consistente en todo el onboarding
export const screenPadH = rs(24);

// Padding vertical top, respeta notch/statusbar
export const screenPadT = rs(52);
