import { Pressable, Text, View } from "react-native";
import { OnboardingFrame } from "../../components/onboarding/OnboardingFrame";
import { useAppModel } from "../../providers/app-provider";
import {
  onboardingCardStyle,
  onboardingDarkTheme,
  onboardingEyebrow,
  onboardingGlow,
} from "../../theme/onboarding-pro-dark";
import type { AppScreenProps } from "../../types/app";
import { getLocalizedOnboardingText } from "./content";

type Props = AppScreenProps<"OnboardingSolution">;

export function OnboardingSolutionScreen({ navigation }: Props) {
  const { locale } = useAppModel();
  const copy = getLocalizedOnboardingText(locale);
  const supportText =
    locale === "es"
      ? "Recuperación segura para oficina, respiración guiada y un alivio que se siente antes de que termine una canción."
      : "Office-safe recovery, guided breathwork, and relief you can feel before a song ends.";

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => navigation.replace("OnboardingName")}
    >
      <OnboardingFrame
        footer={
          <View style={{ paddingHorizontal: 24, paddingBottom: 26 }}>
            <Text
              style={{
                textAlign: "center",
                color: onboardingDarkTheme.textTertiary,
                fontSize: 12,
                fontWeight: "500",
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              {copy.continueTap}
            </Text>
          </View>
        }
      >
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={{ marginTop: 48 }}>
            <Text style={onboardingEyebrow}>The Solution</Text>
            <Text
              style={{
                marginTop: 18,
                color: onboardingDarkTheme.textPrimary,
                fontSize: 36,
                fontWeight: "400",
                lineHeight: 44,
                letterSpacing: -1,
              }}
            >
              {copy.solutionTitle}
            </Text>
          </View>

          <View
            style={[
              onboardingCardStyle,
              onboardingGlow(0.12, 30),
              {
                padding: 24,
                borderColor: onboardingDarkTheme.borderStrong,
              },
            ]}
          >
            <Text
              style={{
                color: onboardingDarkTheme.accent,
                fontSize: 28,
                fontWeight: "400",
                letterSpacing: -0.8,
              }}
            >
              3 min
            </Text>
            <Text
              style={{
                marginTop: 10,
                color: onboardingDarkTheme.textSecondary,
                fontSize: 16,
                fontWeight: "400",
                lineHeight: 26,
              }}
            >
              {supportText}
            </Text>
          </View>
        </View>
      </OnboardingFrame>
    </Pressable>
  );
}
