import { Pressable, Text, View } from "react-native";
import { zenDarkTheme } from "../theme/zen-dark";
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
}: LanguageToggleProps) {
  return (
    <Pressable
      className="h-8 w-20 flex-row items-center rounded-full border border-[#DDD5CA] bg-[#F8F5EF] p-1"
      onPress={onToggle}
    >
      {(["en", "es"] as const).map((item) => {
        const active = locale === item;

        return (
          <View
            key={item}
            className={`h-6 flex-1 items-center justify-center rounded-full ${
              active ? "bg-[#1B1815]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-xs font-black uppercase ${
                active ? "text-white" : "text-[#8C857B]"
              }`}
              style={{
                fontFamily: ff,
                fontSize: rs(11),
                includeFontPadding: false,
              }}
            >
              {item.toUpperCase()}
            </Text>
          </View>
        );
      })}
    </Pressable>
  );
}
