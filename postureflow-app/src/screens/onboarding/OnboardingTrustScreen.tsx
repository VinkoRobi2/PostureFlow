import { Pressable, Text, View } from "react-native";
import { OnboardingFrame } from "../../components/onboarding/OnboardingFrame";
import { useAppModel } from "../../providers/app-provider";
import { onboardingDarkTheme } from "../../theme/onboarding-pro-dark";
import type { AppScreenProps } from "../../types/app";
import { ff, hairline, rs, screenPadH, screenPadT } from "../../utils/responsive";
import { getLocalizedOnboardingText } from "./content";

type Props = AppScreenProps<"OnboardingTrust">;

export function OnboardingTrustScreen({ navigation }: Props) {
  const { locale } = useAppModel();
  const copy = getLocalizedOnboardingText(locale);
  const notes =
    locale === "es"
      ? [
          {
            icon: "7",
            title: "7 dias gratis",
            description: "Sin cargo hasta que termine el periodo.",
          },
          {
            icon: "1",
            title: "Aviso 1 dia antes",
            description: "Te avisamos antes de cualquier cobro.",
          },
          {
            icon: "X",
            title: "Cancela con un toque",
            description: "Sin llamadas, sin formularios.",
          },
        ]
      : [
          {
            icon: "7",
            title: "7 free days",
            description: "No charge until the trial ends.",
          },
          {
            icon: "1",
            title: "Reminder 1 day before",
            description: "We notify you before any billing.",
          },
          {
            icon: "X",
            title: "Cancel in one tap",
            description: "No calls, no forms.",
          },
        ];

  return (
    <OnboardingFrame
      contentStyle={{
        flex: 1,
        paddingHorizontal: screenPadH,
        paddingTop: screenPadT,
        paddingBottom: rs(34),
      }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ marginBottom: rs(40) }}>
          <Text
            style={{
              color: onboardingDarkTheme.accentStrong,
              fontFamily: ff,
              fontSize: rs(10),
              fontWeight: "800",
              letterSpacing: 2.5,
              textTransform: "uppercase",
            }}
          >
            {copy.paywallBadge}
          </Text>
          <Text
            style={{
              color: onboardingDarkTheme.textPrimary,
              fontFamily: ff,
              marginTop: rs(14),
              fontSize: rs(38),
              fontWeight: "800",
              lineHeight: rs(38),
              letterSpacing: -1.5,
            }}
          >
            {copy.paywallTitle}
          </Text>
        </View>

        <View style={{ marginBottom: "auto" }}>
          {notes.map((note, index) => {
            const hasDivider = index < notes.length - 1;

            return (
              <View
                key={note.title}
                style={{
                  alignItems: "center",
                  borderBottomColor: onboardingDarkTheme.border,
                  borderBottomWidth: hasDivider ? hairline : 0,
                  flexDirection: "row",
                  gap: rs(14),
                  paddingBottom: hasDivider ? rs(18) : 0,
                  marginBottom: hasDivider ? rs(18) : 0,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    backgroundColor: onboardingDarkTheme.card,
                    borderRadius: rs(12),
                    height: rs(36),
                    justifyContent: "center",
                    width: rs(36),
                  }}
                >
                  <Text
                    style={{
                      color: onboardingDarkTheme.accentStrong,
                      fontFamily: ff,
                      fontSize: rs(14),
                      fontWeight: "800",
                    }}
                  >
                    {note.icon}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: onboardingDarkTheme.textPrimary,
                      fontFamily: ff,
                      fontSize: rs(14),
                      fontWeight: "700",
                    }}
                  >
                    {note.title}
                  </Text>
                  <Text
                    style={{
                      color: onboardingDarkTheme.textTertiary,
                      fontFamily: ff,
                      fontSize: rs(12),
                      fontWeight: "500",
                      lineHeight: rs(18),
                      marginTop: rs(2),
                    }}
                  >
                    {note.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ paddingTop: rs(32) }}>
          <Pressable
            onPress={() => navigation.replace("Auth", { mode: "register" })}
            style={({ pressed }) => ({
              backgroundColor: onboardingDarkTheme.accentStrong,
              borderRadius: rs(18),
              opacity: pressed ? 0.9 : 1,
              paddingVertical: rs(18),
            })}
          >
            <Text
              style={{
                textAlign: "center",
                color: onboardingDarkTheme.background,
                fontFamily: ff,
                fontSize: rs(16),
                fontWeight: "700",
              }}
            >
              {copy.paywallCta}
            </Text>
          </Pressable>

          <Text
            onPress={() => navigation.replace("Auth", { mode: "login" })}
            style={{
              marginTop: rs(16),
              color: onboardingDarkTheme.textTertiary,
              fontFamily: ff,
              fontSize: rs(13),
              fontWeight: "500",
              paddingVertical: rs(8),
              textAlign: "center",
            }}
          >
            {copy.paywallSecondary}
          </Text>
        </View>
      </View>
    </OnboardingFrame>
  );
}
