import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BiomechanicalScanner } from "../../components/BiomechanicalScanner";
import { LanguageToggle } from "../../components/LanguageToggle";
import { createFallbackBootstrap } from "../../data/fallback-data";
import { useAppModel } from "../../providers/app-provider";
import { onboardingDarkTheme } from "../../theme/onboarding-pro-dark";
import type { AppScreenProps } from "../../types/app";
import { ff, rs, screenPadH } from "../../utils/responsive";

type Props = AppScreenProps<"OnboardingScanner">;

export function OnboardingScannerScreen({ navigation }: Props) {
  const { height: screenH, width: screenW } = useWindowDimensions();
  const {
    bootstrap,
    locale,
    painSelection,
    setPainSelection,
    toggleLocale,
  } = useAppModel();
  const resolvedBootstrap = bootstrap ?? createFallbackBootstrap(locale);
  const compactScreen = screenH < 720 || screenW < 380;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: onboardingDarkTheme.background }}>
      <StatusBar style="dark" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          width: "100%",
          maxWidth: rs(460),
          alignSelf: "center",
          minHeight: screenH,
          paddingHorizontal: screenPadH,
          paddingTop: compactScreen ? rs(14) : rs(24),
          paddingBottom: compactScreen ? rs(14) : rs(18),
        }}
      >
        <View style={{ flexGrow: 1 }}>
          <View
            style={{
              alignItems: "flex-end",
              marginBottom: compactScreen ? rs(8) : rs(12),
            }}
          >
            <LanguageToggle locale={locale} onToggle={() => void toggleLocale()} />
          </View>

          <View style={{ marginBottom: compactScreen ? rs(10) : rs(12) }}>
            <Text
              style={{
                color: onboardingDarkTheme.accentStrong,
                fontFamily: ff,
                fontSize: rs(10),
                fontWeight: "800",
                letterSpacing: 2.5,
                marginBottom: compactScreen ? rs(8) : rs(12),
                textTransform: "uppercase",
              }}
            >
              {locale === "es" ? "Paso 3 de 3" : "Step 3 of 3"}
            </Text>

            <Text
              style={{
                color: onboardingDarkTheme.textPrimary,
                fontFamily: ff,
                fontSize: compactScreen ? rs(31) : rs(38),
                fontWeight: "800",
                lineHeight: compactScreen ? rs(34) : rs(40),
              }}
            >
              {locale === "es"
                ? "Donde sientes\nla tension?"
                : "Where do you feel\ntension?"}
            </Text>

            <Text
              style={{
                color: onboardingDarkTheme.textTertiary,
                fontFamily: ff,
                fontSize: rs(13),
                fontWeight: "500",
                lineHeight: rs(20),
                marginTop: rs(8),
              }}
            >
              {locale === "es"
                ? "Toca las zonas. Calibra tu primer flujo."
                : "Tap zones. Calibrate your first flow."}
            </Text>
          </View>

          <BiomechanicalScanner
            initialSelectedParts={painSelection}
            locale={locale}
            painRegions={resolvedBootstrap.onboarding.painRegions}
            onConfirm={(selectedParts) => {
              setPainSelection(selectedParts);
              navigation.replace("OnboardingAha");
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
