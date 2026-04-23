import {
  BatteryLow,
  CheckCircle2,
  Cpu,
  Eye,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LanguageToggle } from "../components/LanguageToggle";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenAtmosphere } from "../components/ScreenAtmosphere";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import { zenDarkTheme, zenGlassEffect } from "../theme/zen-dark";
import type { AppScreenProps } from "../types/app";
import { getLocalizedText } from "../utils/localize";

type Props = AppScreenProps<"Setup">;

const iconMap = {
  Cpu,
  Eye,
  BatteryLow,
} as const;

const SCREEN_THEME = {
  background: zenDarkTheme.canvas,
  surface: zenDarkTheme.surfaceGlass,
  surfaceAlt: zenDarkTheme.surface,
  border: zenDarkTheme.border,
  borderStrong: zenDarkTheme.borderMuted,
  accent: zenDarkTheme.accent,
  accentStroke: zenDarkTheme.accentStrong,
  primaryText: zenDarkTheme.textPrimary,
  secondaryText: zenDarkTheme.textSecondary,
  tertiaryText: zenDarkTheme.textTertiary,
} as const;

export function SetupScreen({ navigation }: Props) {
  const { bootstrap, locale, setupSelection, setSetupSelection, toggleLocale } =
    useAppModel();
  const copy = messages[locale];
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const availableOptionIds = bootstrap?.onboarding.setupOptions.map((option) => option.id) ?? [];
  const syncedSelection = setupSelection.filter((id) =>
    availableOptionIds.includes(id),
  );

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

  const persistedSelectionId = syncedSelection[0] ?? null;
  const activeSelectionId = selectedOptionId ?? persistedSelectionId;
  const activeSelection = activeSelectionId ? [activeSelectionId] : [];

  const selectOption = (id: string) => {
    if (activeSelectionId === id) {
      return;
    }

    setSelectedOptionId(id);
    setSetupSelection([id]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SCREEN_THEME.background }}>
      <ScreenAtmosphere />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          maxWidth: 460,
          alignSelf: "center",
          width: "100%",
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 32,
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
                backgroundColor: SCREEN_THEME.surface,
                borderWidth: 1,
                borderColor: SCREEN_THEME.border,
                paddingHorizontal: 12,
                paddingVertical: 6,
                ...zenGlassEffect,
              }}
            >
              <Text
                style={{
                  color: SCREEN_THEME.accent,
                  fontSize: 11,
                  fontWeight: "500",
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
                fontSize: 30,
                fontWeight: "400",
                lineHeight: 38,
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
                fontWeight: "400",
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
                onPress={() => selectOption(option.id)}
                style={({ pressed }) => ({
                  marginBottom:
                    index === bootstrap.onboarding.setupOptions.length - 1 ? 0 : 14,
                  borderRadius: 32,
                  borderWidth: 1,
                  borderColor: isSelected
                    ? SCREEN_THEME.accentStroke
                    : SCREEN_THEME.border,
                  backgroundColor: isSelected
                    ? "rgba(94,234,212,0.10)"
                    : SCREEN_THEME.surface,
                  shadowColor: SCREEN_THEME.accent,
                  shadowOpacity: isSelected ? 0.12 : 0.04,
                  shadowRadius: isSelected ? 26 : 20,
                  shadowOffset: { width: 0, height: 14 },
                  elevation: isSelected ? 5 : 2,
                  opacity: pressed ? 0.94 : 1,
                  overflow: "hidden",
                })}
              >
                <View
                  style={{
                    borderRadius: 32,
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                    ...zenGlassEffect,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 62,
                        height: 62,
                        borderRadius: 24,
                        backgroundColor: isSelected
                          ? zenDarkTheme.accentSoft
                          : zenDarkTheme.cardMuted,
                        borderWidth: 1,
                        borderColor: isSelected
                          ? "rgba(94,234,212,0.24)"
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
                          fontWeight: "500",
                          lineHeight: 24,
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
                          fontWeight: "400",
                        }}
                      >
                        {getLocalizedText(option.description, locale)}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: isSelected
                          ? SCREEN_THEME.accentStroke
                          : SCREEN_THEME.borderStrong,
                        backgroundColor: isSelected
                          ? zenDarkTheme.accentSoft
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
            onPress={() => {
              if (activeSelectionId) {
                setSetupSelection([activeSelectionId]);
              }
              navigation.navigate("Analyzing");
            }}
            variant="teal"
            disabled={activeSelection.length === 0}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
