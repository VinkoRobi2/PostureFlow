import { ArrowRight } from "lucide-react-native";
import { Pressable, Text, ViewStyle } from "react-native";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "teal" | "dark";
  disabled?: boolean;
};

const shadowMap: Record<NonNullable<PrimaryButtonProps["variant"]>, ViewStyle> = {
  teal: {
    shadowColor: "#0f766e",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 5,
  },
  dark: {
    shadowColor: "#020617",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
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
        isDark ? "bg-slate-900" : "bg-teal-600"
      } ${disabled ? "opacity-50" : ""}`}
      style={({ pressed }) => [
        shadowMap[variant],
        pressed ? { transform: [{ scale: 0.98 }] } : null,
      ]}
    >
      <Text className="text-base font-semibold text-white">{label}</Text>
      <ArrowRight color="#ffffff" size={20} />
    </Pressable>
  );
}
