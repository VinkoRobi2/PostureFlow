import { Languages } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { zenDarkTheme } from "../theme/zen-dark";
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
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: isDark ? zenDarkTheme.border : zenDarkTheme.borderMuted,
        backgroundColor: isDark
          ? zenDarkTheme.surfaceGlass
          : zenDarkTheme.textPrimary,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Languages
        color={isDark ? zenDarkTheme.textSecondary : zenDarkTheme.accent}
        size={16}
      />
      <View style={{ marginLeft: 8 }}>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "600",
            letterSpacing: 1,
            textTransform: "uppercase",
            color: isDark ? zenDarkTheme.textTertiary : zenDarkTheme.textSecondary,
          }}
        >
          {locale === "en" ? "EN" : "ES"}
        </Text>
      </View>
      <Text
        style={{
          marginLeft: 8,
          fontSize: 12,
          fontWeight: "600",
          letterSpacing: 1,
          textTransform: "uppercase",
          color: isDark ? zenDarkTheme.accentStrong : zenDarkTheme.accent,
        }}
      >
        {locale === "en" ? "ES" : "EN"}
      </Text>
    </Pressable>
  );
}
