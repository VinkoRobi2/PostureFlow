import { Languages } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { LocaleCode } from "../types/app";

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

  return (
    <Pressable
      onPress={onToggle}
      className={`flex-row items-center rounded-full px-3 py-2 ${
        isDark
          ? "border border-zinc-800 bg-zinc-950"
          : "border border-slate-200 bg-white"
      }`}
      style={({ pressed }) => (pressed ? { opacity: 0.85 } : null)}
    >
      <Languages color={isDark ? "#A1A1AA" : "#0f766e"} size={16} />
      <View className="ml-2">
        <Text
          className={`text-[10px] font-semibold uppercase tracking-[1px] ${
            isDark ? "text-zinc-500" : "text-slate-400"
          }`}
        >
          {locale === "en" ? "EN" : "ES"}
        </Text>
      </View>
      <Text
        className={`ml-2 text-xs font-semibold uppercase tracking-[1px] ${
          isDark ? "text-emerald-400" : "text-teal-700"
        }`}
      >
        {locale === "en" ? "ES" : "EN"}
      </Text>
    </Pressable>
  );
}
