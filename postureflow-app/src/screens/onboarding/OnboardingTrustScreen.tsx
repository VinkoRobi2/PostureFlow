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

type Props = AppScreenProps<"OnboardingTrust">;

export function OnboardingTrustScreen({ navigation }: Props) {
  const { locale } = useAppModel();
  const copy = getLocalizedOnboardingText(locale);
  const trustLabel = locale === "es" ? "Capa de Confianza" : "Trust Layer";

  return (
    <OnboardingFrame>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={{ marginTop: 36 }}>
          <Text style={onboardingEyebrow}>{copy.paywallBadge}</Text>
          <Text
            style={{
              marginTop: 16,
              color: onboardingDarkTheme.textPrimary,
              fontSize: 36,
              fontWeight: "400",
              lineHeight: 44,
              letterSpacing: -1,
            }}
          >
            {copy.paywallTitle}
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
              fontSize: 12,
              fontWeight: "500",
              letterSpacing: 1.6,
              textTransform: "uppercase",
            }}
          >
            {trustLabel}
          </Text>
          <Text
            style={{
              marginTop: 14,
              color: onboardingDarkTheme.textPrimary,
              fontSize: 18,
              fontWeight: "400",
              lineHeight: 30,
            }}
          >
            {copy.paywallTrust}
          </Text>
        </View>

        <View>
          <Pressable
            onPress={() => navigation.replace("Auth", { mode: "register" })}
            style={{
              borderRadius: 32,
              backgroundColor: onboardingDarkTheme.accentSoft,
              borderWidth: 1,
              borderColor: onboardingDarkTheme.borderStrong,
              paddingVertical: 18,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: onboardingDarkTheme.textPrimary,
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              {copy.paywallCta}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.replace("Auth", { mode: "login" })}
            style={{
              marginTop: 16,
              paddingVertical: 14,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: onboardingDarkTheme.textSecondary,
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              {copy.paywallSecondary}
            </Text>
          </Pressable>
        </View>
      </View>
    </OnboardingFrame>
  );
}
