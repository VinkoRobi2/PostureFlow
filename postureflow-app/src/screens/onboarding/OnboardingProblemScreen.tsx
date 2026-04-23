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

type Props = AppScreenProps<"OnboardingProblem">;

export function OnboardingProblemScreen({ navigation }: Props) {
  const { locale } = useAppModel();
  const copy = getLocalizedOnboardingText(locale);

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => navigation.replace("OnboardingSolution")}
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
            <Text style={onboardingEyebrow}>The Problem</Text>
            <Text
              style={{
                marginTop: 18,
                color: onboardingDarkTheme.textPrimary,
                fontSize: 38,
                fontWeight: "400",
                lineHeight: 46,
                letterSpacing: -1.1,
              }}
            >
              {copy.problemTitle}
            </Text>
          </View>

          <View
            style={[
              onboardingCardStyle,
              onboardingGlow(0.08, 22),
              { padding: 24 },
            ]}
          >
            <Text
              style={{
                color: onboardingDarkTheme.accent,
                fontSize: 13,
                fontWeight: "500",
                letterSpacing: 1.4,
                textTransform: "uppercase",
              }}
            >
              140kg
            </Text>
            <Text
              style={{
                marginTop: 12,
                color: onboardingDarkTheme.textSecondary,
                fontSize: 17,
                fontWeight: "400",
                lineHeight: 28,
              }}
            >
              {copy.problemStat}
            </Text>
          </View>
        </View>
      </OnboardingFrame>
    </Pressable>
  );
}
