import { Pressable, Text, View } from "react-native";
import { OnboardingFrame } from "../../components/onboarding/OnboardingFrame";
import { useAppModel } from "../../providers/app-provider";
import { onboardingDarkTheme } from "../../theme/onboarding-pro-dark";
import type { AppScreenProps } from "../../types/app";
import { ff, hairline, rs, screenPadH, screenPadT } from "../../utils/responsive";
import { getLocalizedOnboardingText } from "./content";

type Props = AppScreenProps<"OnboardingSolution">;

const steps = {
  en: ["Breathe", "Mobilize", "Reset"],
  es: ["Respira", "Mueve", "Suelta"],
} as const;

function splitSolutionTitle(title: string) {
  const [headline = title, ...rest] = title.split(". ");

  return {
    headline: headline.replace(/\.$/, ""),
    subtitle: rest.join(". "),
  };
}

function SupportText({ locale }: { locale: "en" | "es" }) {
  if (locale === "es") {
    return (
      <>
        Un flujo corto, seguro para oficina y disenado para soltar tension{" "}
        <Text
          style={{
            color: onboardingDarkTheme.textPrimary,
            fontFamily: ff,
            fontWeight: "700",
          }}
        >
          sin interrumpir tu dia.
        </Text>
      </>
    );
  }

  return (
    <>
      A short, office-safe flow designed to release tension{" "}
      <Text
        style={{
          color: onboardingDarkTheme.textPrimary,
          fontFamily: ff,
          fontWeight: "700",
        }}
      >
        without interrupting your day.
      </Text>
    </>
  );
}

