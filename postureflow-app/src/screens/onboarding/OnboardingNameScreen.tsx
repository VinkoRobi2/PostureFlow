import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppModel } from "../../providers/app-provider";
import { onboardingDarkTheme } from "../../theme/onboarding-pro-dark";
import type { AppScreenProps } from "../../types/app";
import { ff, hairline, rs, screenPadH, screenPadT } from "../../utils/responsive";
import { getLocalizedOnboardingText } from "./content";

type Props = AppScreenProps<"OnboardingName">;

export function OnboardingNameScreen({ navigation }: Props) {
  const { locale, onboardingDraft, setOnboardingName, toggleLocale } =
    useAppModel();
  const copy = getLocalizedOnboardingText(locale);
  const [name, setName] = useState(onboardingDraft.firstName);

  const trimmedName = name.trim();
  const initial = trimmedName.charAt(0).toUpperCase() || "P";

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
                  marginBottom: rs(56),
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

              <View>
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
                  {locale === "es" ? "Paso 1 de 3" : "Step 1 of 3"}
                </Text>

                <Text
                  style={{
                    color: onboardingDarkTheme.textPrimary,
                    fontFamily: ff,
                    fontSize: rs(44),
                    fontWeight: "800",
                    letterSpacing: -1.8,
                    lineHeight: rs(44),
                  }}
                >
                  {copy.nameTitle}
                </Text>
              </View>

              <View style={{ marginTop: rs(48) }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    paddingBottom: rs(14),
                    borderBottomWidth: rs(2),
                    borderBottomColor: onboardingDarkTheme.textPrimary,
                  }}
                >
                  <View
                    style={{
                      width: rs(36),
                      height: rs(36),
                      borderRadius: rs(10),
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: onboardingDarkTheme.backgroundRaised,
                      borderWidth: hairline,
                      borderColor: onboardingDarkTheme.border,
                      marginRight: rs(14),
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
                      {initial}
                    </Text>
                  </View>

                  <TextInput
                    value={name}
                    onChangeText={setName}
                    autoFocus
                    autoCapitalize="words"
                    placeholder={copy.namePlaceholder}
                    placeholderTextColor={onboardingDarkTheme.textTertiary}
                    selectionColor={onboardingDarkTheme.accent}
                    underlineColorAndroid="transparent"
                    style={{
                      flex: 1,
                      color: onboardingDarkTheme.textPrimary,
                      fontFamily: ff,
                      fontSize: rs(36),
                      fontWeight: "800",
                      letterSpacing: -1.2,
                      padding: 0,
                    }}
                  />
                </View>

                <Text
                  style={{
                    color: onboardingDarkTheme.textTertiary,
                    fontFamily: ff,
                    fontSize: rs(12),
                    fontWeight: "600",
                    lineHeight: rs(20),
                    marginTop: rs(14),
                  }}
                >
                  {locale === "es"
                    ? "Solo usaremos tu nombre para personalizar tu experiencia."
                    : "We will only use your name to personalize your experience."}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  gap: rs(6),
                  marginTop: rs(48),
                }}
              >
                {[0, 1, 2].map((item) => (
                  <View
                    key={item}
                    style={{
                      width: item === 0 ? rs(24) : rs(8),
                      height: rs(4),
                      borderRadius: rs(2),
                      backgroundColor:
                        item === 0
                          ? onboardingDarkTheme.accentStrong
                          : onboardingDarkTheme.border,
                    }}
                  />
                ))}
              </View>
            </View>

            <View style={{ marginTop: rs(28) }}>
              <Pressable
                disabled={!trimmedName}
                onPress={() => {
                  setOnboardingName(trimmedName);
                  navigation.replace("OnboardingHours");
                }}
                style={{
                  backgroundColor: "#1C1814",
                  borderRadius: rs(18),
                  opacity: trimmedName ? 1 : 0.5,
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
                  {copy.nameCta}
                </Text>
              </Pressable>

              <Text
                style={{
                  color: onboardingDarkTheme.textSecondary,
                  fontFamily: ff,
                  fontSize: rs(12),
                  fontWeight: "600",
                  marginTop: rs(16),
                  textAlign: "center",
                }}
              >
                {locale === "es"
                  ? "Puedes cambiarlo despues"
                  : "You can change it later"}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
