import { Text, View } from "react-native";
import { BiomechanicalScanner } from "../../components/BiomechanicalScanner";
import { OnboardingFrame } from "../../components/onboarding/OnboardingFrame";
import { createFallbackBootstrap } from "../../data/fallback-data";
import { useAppModel } from "../../providers/app-provider";
import {
  onboardingDarkTheme,
  onboardingEyebrow,
} from "../../theme/onboarding-pro-dark";
import type { AppScreenProps } from "../../types/app";
import { getLocalizedOnboardingText } from "./content";

type Props = AppScreenProps<"OnboardingScanner">;

export function OnboardingScannerScreen({ navigation }: Props) {
  const {
    bootstrap,
    locale,
    onboardingDraft,
    painSelection,
    setPainSelection,
  } = useAppModel();
  const copy = getLocalizedOnboardingText(locale);
  const resolvedBootstrap = bootstrap ?? createFallbackBootstrap(locale);

  return (
    <OnboardingFrame contentStyle={{ flex: 1, paddingBottom: 18 }}>
      <View style={{ flex: 1 }}>
        <View style={{ marginBottom: 18 }}>
          <Text style={onboardingEyebrow}>Biomechanical Scanner</Text>
          <Text
            style={{
              marginTop: 12,
              color: onboardingDarkTheme.textPrimary,
              fontSize: 28,
              fontWeight: "400",
              lineHeight: 36,
              letterSpacing: -0.8,
            }}
          >
            {copy.scannerGreeting(onboardingDraft.firstName)}
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
    </OnboardingFrame>
  );
}
