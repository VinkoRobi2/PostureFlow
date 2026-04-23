import { StyleSheet, View } from "react-native";
import { zenDarkTheme } from "../theme/zen-dark";

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: zenDarkTheme.canvas,
    overflow: "hidden",
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
  },
});

export function ScreenAtmosphere() {
  return (
    <View pointerEvents="none" style={styles.base}>
      <View
        style={[
          styles.orb,
          {
            top: -120,
            right: -90,
            width: 260,
            height: 260,
            backgroundColor: zenDarkTheme.accentGlow,
            opacity: 0.45,
          },
        ]}
      />
      <View
        style={[
          styles.orb,
          {
            top: 180,
            left: -120,
            width: 280,
            height: 280,
            backgroundColor: "rgba(148,163,184,0.08)",
          },
        ]}
      />
      <View
        style={[
          styles.orb,
          {
            bottom: -140,
            right: -40,
            width: 320,
            height: 320,
            backgroundColor: "rgba(30,41,59,0.7)",
          },
        ]}
      />
    </View>
  );
}
