import { Languages } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { LocaleCode } from "../types/app";

type LanguageToggleProps = {
  locale: LocaleCode;
  onToggle: () => void;
};

export function LanguageToggle({ locale, onToggle }: LanguageToggleProps) {
  return (
    <Pressable
      onPress={onToggle}
      className="flex-row items-center rounded-full border border-slate-200 bg-white px-3 py-2"
      style={({ pressed }) => (pressed ? { opacity: 0.85 } : null)}
    >
      <Languages color="#0f766e" size={16} />
      <View className="ml-2">
        <Text className="text-[10px] font-semibold uppercase tracking-[1px] text-slate-400">
          {locale === "en" ? "EN" : "ES"}
        </Text>
      </View>
      <Text className="ml-2 text-xs font-semibold uppercase tracking-[1px] text-teal-700">
        {locale === "en" ? "ES" : "EN"}
      </Text>
    </Pressable>
  );
}
