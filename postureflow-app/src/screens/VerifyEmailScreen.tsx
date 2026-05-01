import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShieldCheck } from "lucide-react-native";
import { KeyboardDismissView } from "../components/KeyboardDismissView";
import { LanguageToggle } from "../components/LanguageToggle";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenAtmosphere } from "../components/ScreenAtmosphere";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import { zenAmbientGlow, zenDarkTheme, zenGlassEffect } from "../theme/zen-dark";
import type { AppScreenProps } from "../types/app";

type Props = AppScreenProps<"VerifyEmail">;

export function VerifyEmailScreen({ navigation }: Props) {
  const {
    isOnline,
    locale,
    logout,
    pendingVerification,
    painSelection,
    resendVerification,
    setupSelection,
    toggleLocale,
    verifyPendingEmail,
  } = useAppModel();
  const copy = messages[locale];
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goNext = (onboardingCompleted: boolean) => {
    if (onboardingCompleted) {
      navigation.replace("Dashboard");
      return;
    }

    if (painSelection.length > 0 && setupSelection.length > 0) {
      navigation.replace("Analyzing");
      return;
    }

    navigation.replace("OnboardingProblem");
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      setError(
        locale === "es"
          ? "Ingresa el codigo de verificacion."
          : "Enter the verification code.",
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await verifyPendingEmail(code.trim());

      if (result.authenticated) {
        goNext(result.session.user.onboardingCompleted);
      }
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : locale === "es"
            ? "No se pudo verificar el correo."
            : "Email verification failed.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!isOnline) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await resendVerification();
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : locale === "es"
            ? "No se pudo reenviar el codigo."
            : "Unable to resend the code.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: zenDarkTheme.canvas }}>
      <StatusBar style="dark" />
      <ScreenAtmosphere />

      <KeyboardDismissView>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: 24,
            maxWidth: 460,
            alignSelf: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              marginBottom: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                borderRadius: 999,
                borderWidth: 1,
                borderColor: zenDarkTheme.border,
                backgroundColor: zenDarkTheme.surfaceGlass,
                paddingHorizontal: 12,
                paddingVertical: 4,
                ...zenGlassEffect,
              }}
            >
              <Text
                style={{
                  color: zenDarkTheme.accentStrong,
                  fontSize: 10,
                  fontWeight: "500",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                {copy.auth.eyebrow}
              </Text>
            </View>

            <LanguageToggle locale={locale} onToggle={() => void toggleLocale()} />
          </View>

          <View style={{ flex: 1, justifyContent: "center" }}>
            <View
              style={{
                borderRadius: 38,
                backgroundColor: zenDarkTheme.surfaceGlass,
                borderWidth: 1,
                borderColor: zenDarkTheme.borderBright,
                paddingHorizontal: 24,
                paddingVertical: 26,
                ...zenAmbientGlow(0.12, 26),
                ...zenGlassEffect,
              }}
            >
              <View
                style={{
                  marginBottom: 18,
                  height: 62,
                  width: 62,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 25,
                  backgroundColor: zenDarkTheme.accentSoft,
                }}
              >
                <ShieldCheck color={zenDarkTheme.accentStrong} size={26} />
              </View>

              <Text style={{ fontSize: 31, fontWeight: "900", lineHeight: 38, letterSpacing: -0.8, color: zenDarkTheme.textPrimary }}>
                {copy.auth.verifyEmailTitle}
              </Text>
              <Text style={{ marginTop: 10, fontSize: 15, fontWeight: "600", lineHeight: 23, color: zenDarkTheme.textSecondary }}>
                {copy.auth.verifyEmailSubtitle}
              </Text>

              <View
                style={{
                  marginTop: 18,
                  borderRadius: 22,
                  borderWidth: 1,
                  borderColor: zenDarkTheme.border,
                  backgroundColor: zenDarkTheme.input,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "500",
                    letterSpacing: 1.4,
                    textTransform: "uppercase",
                    color: zenDarkTheme.textTertiary,
                  }}
                >
                  {copy.auth.email}
                </Text>
                <Text style={{ marginTop: 8, fontSize: 14, fontWeight: "400", color: zenDarkTheme.textPrimary }}>
                  {pendingVerification?.email ?? "no-email@postureflow.app"}
                </Text>
              </View>

              {pendingVerification?.devVerificationCode ? (
                <View
                  style={{
                    marginTop: 14,
                  borderRadius: 22,
                    borderWidth: 1,
                    borderColor: zenDarkTheme.borderMuted,
                    backgroundColor: zenDarkTheme.accentSoft,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "500",
                      letterSpacing: 1.3,
                      textTransform: "uppercase",
                      color: zenDarkTheme.accentStrong,
                    }}
                  >
                    {copy.auth.verificationHint}
                  </Text>
                  <Text
                    style={{
                      marginTop: 4,
                      fontSize: 16,
                      fontWeight: "500",
                      letterSpacing: 3,
                      color: zenDarkTheme.textPrimary,
                    }}
                  >
                    {pendingVerification.devVerificationCode}
                  </Text>
                </View>
              ) : null}

              <View style={{ marginTop: 16 }}>
                <Text
                  style={{
                    marginBottom: 8,
                    fontSize: 12,
                    fontWeight: "500",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    color: zenDarkTheme.textTertiary,
                  }}
                >
                  {copy.auth.verificationCode}
                </Text>
                <View
                  style={{
                  borderRadius: 24,
                    borderWidth: 1,
                    borderColor: zenDarkTheme.border,
                    backgroundColor: zenDarkTheme.input,
                    paddingHorizontal: 16,
                    ...zenGlassEffect,
                  }}
                >
                  <TextInput
                    value={code}
                    onChangeText={setCode}
                    placeholder="123456"
                    placeholderTextColor={zenDarkTheme.textTertiary}
                    keyboardType="number-pad"
                    style={{
                      color: zenDarkTheme.textPrimary,
                      fontSize: 17,
                      letterSpacing: 6,
                      paddingVertical: 14,
                    }}
                  />
                </View>
              </View>

              {error ? (
                <View
                  style={{
                    marginTop: 14,
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: zenDarkTheme.borderMuted,
                    backgroundColor: zenDarkTheme.accentSoft,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "400",
                      color: zenDarkTheme.textPrimary,
                    }}
                  >
                    {error}
                  </Text>
                </View>
              ) : null}

              {!isOnline ? (
                <View
                  style={{
                    marginTop: 14,
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: zenDarkTheme.border,
                    backgroundColor: zenDarkTheme.input,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 20,
                      color: zenDarkTheme.textSecondary,
                    }}
                  >
                    {copy.auth.offlineNoSession}
                  </Text>
                </View>
              ) : null}

              <View style={{ marginTop: 16 }}>
                <PrimaryButton
                  label={copy.auth.verifyButton}
                  onPress={() => void handleVerify()}
                  disabled={!isOnline || submitting}
                />
              </View>

              <View
                style={{
                  marginTop: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Pressable
                  onPress={() => void handleResend()}
                  disabled={!isOnline || submitting}
                  style={({ pressed }) => ({
                    opacity: !isOnline || submitting ? 0.5 : pressed ? 0.8 : 1,
                  })}
                >
                  {submitting ? (
                    <ActivityIndicator color={zenDarkTheme.accent} size="small" />
                  ) : (
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: zenDarkTheme.accentStrong,
                      }}
                    >
                      {copy.auth.resendButton}
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => {
                    void logout().then(() =>
                      navigation.replace("Auth", { mode: "login" }),
                    );
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: zenDarkTheme.textSecondary,
                    }}
                  >
                    {copy.auth.backToLogin}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </KeyboardDismissView>
    </SafeAreaView>
  );
}
