import { ArrowRight } from "lucide-react-native";
import { Pressable, Text, View, ViewStyle } from "react-native";
import {
  zenAmbientGlow,
  zenDarkTheme,
  zenGlassEffect,
} from "../theme/zen-dark";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "teal" | "dark";
  disabled?: boolean;
};

const shadowMap: Record<NonNullable<PrimaryButtonProps["variant"]>, ViewStyle> = {
  teal: zenAmbientGlow(0.18, 26),
  dark: {
    shadowColor: zenDarkTheme.accent,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.06,
    shadowRadius: 28,
    elevation: 4,
  },
};

export function PrimaryButton({
  label,
  onPress,
  variant = "teal",
  disabled = false,
}: PrimaryButtonProps) {
  const isDark = variant === "dark";

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`w-full flex-row items-center justify-between rounded-[32px] px-7 py-4 ${
        disabled ? "opacity-50" : ""
      }`}
      style={({ pressed }) => [
        shadowMap[variant],
        {
          backgroundColor: isDark
            ? zenDarkTheme.surfaceGlass
            : "rgba(94,234,212,0.16)",
          borderWidth: 1,
          borderColor: isDark ? zenDarkTheme.border : zenDarkTheme.accent,
          overflow: "hidden",
        },
        zenGlassEffect,
        pressed ? { transform: [{ scale: 0.98 }] } : null,
      ]}
    >
      <Text
        style={{
          color: zenDarkTheme.textPrimary,
          fontSize: 16,
          fontWeight: "500",
        }}
      >
        {label}
      </Text>
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDark
            ? zenDarkTheme.whiteSoft
            : "rgba(255,255,255,0.12)",
        }}
      >
        <ArrowRight color={zenDarkTheme.textPrimary} size={18} />
      </View>
    </Pressable>
  );
}
