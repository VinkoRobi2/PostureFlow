import {
  BatteryLow,
  CheckCircle2,
  Cpu,
  Eye,
} from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LanguageToggle } from "../components/LanguageToggle";
import { PrimaryButton } from "../components/PrimaryButton";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import type { AppScreenProps } from "../types/app";
import { getLocalizedText } from "../utils/localize";

type Props = AppScreenProps<"Setup">;

const iconMap = {
  Cpu,
  Eye,
  BatteryLow,
} as const;

const SCREEN_THEME = {
  background: "#000000",
  surface: "#11151B",
  surfaceAlt: "#14161B",
  border: "#242A33",
  borderStrong: "#303744",
  accent: "#10B981",
  accentStroke: "#34D399",
  primaryText: "#E4E4E7",
  secondaryText: "#A1A1AA",
  tertiaryText: "#6B7280",
} as const;

export function SetupScreen({ navigation }: Props) {
  const { bootstrap, locale, setupSelection, setSetupSelection, toggleLocale } =
    useAppModel();
  const copy = messages[locale];

  if (!bootstrap) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: SCREEN_THEME.background,
        }}
      >
        <Text
          style={{
            color: SCREEN_THEME.secondaryText,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {copy.common.loading}
        </Text>
      </SafeAreaView>
    );
  }

  const availableOptionIds = bootstrap.onboarding.setupOptions.map((option) => option.id);
  const activeSelection = setupSelection.filter((id) =>
    availableOptionIds.includes(id),
  );

  const toggleOption = (id: string) => {
    setSetupSelection(
      activeSelection.includes(id)
        ? activeSelection.filter((value) => value !== id)
        : [id],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SCREEN_THEME.background }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          maxWidth: 460,
          alignSelf: "center",
          width: "100%",
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 28,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            marginBottom: 26,
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, paddingRight: 16 }}>
            <View
              style={{
                marginBottom: 16,
                alignSelf: "flex-start",
                borderRadius: 999,
                backgroundColor: SCREEN_THEME.surfaceAlt,
                borderWidth: 1,
                borderColor: SCREEN_THEME.border,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text
                style={{
                  color: SCREEN_THEME.accent,
                  fontSize: 11,
                  fontWeight: "700",
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                }}
              >
                {copy.setup.step}
              </Text>
            </View>

            <Text
              style={{
                color: SCREEN_THEME.primaryText,
                fontSize: 29,
                fontWeight: "700",
                lineHeight: 34,
              }}
            >
              {copy.setup.title}
            </Text>

            <Text
              style={{
                color: SCREEN_THEME.secondaryText,
                fontSize: 15,
                lineHeight: 22,
                marginTop: 10,
                maxWidth: 310,
              }}
            >
              {copy.setup.subtitle}
            </Text>
          </View>

          <LanguageToggle
            locale={locale}
            onToggle={() => void toggleLocale()}
            variant="dark"
          />
        </View>

        <View style={{ flex: 1 }}>
          {bootstrap.onboarding.setupOptions.map((option, index) => {
            const isSelected = activeSelection.includes(option.id);
            const Icon = iconMap[option.icon as keyof typeof iconMap] ?? Cpu;

            return (
              <Pressable
                key={option.id}
                onPress={() => toggleOption(option.id)}
                style={({ pressed }) => ({
                  marginBottom:
                    index === bootstrap.onboarding.setupOptions.length - 1 ? 0 : 14,
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: isSelected
                    ? SCREEN_THEME.accentStroke
                    : SCREEN_THEME.border,
                  backgroundColor: isSelected
                    ? SCREEN_THEME.surfaceAlt
                    : SCREEN_THEME.surface,
                  shadowColor: SCREEN_THEME.accent,
                  shadowOpacity: isSelected ? 0.22 : 0,
                  shadowRadius: 18,
                  shadowOffset: { width: 0, height: 8 },
                  elevation: isSelected ? 6 : 0,
                  opacity: pressed ? 0.94 : 1,
                })}
              >
                <View
                  style={{
                    borderRadius: 24,
                    paddingHorizontal: 18,
                    paddingVertical: 18,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 62,
                        height: 62,
                        borderRadius: 20,
                        backgroundColor: isSelected
                          ? "rgba(16,185,129,0.14)"
                          : SCREEN_THEME.background,
                        borderWidth: 1,
                        borderColor: isSelected
                          ? "rgba(16,185,129,0.28)"
                          : SCREEN_THEME.border,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 16,
                      }}
                    >
                      <Icon
                        color={isSelected ? SCREEN_THEME.accent : SCREEN_THEME.secondaryText}
                        size={24}
                        strokeWidth={1.5}
                      />
                    </View>

                    <View style={{ flex: 1, paddingRight: 12 }}>
                      <Text
                        style={{
                          color: SCREEN_THEME.primaryText,
                          fontSize: 18,
                          fontWeight: "600",
                          lineHeight: 23,
                          marginBottom: 5,
                        }}
                      >
                        {getLocalizedText(option.title, locale)}
                      </Text>
                      <Text
                        style={{
                          color: SCREEN_THEME.secondaryText,
                          fontSize: 13,
                          lineHeight: 19,
                        }}
                      >
                        {getLocalizedText(option.description, locale)}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 999,
                        borderWidth: 1.5,
                        borderColor: isSelected
                          ? SCREEN_THEME.accentStroke
                          : SCREEN_THEME.borderStrong,
                        backgroundColor: isSelected
                          ? "rgba(16,185,129,0.12)"
                          : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isSelected ? (
                        <CheckCircle2
                          color={SCREEN_THEME.accent}
                          size={18}
                          strokeWidth={1.8}
                        />
                      ) : null}
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={{ paddingTop: 22 }}>
          <PrimaryButton
            label={copy.common.generateProgram}
            onPress={() => navigation.navigate("Analyzing")}
            variant="teal"
            disabled={activeSelection.length === 0}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
