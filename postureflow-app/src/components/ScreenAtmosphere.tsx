import { StyleSheet, View } from "react-native";
import { zenDarkTheme } from "../theme/zen-dark";

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: zenDarkTheme.canvas,
    overflow: "hidden",
  },
});

export function ScreenAtmosphere() {
  return <View pointerEvents="none" style={styles.base} />;
}
