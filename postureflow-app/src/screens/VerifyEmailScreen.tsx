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
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import { zenDarkTheme } from "../theme/zen-dark";
import type { AppScreenProps } from "../types/app";

type Props = AppScreenProps<"VerifyEmail">;

export function VerifyEmailScreen({ navigation }: Props) {
  const {
    isOnline,
    locale,
    logout,
    pendingVerification,
    resendVerification,
    toggleLocale,
    verifyPendingEmail,
  } = useAppModel();
  const copy = messages[locale];
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goNext = (onboardingCompleted: boolean) => {
    navigation.replace(onboardingCompleted ? "Dashboard" : "PainMap");
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
      <StatusBar style="light" />

      <KeyboardDismissView>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 18,
            paddingBottom: 28,
            maxWidth: 460,
            alignSelf: "center",
            width: "100%",
          }}
        >
          <View className="mb-8 flex-row items-center justify-between">
            <View
              style={{
                borderRadius: 999,
                borderWidth: 1,
                borderColor: zenDarkTheme.border,
                backgroundColor: zenDarkTheme.surfaceGlass,
                paddingHorizontal: 12,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  color: zenDarkTheme.accentStrong,
                  fontSize: 10,
                  fontWeight: "600",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                {copy.auth.eyebrow}
              </Text>
            </View>

            <LanguageToggle locale={locale} onToggle={() => void toggleLocale()} />
          </View>

          <View className="flex-1 justify-center">
            <View
              style={{
                borderRadius: 30,
                borderWidth: 1,
                borderColor: zenDarkTheme.border,
                backgroundColor: zenDarkTheme.surfaceGlass,
                paddingHorizontal: 24,
                paddingVertical: 28,
              }}
            >
              <View
                style={{
                  marginBottom: 20,
                  height: 56,
                  width: 56,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 999,
                  backgroundColor: zenDarkTheme.accentSoft,
                }}
              >
                <ShieldCheck color={zenDarkTheme.accent} size={24} />
              </View>

              <Text style={{ fontSize: 30, fontWeight: "600", lineHeight: 40, color: zenDarkTheme.textPrimary }}>
                {copy.auth.verifyEmailTitle}
              </Text>
              <Text style={{ marginTop: 12, fontSize: 14, lineHeight: 24, color: zenDarkTheme.textSecondary }}>
                {copy.auth.verifyEmailSubtitle}
              </Text>

              <View
                style={{
                  marginTop: 20,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: zenDarkTheme.border,
                  backgroundColor: zenDarkTheme.input,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "600",
                    letterSpacing: 1.4,
                    textTransform: "uppercase",
                    color: zenDarkTheme.textTertiary,
                  }}
                >
                  {copy.auth.email}
                </Text>
                <Text style={{ marginTop: 8, fontSize: 14, fontWeight: "500", color: zenDarkTheme.textPrimary }}>
                  {pendingVerification?.email ?? "no-email@postureflow.app"}
                </Text>
              </View>

              {pendingVerification?.devVerificationCode ? (
                <View
                  style={{
                    marginTop: 16,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: zenDarkTheme.border,
                    backgroundColor: zenDarkTheme.accentSoft,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "600",
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
                      fontWeight: "600",
                      letterSpacing: 3,
                      color: zenDarkTheme.textPrimary,
                    }}
                  >
                    {pendingVerification.devVerificationCode}
                  </Text>
                </View>
              ) : null}

              <View className="mt-5">
                <Text
                  style={{
                    marginBottom: 8,
                    fontSize: 12,
                    fontWeight: "600",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    color: zenDarkTheme.textTertiary,
                  }}
                >
                  {copy.auth.verificationCode}
                </Text>
                <View
                  style={{
                    borderRadius: 22,
                    borderWidth: 1,
                    borderColor: zenDarkTheme.border,
                    backgroundColor: zenDarkTheme.input,
                    paddingHorizontal: 16,
                  }}
                >
                  <TextInput
                    value={code}
                    onChangeText={setCode}
                    placeholder="123456"
                    placeholderTextColor="#52525B"
                    keyboardType="number-pad"
                    style={{
                      color: zenDarkTheme.textPrimary,
                      fontSize: 18,
                      letterSpacing: 6,
                      paddingVertical: 16,
                    }}
                  />
                </View>
              </View>

              {error ? (
                <View className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                  <Text className="text-sm font-medium text-red-200">{error}</Text>
                </View>
              ) : null}

              {!isOnline ? (
                <View
                  style={{
                    marginTop: 16,
                    borderRadius: 16,
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

              <View className="mt-5">
                <PrimaryButton
                  label={copy.auth.verifyButton}
                  onPress={() => void handleVerify()}
                  disabled={!isOnline || submitting}
                />
              </View>

              <View className="mt-4 flex-row items-center justify-between">
                <Pressable
                  onPress={() => void handleResend()}
                  disabled={!isOnline || submitting}
                  className={!isOnline || submitting ? "opacity-50" : ""}
                >
                  {submitting ? (
                    <ActivityIndicator color={zenDarkTheme.accent} size="small" />
                  ) : (
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
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
