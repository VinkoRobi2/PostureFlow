import { Languages } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { zenDarkTheme, zenGlassEffect } from "../theme/zen-dark";
import { LocaleCode } from "../types/app";
import { ff, rs } from "../utils/responsive";

type LanguageToggleProps = {
  locale: LocaleCode;
  onToggle: () => void;
  variant?: "light" | "dark";
};

export function LanguageToggle({
  locale,
  onToggle,
  variant = "light",
}: LanguageToggleProps) {
  const isDark = variant === "dark";
  const activeBg = isDark ? zenDarkTheme.accentSoft : zenDarkTheme.accentSoft;
  const inactiveText = isDark ? zenDarkTheme.textTertiary : zenDarkTheme.textSecondary;

  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        borderRadius: rs(999),
        padding: rs(4),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: isDark ? zenDarkTheme.borderBright : zenDarkTheme.borderMuted,
        backgroundColor: isDark
          ? zenDarkTheme.surfaceGlass
          : zenDarkTheme.surfaceGlass,
        ...zenGlassEffect,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Languages
        color={inactiveText}
        size={rs(14)}
        strokeWidth={1.6}
      />
      <View
        style={{
          marginLeft: rs(6),
          flexDirection: "row",
          borderRadius: rs(999),
          overflow: "hidden",
        }}
      >
        <Text
          style={{
            minWidth: rs(32),
            paddingHorizontal: rs(8),
            paddingVertical: rs(5),
            borderRadius: rs(999),
            backgroundColor: locale === "en" ? activeBg : "transparent",
            fontFamily: ff,
            fontSize: rs(10),
            fontWeight: "700",
            letterSpacing: 0.8,
            textTransform: "uppercase",
            textAlign: "center",
            color: locale === "en" ? zenDarkTheme.textPrimary : inactiveText,
          }}
        >
          EN
        </Text>
        <Text
          style={{
            minWidth: rs(32),
            paddingHorizontal: rs(8),
            paddingVertical: rs(5),
            borderRadius: rs(999),
            backgroundColor: locale === "es" ? activeBg : "transparent",
            fontFamily: ff,
            fontSize: rs(10),
            fontWeight: "700",
            letterSpacing: 0.8,
            textTransform: "uppercase",
            textAlign: "center",
            color: locale === "es" ? zenDarkTheme.textPrimary : inactiveText,
          }}
        >
          ES
        </Text>
      </View>
    </Pressable>
  );
}