export function OnboardingSolutionScreen({ navigation }: Props) {
  const { locale, toggleLocale } = useAppModel();
  const copy = getLocalizedOnboardingText(locale);
  const titleParts = splitSolutionTitle(copy.solutionTitle);
  const protocolLabel =
    locale === "es" ? "Protocolo de escritorio" : "Desk reset protocol";
  const promiseLabel = locale === "es" ? "Sin friccion" : "No friction";

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
      onPress={() => navigation.replace("OnboardingName")}
    >
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: rs(32),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: rs(8),
                flex: 1,
                paddingRight: rs(12),
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
                {protocolLabel}
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

          <View style={{ marginBottom: rs(36) }}>
            <Text
              style={{
                color: onboardingDarkTheme.textPrimary,
                fontFamily: ff,
                fontSize: rs(42),
                fontWeight: "800",
                lineHeight: rs(44),
                letterSpacing: -1.5,
              }}
            >
              {titleParts.headline}
              <Text
                style={{
                  color: onboardingDarkTheme.accentStrong,
                  fontFamily: ff,
                }}
              >
                .
              </Text>
            </Text>

            <Text
              style={{
                marginTop: rs(16),
                color: onboardingDarkTheme.textSecondary,
                fontFamily: ff,
                fontSize: rs(16),
                fontWeight: "500",
                lineHeight: rs(26),
                maxWidth: rs(280),
              }}
            >
              {titleParts.subtitle}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: rs(10),
              marginBottom: rs(14),
            }}
          >
            {steps[locale].map((item, index) => {
              const active = index === 1;

              return (
                <View
                  key={item}
                  style={{
                    flex: 1,
                    minHeight: rs(92),
                    borderRadius: rs(20),
                    padding: rs(16),
                    backgroundColor: active
                      ? onboardingDarkTheme.backgroundRaised
                      : onboardingDarkTheme.porcelain,
                    borderWidth: hairline,
                    borderColor: active
                      ? onboardingDarkTheme.accentStrong
                      : onboardingDarkTheme.border,
                    position: "relative",
                  }}
                >
                  {active ? (
                    <View
                      style={{
                        position: "absolute",
                        top: rs(10),
                        right: rs(10),
                        width: rs(7),
                        height: rs(7),
                        borderRadius: rs(4),
                        backgroundColor: onboardingDarkTheme.accentStrong,
                      }}
                    />
                  ) : null}

                  <Text
                    style={{
                      color: active
                        ? onboardingDarkTheme.accentStrong
                        : onboardingDarkTheme.border,
                      fontFamily: ff,
                      fontSize: rs(11),
                      fontWeight: "800",
                      letterSpacing: 0.5,
                    }}
                  >
                    0{index + 1}
                  </Text>

                  <View
                    style={{
                      height: rs(3),
                      width: rs(28),
                      borderRadius: rs(2),
                      marginVertical: rs(10),
                      backgroundColor: active
                        ? onboardingDarkTheme.accentStrong
                        : onboardingDarkTheme.border,
                    }}
                  />

                  <Text
                    style={{
                      color: active
                        ? onboardingDarkTheme.accentStrong
                        : onboardingDarkTheme.textTertiary,
                      fontFamily: ff,
                      fontSize: rs(10),
                      fontWeight: "800",
                      letterSpacing: 1.6,
                      textTransform: "uppercase",
                    }}
                  >
                    {item}
                  </Text>
                </View>
              );
            })}
          </View>

          <View
            style={{
              backgroundColor: onboardingDarkTheme.porcelain,
              borderWidth: hairline,
              borderColor: onboardingDarkTheme.border,
              borderRadius: rs(24),
              padding: rs(22),
              marginBottom: rs(14),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: rs(16),
              }}
            >
              <View>
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
                  {promiseLabel}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "baseline",
                    gap: rs(4),
                    marginTop: rs(10),
                  }}
                >
                  <Text
                    style={{
                      color: onboardingDarkTheme.textPrimary,
                      fontFamily: ff,
                      fontSize: rs(64),
                      fontWeight: "800",
                      lineHeight: rs(70),
                      letterSpacing: -2,
                      includeFontPadding: false,
                    }}
                  >
                    3
                  </Text>
                  <Text
                    style={{
                      color: onboardingDarkTheme.textSecondary,
                      fontFamily: ff,
                      fontSize: rs(20),
                      fontWeight: "700",
                      letterSpacing: -0.5,
                    }}
                  >
                    min
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: rs(60),
                  height: rs(60),
                  borderRadius: rs(18),
                  backgroundColor: onboardingDarkTheme.backgroundRaised,
                  borderWidth: hairline,
                  borderColor: onboardingDarkTheme.border,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: onboardingDarkTheme.textSecondary,
                    fontFamily: ff,
                    fontSize: rs(14),
                    fontWeight: "800",
                    letterSpacing: 1,
                  }}
                >
                  PF
                </Text>
              </View>
            </View>

            <View
              style={{
                height: hairline,
                backgroundColor: onboardingDarkTheme.border,
                marginBottom: rs(14),
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
              <SupportText locale={locale} />
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
                borderRadius: rs(18),
                padding: rs(16),
                backgroundColor: onboardingDarkTheme.porcelain,
                borderWidth: hairline,
                borderColor: onboardingDarkTheme.border,
              }}
            >
              <Text
                style={{
                  color: onboardingDarkTheme.accentStrong,
                  fontFamily: ff,
                  fontSize: rs(24),
                  fontWeight: "800",
                  letterSpacing: -0.8,
                }}
              >
                {"\u221e"}
              </Text>
              <Text
                style={{
                  color: onboardingDarkTheme.textTertiary,
                  fontFamily: ff,
                  fontSize: rs(11),
                  fontWeight: "600",
                  lineHeight: rs(16),
                  marginTop: rs(6),
                }}
              >
                {locale === "es"
                  ? "Sin equipo\nnecesario"
                  : "No equipment\nneeded"}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                borderRadius: rs(18),
                padding: rs(16),
                backgroundColor: onboardingDarkTheme.porcelain,
                borderWidth: hairline,
                borderColor: onboardingDarkTheme.border,
              }}
            >
              <Text
                style={{
                  color: onboardingDarkTheme.textPrimary,
                  fontFamily: ff,
                  fontSize: rs(24),
                  fontWeight: "800",
                  letterSpacing: -0.8,
                }}
              >
                {"\u00d7"}3
              </Text>
              <Text
                style={{
                  color: onboardingDarkTheme.textTertiary,
                  fontFamily: ff,
                  fontSize: rs(11),
                  fontWeight: "600",
                  lineHeight: rs(16),
                  marginTop: rs(6),
                }}
              >
                {locale === "es"
                  ? "Sesiones por\ndia recomendadas"
                  : "Sessions per\nday recommended"}
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
