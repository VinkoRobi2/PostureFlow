import { Pressable, Text, View } from "react-native";
import { OnboardingFrame } from "../../components/onboarding/OnboardingFrame";
import { useAppModel } from "../../providers/app-provider";
import {
  onboardingCardStyle,
  onboardingDarkTheme,
  onboardingEyebrow,
} from "../../theme/onboarding-pro-dark";
import type { AppScreenProps } from "../../types/app";
import { HOURS_OPTIONS, getLocalizedOnboardingText } from "./content";

type Props = AppScreenProps<"OnboardingHours">;

export function OnboardingHoursScreen({ navigation }: Props) {
  const { locale, onboardingDraft, setScreenHours } = useAppModel();
  const copy = getLocalizedOnboardingText(locale);
  const selectedHours = onboardingDraft.screenHours;

  return (
    <OnboardingFrame>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={{ marginTop: 40 }}>
          <Text style={onboardingEyebrow}>The Setup</Text>
          <Text
            style={{
              marginTop: 18,
              color: onboardingDarkTheme.textPrimary,
              fontSize: 34,
              fontWeight: "400",
              lineHeight: 42,
              letterSpacing: -1,
            }}
          >
            {copy.hoursTitle(onboardingDraft.firstName)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginVertical: 26,
          }}
        >
          {HOURS_OPTIONS.map((hours) => {
            const active = selectedHours === hours;

            return (
              <Pressable
                key={hours}
                onPress={() => setScreenHours(hours)}
                style={[
                  onboardingCardStyle,
                  {
                    width: "48%",
                    paddingVertical: 24,
                    paddingHorizontal: 18,
                    marginBottom: 14,
                    borderColor: active
                      ? onboardingDarkTheme.borderStrong
                      : onboardingDarkTheme.border,
                    backgroundColor: active
                      ? onboardingDarkTheme.accentSoft
                      : onboardingDarkTheme.card,
                  },
                ]}
              >
                <Text
                  style={{
                    color: active
                      ? onboardingDarkTheme.accent
                      : onboardingDarkTheme.textPrimary,
                    fontSize: 28,
                    fontWeight: "400",
                    letterSpacing: -0.8,
                  }}
                >
                  {hours}h
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View>
          <View
            style={[
              onboardingCardStyle,
              {
                paddingHorizontal: 20,
                paddingVertical: 18,
                borderColor: selectedHours
                  ? onboardingDarkTheme.borderStrong
                  : onboardingDarkTheme.border,
                marginBottom: 18,
              },
            ]}
          >
            <Text
              style={{
                color: selectedHours
                  ? onboardingDarkTheme.textPrimary
                  : onboardingDarkTheme.textTertiary,
                fontSize: 15,
                fontWeight: "400",
                lineHeight: 24,
              }}
            >
              {selectedHours
                ? copy.hoursCaption(selectedHours)
                : locale === "es"
                  ? "Selecciona una opción para ver el impacto acumulado."
                  : "Select an option to see the accumulated impact."}
            </Text>
          </View>

          <Pressable
            disabled={!selectedHours}
            onPress={() => navigation.replace("OnboardingScanner")}
            style={{
              borderRadius: 32,
              backgroundColor: selectedHours
                ? onboardingDarkTheme.accentSoft
                : onboardingDarkTheme.card,
              borderWidth: 1,
              borderColor: selectedHours
                ? onboardingDarkTheme.borderStrong
                : onboardingDarkTheme.border,
              paddingVertical: 18,
              opacity: selectedHours ? 1 : 0.5,
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
              {locale === "es" ? "Continuar" : "Continue"}
            </Text>
          </Pressable>
        </View>
      </View>
    </OnboardingFrame>
  );
}
