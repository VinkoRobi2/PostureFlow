import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppModel } from "../../providers/app-provider";
import { onboardingDarkTheme } from "../../theme/onboarding-pro-dark";
import type { AppScreenProps } from "../../types/app";
import { ff, hairline, rs, screenPadH, screenPadT } from "../../utils/responsive";
import { HOURS_OPTIONS, getLocalizedOnboardingText } from "./content";

type Props = AppScreenProps<"OnboardingHours">;

function HoursTitle({
  locale,
  name,
}: {
  locale: "en" | "es";
  name: string;
}) {
  const displayName = name || (locale === "es" ? "Excelente" : "Let's begin");

  if (locale === "es") {
    return (
      <>
        {displayName}, cuantas{"\n"}horas al dia{"\n"}frente a pantalla?
      </>
    );
  }

  return (
    <>
      {displayName}, how many{"\n"}hours a day{"\n"}on screen?
    </>
  );
}

export function OnboardingHoursScreen({ navigation }: Props) {
  const { locale, onboardingDraft, setScreenHours, toggleLocale } =
    useAppModel();
  const copy = getLocalizedOnboardingText(locale);
  const selectedHours = onboardingDraft.screenHours;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: onboardingDarkTheme.background }}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            width: "100%",
            maxWidth: rs(460),
            alignSelf: "center",
            paddingHorizontal: screenPadH,
            paddingTop: screenPadT,
            paddingBottom: rs(32),
          }}
        >
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View>
              <View
                style={{
                  alignItems: "flex-end",
                  marginBottom: rs(48),
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

              <View style={{ marginBottom: rs(52) }}>
                <Text
                  style={{
                    color: onboardingDarkTheme.accentStrong,
                    fontFamily: ff,
                    fontSize: rs(10),
                    fontWeight: "800",
                    letterSpacing: 2.5,
                    marginBottom: rs(16),
                    textTransform: "uppercase",
                  }}
                >
                  {locale === "es" ? "Paso 2 de 3" : "Step 2 of 3"}
                </Text>

                <Text
                  style={{
                    color: onboardingDarkTheme.textPrimary,
                    fontFamily: ff,
                    fontSize: rs(42),
                    fontWeight: "800",
                    letterSpacing: -1.5,
                    lineHeight: rs(44),
                  }}
                >
                  <HoursTitle
                    locale={locale}
                    name={onboardingDraft.firstName}
                  />
                </Text>
              </View>

              <View
                style={{
                  paddingBottom: rs(16),
                  borderBottomWidth: rs(2),
                  borderBottomColor: onboardingDarkTheme.textPrimary,
                  marginBottom: rs(28),
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "baseline",
                    gap: rs(8),
                  }}
                >
                  <Text
                    style={{
                      color: selectedHours
                        ? onboardingDarkTheme.textPrimary
                        : onboardingDarkTheme.textTertiary,
                      fontFamily: ff,
                      fontSize: rs(72),
                      fontWeight: "800",
                      letterSpacing: -3,
                      lineHeight: rs(80),
                      includeFontPadding: false,
                    }}
                  >
                    {selectedHours ?? "—"}
                  </Text>
                  <Text
                    style={{
                      color: onboardingDarkTheme.textTertiary,
                      fontFamily: ff,
                      fontSize: rs(22),
                      fontWeight: "600",
                    }}
                  >
                    {locale === "es" ? "h / dia" : "h / day"}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: rs(8),
                }}
              >
                {HOURS_OPTIONS.map((hours) => {
                  const active = selectedHours === hours;

                  return (
                    <Pressable
                      key={hours}
                      onPress={() => setScreenHours(hours)}
                      style={({ pressed }) => ({
                        borderRadius: rs(999),
                        borderWidth: active ? 0 : hairline,
                        borderColor: onboardingDarkTheme.border,
                        backgroundColor: active
                          ? onboardingDarkTheme.textPrimary
                          : onboardingDarkTheme.card,
                        opacity: pressed ? 0.82 : 1,
                        paddingHorizontal: rs(16),
                        paddingVertical: rs(10),
                      })}
                    >
                      <Text
                        style={{
                          color: active
                            ? onboardingDarkTheme.background
                            : onboardingDarkTheme.textTertiary,
                          fontFamily: ff,
                          fontSize: rs(14),
                          fontWeight: "700",
                        }}
                      >
                        {hours}h
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View>
              <View
                style={{
                  flexDirection: "row",
                  gap: rs(6),
                  marginBottom: rs(24),
                }}
              >
                {[0, 1, 2].map((item) => (
                  <View
                    key={item}
                    style={{
                      width: item === 1 ? rs(24) : rs(8),
                      height: rs(4),
                      borderRadius: rs(2),
                      backgroundColor:
                        item === 1
                          ? onboardingDarkTheme.accentStrong
                          : onboardingDarkTheme.border,
                    }}
                  />
                ))}
              </View>

              <Pressable
                disabled={!selectedHours}
                onPress={() => navigation.replace("OnboardingScanner")}
                style={{
                  backgroundColor: onboardingDarkTheme.textPrimary,
                  borderRadius: rs(18),
                  opacity: selectedHours ? 1 : 0.4,
                  paddingVertical: rs(18),
                }}
              >
                <Text
                  style={{
                    color: onboardingDarkTheme.background,
                    fontFamily: ff,
                    fontSize: rs(16),
                    fontWeight: "800",
                    textAlign: "center",
                  }}
                >
                  {locale === "es" ? "Continuar" : "Continue"}
                </Text>
              </Pressable>

              <Text
                style={{
                  color: onboardingDarkTheme.textTertiary,
                  fontFamily: ff,
                  fontSize: rs(12),
                  fontWeight: "500",
                  marginTop: rs(14),
                  textAlign: "center",
                }}
              >
                {locale === "es"
                  ? "Esto calibra tu flujo personal"
                  : "This calibrates your personal flow"}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
