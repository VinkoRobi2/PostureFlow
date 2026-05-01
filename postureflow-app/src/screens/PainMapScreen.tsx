import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BiomechanicalScanner } from "../components/BiomechanicalScanner";
import { LanguageToggle } from "../components/LanguageToggle";
import { ScreenAtmosphere } from "../components/ScreenAtmosphere";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import { zenDarkTheme } from "../theme/zen-dark";
import type { AppScreenProps } from "../types/app";

type Props = AppScreenProps<"PainMap">;

export function PainMapScreen({ navigation }: Props) {
  const {
    bootstrap,
    locale,
    painSelection,
    setPainSelection,
    toggleLocale,
  } = useAppModel();
  const copy = messages[locale];

  if (!bootstrap) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: zenDarkTheme.canvas,
        }}
      >
        <Text
          style={{
            color: zenDarkTheme.textSecondary,
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          {copy.common.loading}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: zenDarkTheme.canvas }}>
      <ScreenAtmosphere />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flex: 1,
            maxWidth: 460,
            alignSelf: "center",
            width: "100%",
            paddingHorizontal: 26,
            paddingTop: 22,
            paddingBottom: 28,
          }}
        >
          <View
            style={{
              marginBottom: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  color: zenDarkTheme.textTertiary,
                  fontSize: 11,
                  fontWeight: "800",
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                }}
              >
                {copy.painMap.step}
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  color: zenDarkTheme.textPrimary,
                  fontSize: 26,
                  fontWeight: "900",
                  letterSpacing: -0.6,
                }}
              >
                {copy.painMap.scanner}
              </Text>
            </View>
            <LanguageToggle
              locale={locale}
              onToggle={() => void toggleLocale()}
              variant="dark"
            />
          </View>

          <BiomechanicalScanner
            initialSelectedParts={painSelection}
            locale={locale}
            painRegions={bootstrap.onboarding.painRegions}
            onConfirm={(selectedParts) => {
              setPainSelection(selectedParts);
              navigation.navigate("Setup");
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
