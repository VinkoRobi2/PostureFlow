import { Pressable, Text, View } from "react-native";
import { OnboardingFrame } from "../../components/onboarding/OnboardingFrame";
import { useAppModel } from "../../providers/app-provider";
import { onboardingDarkTheme } from "../../theme/onboarding-pro-dark";
import type { AppScreenProps } from "../../types/app";
import { ff, hairline, rs, screenPadH, screenPadT } from "../../utils/responsive";
import { getLocalizedOnboardingText } from "./content";

type Props = AppScreenProps<"OnboardingProblem">;

function ProblemTitle({ locale }: { locale: "en" | "es" }) {
  if (locale === "es") {
    return (
      <>
        Tu silla te{"\n"}
        <Text style={{ color: onboardingDarkTheme.accentStrong, fontFamily: ff }}>
          absorbe
        </Text>{" "}
        durante{"\n"}8 horas?
      </>
    );
  }

  return (
    <>
      Does your chair{"\n"}
      <Text style={{ color: onboardingDarkTheme.accentStrong, fontFamily: ff }}>
        absorb
      </Text>{" "}
      you{"\n"}for 8 hours?
    </>
  );
}

function ProblemStat({ locale }: { locale: "en" | "es" }) {
  if (locale === "es") {
    return (
      <>
        Sentarte 8 horas coloca hasta{" "}
        <Text
          style={{
            color: onboardingDarkTheme.textPrimary,
            fontFamily: ff,
            fontWeight: "800",
          }}
        >
          140 kg
        </Text>{" "}
        de presion sobre tus discos lumbares cada dia.
      </>
    );
  }

  return (
    <>
      Sitting 8 hours places up to{" "}
      <Text
        style={{
          color: onboardingDarkTheme.textPrimary,
          fontFamily: ff,
          fontWeight: "800",
        }}
      >
        140 kg
      </Text>{" "}
      of pressure on your lumbar discs - every single day.
    </>
  );
}

function InsightText({ locale }: { locale: "en" | "es" }) {
  if (locale === "es") {
    return (
      <>
        PostureFlow convierte esa carga en{" "}
        <Text style={{ color: onboardingDarkTheme.accentStrong, fontFamily: ff }}>
          pausas breves guiadas
        </Text>{" "}
        que puedes hacer en tu escritorio.
      </>
    );
  }

  return (
    <>
      PostureFlow converts that load into{" "}
      <Text style={{ color: onboardingDarkTheme.accentStrong, fontFamily: ff }}>
        short guided resets
      </Text>{" "}
      you can do at your desk.
    </>
  );
}

