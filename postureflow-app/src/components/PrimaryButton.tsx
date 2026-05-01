import { ArrowRight } from "lucide-react-native";
import { Pressable, Text, View, ViewStyle } from "react-native";
import {
  zenAmbientGlow,
  zenDarkTheme,
  zenGlassEffect,
} from "../theme/zen-dark";
import { ff, hairline, rs } from "../utils/responsive";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "dark";
  disabled?: boolean;
};

const shadowMap: Record<NonNullable<PrimaryButtonProps["variant"]>, ViewStyle> = {
  primary: zenAmbientGlow(0.22, rs(24), zenDarkTheme.accent),
  dark: zenAmbientGlow(0.18, rs(22)),
};

export function PrimaryButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: PrimaryButtonProps) {
  const isDark = variant === "dark";

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        shadowMap[variant],
        {
          width: "100%",
          minHeight: rs(64),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: rs(28),
          backgroundColor: isDark
            ? zenDarkTheme.surface
            : zenDarkTheme.buttonPrimary,
          borderWidth: hairline,
          borderColor: isDark
            ? zenDarkTheme.borderBright
            : zenDarkTheme.borderMuted,
          overflow: "hidden",
          paddingHorizontal: rs(22),
          paddingVertical: rs(14),
        },
        zenGlassEffect,
        disabled ? { opacity: 0.5 } : null,
        pressed ? { transform: [{ scale: 0.99 }] } : null,
      ]}
    >
      <Text
        style={{
          color: isDark ? zenDarkTheme.textPrimary : zenDarkTheme.textInverse,
          fontFamily: ff,
          fontSize: rs(16),
          fontWeight: "700",
          letterSpacing: -0.1,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          width: rs(40),
          height: rs(40),
          borderRadius: rs(17),
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDark
            ? zenDarkTheme.cardMuted
            : "rgba(20,18,16,0.12)",
        }}
      >
        <ArrowRight
          color={isDark ? zenDarkTheme.textSecondary : zenDarkTheme.textInverse}
          size={rs(18)}
          strokeWidth={1.7}
        />
      </View>
    </Pressable>
  );
}
