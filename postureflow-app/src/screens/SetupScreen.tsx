import {
  BatteryLow,
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
import { zenAmbientGlow, zenDarkTheme, zenGlassEffect } from "../theme/zen-dark";
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
  accentStroke: zenDarkTheme.accent,
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
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          maxWidth: 460,
          alignSelf: "center",
          width: "100%",
          paddingHorizontal: 26,
          paddingTop: 34,
          paddingBottom: 34,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            marginBottom: 24,
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, paddingRight: 16 }}>
            <View
              style={{
                marginBottom: 14,
                alignSelf: "flex-start",
                borderRadius: 999,
                backgroundColor: zenDarkTheme.surfaceMuted,
                borderWidth: 1,
                borderColor: SCREEN_THEME.border,
                paddingHorizontal: 13,
                paddingVertical: 7,
                ...zenGlassEffect,
              }}
            >
              <Text
                style={{
                  color: SCREEN_THEME.accent,
                  fontSize: 11,
                  fontWeight: "500",
                  letterSpacing: 1.35,
                  textTransform: "uppercase",
                }}
              >
                {copy.setup.step}
              </Text>
            </View>

            <Text
              style={{
                color: SCREEN_THEME.primaryText,
                fontSize: 34,
                fontWeight: "500",
                lineHeight: 42,
                letterSpacing: -0.45,
              }}
            >
              {copy.setup.title}
            </Text>

            <Text
              style={{
                color: SCREEN_THEME.secondaryText,
                fontSize: 15,
                lineHeight: 24,
                marginTop: 12,
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

        <View
          style={{
            marginBottom: 18,
            borderRadius: 36,
            backgroundColor: zenDarkTheme.surface,
            borderWidth: 1,
            borderColor: zenDarkTheme.border,
            padding: 22,
            ...zenAmbientGlow(0.09, 24),
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 68,
                height: 68,
                borderRadius: 26,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: zenDarkTheme.accentSoft,
                borderWidth: 1,
                borderColor: zenDarkTheme.borderMuted,
                marginRight: 16,
              }}
            >
              <Text
                style={{
                  color: zenDarkTheme.accentStrong,
                  fontSize: 22,
                  fontWeight: "900",
                  letterSpacing: -0.5,
                }}
              >
                02
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: zenDarkTheme.textTertiary,
                  fontSize: 11,
                  fontWeight: "800",
                  letterSpacing: 1.3,
                  textTransform: "uppercase",
                }}
              >
                {locale === "es" ? "Calibracion" : "Calibration"}
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  color: zenDarkTheme.textPrimary,
                  fontSize: 22,
                  fontWeight: "800",
                  lineHeight: 28,
                  letterSpacing: -0.45,
                }}
              >
                {locale === "es"
                  ? "Elige el estado que mejor describe tu energia de trabajo."
                  : "Choose the state that best describes your work energy."}
              </Text>
            </View>
          </View>
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
                    index === bootstrap.onboarding.setupOptions.length - 1 ? 0 : 16,
                  borderRadius: 32,
                  borderWidth: isSelected ? 1 : 0,
                  borderColor: isSelected ? SCREEN_THEME.borderStrong : SCREEN_THEME.border,
                  backgroundColor: isSelected
                    ? zenDarkTheme.porcelain
                    : SCREEN_THEME.surface,
                  ...zenAmbientGlow(isSelected ? 0.12 : 0.04, isSelected ? 22 : 16),
                  opacity: pressed ? 0.94 : 1,
                  overflow: "hidden",
                })}
              >
                <View
                  style={{
                    borderRadius: 32,
                    paddingHorizontal: 18,
                    paddingVertical: 18,
                    ...zenGlassEffect,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        width: 38,
                        color: isSelected
                          ? zenDarkTheme.accentStrong
                          : zenDarkTheme.textTertiary,
                        fontSize: 20,
                        fontWeight: "900",
                        letterSpacing: -0.4,
                      }}
                    >
                      0{index + 1}
                    </Text>
                    <View
                      style={{
                        width: 62,
                        height: 62,
                        borderRadius: 23,
                        backgroundColor: isSelected
                          ? "rgba(255,190,168,0.18)"
                          : zenDarkTheme.cardMuted,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 14,
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
                          fontSize: 17,
                          fontWeight: "800",
                          lineHeight: 22,
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
                          fontWeight: "500",
                        }}
                      >
                        {getLocalizedText(option.description, locale)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={{ paddingTop: 24 }}>
          <PrimaryButton
            label={copy.common.generateProgram}
            onPress={() => {
              if (activeSelectionId) {
                setSetupSelection([activeSelectionId]);
              }
              navigation.navigate("Analyzing");
            }}
            variant="primary"
            disabled={activeSelection.length === 0}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