export function OnboardingProblemScreen({ navigation }: Props) {
  const { locale, toggleLocale } = useAppModel();
  const copy = getLocalizedOnboardingText(locale);

  return (
    <OnboardingFrame
      showLanguageToggle={false}
      contentStyle={{
        maxWidth: rs(460),
        width: "100%",
        paddingHorizontal: screenPadH,
        paddingTop: screenPadT,
        paddingBottom: 0,
      }}
      onPress={() => navigation.replace("OnboardingSolution")}
    >
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: rs(52),
            }}
          >
            <View
              style={{
                backgroundColor: onboardingDarkTheme.card,
                borderWidth: hairline,
                borderColor: onboardingDarkTheme.border,
                borderRadius: rs(999),
                paddingHorizontal: rs(14),
                paddingVertical: rs(7),
              }}
            >
              <Text
                style={{
                  color: onboardingDarkTheme.violetStrong,
                  fontFamily: ff,
                  fontSize: rs(10),
                  fontWeight: "800",
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                }}
              >
                PostureFlow
              </Text>
            </View>

            <Pressable
              onPress={(event) => {
                event.stopPropagation();
                void toggleLocale();
              }}
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

          <View style={{ marginBottom: rs(22) }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: rs(8),
                marginBottom: rs(16),
              }}
            >
              <View
                style={{
                  width: rs(6),
                  height: rs(6),
                  borderRadius: rs(3),
                  backgroundColor: onboardingDarkTheme.accentStrong,
                }}
              />
              <Text
                style={{
                  color: onboardingDarkTheme.textTertiary,
                  fontFamily: ff,
                  fontSize: rs(10),
                  fontWeight: "800",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {locale === "es" ? "Auditoria corporal" : "Body Audit"}
              </Text>
            </View>

            <Text
              style={{
                color: onboardingDarkTheme.textPrimary,
                fontFamily: ff,
                fontSize: rs(42),
                fontWeight: "800",
                lineHeight: rs(44),
                letterSpacing: -1.4,
              }}
            >
              <ProblemTitle locale={locale} />
            </Text>
          </View>

          <View
            style={{
              backgroundColor: onboardingDarkTheme.porcelain,
              borderWidth: hairline,
              borderColor: onboardingDarkTheme.border,
              borderRadius: rs(24),
              padding: rs(20),
              marginBottom: rs(12),
            }}
          >
            <Text
              style={{
                color: onboardingDarkTheme.textTertiary,
                fontFamily: ff,
                fontSize: rs(10),
                fontWeight: "800",
                letterSpacing: 1.8,
                textTransform: "uppercase",
              }}
            >
              {locale === "es" ? "Carga lumbar" : "Lumbar Load"}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                gap: rs(12),
                marginTop: rs(10),
                marginBottom: rs(14),
              }}
            >
              <Text
                adjustsFontSizeToFit
                maxFontSizeMultiplier={1}
                minimumFontScale={0.84}
                numberOfLines={1}
                style={{
                  flex: 1,
                  color: onboardingDarkTheme.textPrimary,
                  fontFamily: ff,
                  fontSize: rs(78),
                  fontWeight: "800",
                  lineHeight: rs(88),
                  letterSpacing: -1,
                  includeFontPadding: false,
                  paddingLeft: rs(2),
                  paddingRight: rs(4),
                  paddingVertical: rs(2),
                }}
              >
                140
              </Text>

              <View
                style={{
                  minWidth: rs(76),
                  backgroundColor: onboardingDarkTheme.backgroundRaised,
                  borderWidth: hairline,
                  borderColor: onboardingDarkTheme.border,
                  borderRadius: rs(16),
                  paddingHorizontal: rs(16),
                  paddingVertical: rs(14),
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <Text
                  style={{
                    color: onboardingDarkTheme.accentStrong,
                    fontFamily: ff,
                    fontSize: rs(22),
                    fontWeight: "800",
                    letterSpacing: -0.5,
                  }}
                >
                  kg
                </Text>
                <Text
                  style={{
                    color: onboardingDarkTheme.textTertiary,
                    fontFamily: ff,
                    fontSize: rs(9),
                    fontWeight: "700",
                    letterSpacing: 1.2,
                    lineHeight: rs(13),
                    marginTop: rs(6),
                    textAlign: "center",
                    textTransform: "uppercase",
                  }}
                >
                  {locale === "es" ? "Mesa y\nsilla" : "Desk &\nChair"}
                </Text>
              </View>
            </View>

            <View
              style={{
                height: hairline,
                backgroundColor: onboardingDarkTheme.border,
                marginBottom: rs(12),
              }}
            />

            <Text
              style={{
                color: onboardingDarkTheme.textSecondary,
                fontFamily: ff,
                fontSize: rs(13),
                fontWeight: "500",
                lineHeight: rs(21),
              }}
            >
              <ProblemStat locale={locale} />
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: rs(10),
              marginBottom: rs(32),
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: onboardingDarkTheme.porcelain,
                borderWidth: hairline,
                borderColor: onboardingDarkTheme.border,
                borderRadius: rs(20),
                padding: rs(18),
              }}
            >
              <Text
                style={{
                  color: onboardingDarkTheme.textPrimary,
                  fontFamily: ff,
                  fontSize: rs(34),
                  fontWeight: "800",
                  lineHeight: rs(36),
                  letterSpacing: -1,
                }}
              >
                8h
              </Text>
              <Text
                style={{
                  color: onboardingDarkTheme.textTertiary,
                  fontFamily: ff,
                  fontSize: rs(11),
                  fontWeight: "600",
                  lineHeight: rs(16),
                  marginTop: rs(8),
                }}
              >
                {locale === "es"
                  ? "Carga\ndiaria"
                  : "Accumulated\ndaily load"}
              </Text>
            </View>

            <View
              style={{
                flex: 1.4,
                backgroundColor: onboardingDarkTheme.porcelain,
                borderWidth: hairline,
                borderColor: onboardingDarkTheme.border,
                borderRadius: rs(20),
                padding: rs(18),
              }}
            >
              <Text
                style={{
                  color: onboardingDarkTheme.textPrimary,
                  fontFamily: ff,
                  fontSize: rs(13),
                  fontWeight: "600",
                  lineHeight: rs(21),
                }}
              >
                <InsightText locale={locale} />
              </Text>
            </View>
          </View>
        </View>

        <View style={{ alignItems: "center", paddingBottom: rs(32) }}>
          <Text
            style={{
              color: onboardingDarkTheme.textTertiary,
              fontFamily: ff,
              fontSize: rs(10),
              fontWeight: "700",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {copy.continueTap}
          </Text>
        </View>
      </View>
    </OnboardingFrame>
  );
}
