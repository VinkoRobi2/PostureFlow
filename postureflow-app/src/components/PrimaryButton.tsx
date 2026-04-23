import { ArrowRight } from "lucide-react-native";
import { Pressable, Text, ViewStyle } from "react-native";
import { zenAmbientGlow, zenDarkTheme } from "../theme/zen-dark";

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
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
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
      className={`w-full flex-row items-center justify-between rounded-[24px] px-7 py-4 ${
        disabled ? "opacity-50" : ""
      }`}
      style={({ pressed }) => [
        shadowMap[variant],
        {
          backgroundColor: isDark ? zenDarkTheme.surface : zenDarkTheme.accent,
          borderWidth: 1,
          borderColor: isDark
            ? zenDarkTheme.border
            : "rgba(52,211,153,0.28)",
        },
        pressed ? { transform: [{ scale: 0.98 }] } : null,
      ]}
    >
      <Text
        style={{
          color: isDark ? zenDarkTheme.textPrimary : zenDarkTheme.textInverse,
          fontSize: 16,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
      <ArrowRight
        color={isDark ? zenDarkTheme.textPrimary : zenDarkTheme.textInverse}
        size={20}
      />
    </Pressable>
  );
}
