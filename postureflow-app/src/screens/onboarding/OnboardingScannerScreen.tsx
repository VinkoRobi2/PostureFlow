import { StatusBar } from "expo-status-bar";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BiomechanicalScanner } from "../../components/BiomechanicalScanner";
import { createFallbackBootstrap } from "../../data/fallback-data";
import { useAppModel } from "../../providers/app-provider";
import { onboardingDarkTheme } from "../../theme/onboarding-pro-dark";
import type { AppScreenProps } from "../../types/app";
import { ff, hairline, rs, screenPadH } from "../../utils/responsive";

type Props = AppScreenProps<"OnboardingScanner">;

const H = Dimensions.get("window").height;

export function OnboardingScannerScreen({ navigation }: Props) {
  const {
    bootstrap,
    locale,
    painSelection,
    setPainSelection,
    toggleLocale,
  } = useAppModel();
  const resolvedBootstrap = bootstrap ?? createFallbackBootstrap(locale);

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
          minHeight: H,
          paddingHorizontal: screenPadH,
          paddingTop: rs(24),
          paddingBottom: rs(18),
        }}
      >
        <View style={{ flex: 1, height: "100%", minHeight: 0 }}>
          <View
            style={{
              alignItems: "flex-end",
              marginBottom: rs(12),
            }}
          >
            <Pressable
              onPress={() => void toggleLocale()}
              style={{
                flexDirection: "row",
                gap: rs(4),
                backgroundColor: onboardingDarkTheme.card,
                borderWidth: hairline,
                borderColor: onboardingDarkTheme.border,
                borderRadius: rs(999),
                padding: rs(3),
              }}
            >
              <Text
                style={{
                  backgroundColor:
                    locale === "en"
                      ? onboardingDarkTheme.violetStrong
                      : "transparent",
                  color:
                    locale === "en"
                      ? onboardingDarkTheme.background
                      : onboardingDarkTheme.textTertiary,
                  fontFamily: ff,
                  fontSize: rs(11),
                  fontWeight: "700",
                  paddingHorizontal: rs(12),
                  paddingVertical: rs(4),
                  borderRadius: rs(999),
                }}
              >
                EN
              </Text>
              <Text
                style={{
                  backgroundColor:
                    locale === "es"
                      ? onboardingDarkTheme.violetStrong
                      : "transparent",
                  color:
                    locale === "es"
                      ? onboardingDarkTheme.background
                      : onboardingDarkTheme.textTertiary,
                  fontFamily: ff,
                  fontSize: rs(11),
                  fontWeight: "700",
                  paddingHorizontal: rs(12),
                  paddingVertical: rs(4),
                  borderRadius: rs(999),
                }}
              >
                ES
              </Text>
            </Pressable>
          </View>

          <View style={{ marginBottom: rs(12) }}>
            <Text
              style={{
                color: onboardingDarkTheme.accentStrong,
                fontFamily: ff,
                fontSize: rs(10),
                fontWeight: "800",
                letterSpacing: 2.5,
                marginBottom: rs(12),
                textTransform: "uppercase",
              }}
            >
              {locale === "es" ? "Paso 3 de 3" : "Step 3 of 3"}
            </Text>

            <Text
              style={{
                color: onboardingDarkTheme.textPrimary,
                fontFamily: ff,
                fontSize: rs(38),
                fontWeight: "800",
                lineHeight: rs(40),
                letterSpacing: -1.5,
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
