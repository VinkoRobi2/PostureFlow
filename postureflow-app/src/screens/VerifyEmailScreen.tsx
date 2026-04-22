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
import { LanguageToggle } from "../components/LanguageToggle";
import { PrimaryButton } from "../components/PrimaryButton";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar style="light" />

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
          <View className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1">
            <Text className="text-[10px] font-semibold uppercase tracking-[1.5px] text-emerald-400">
              {copy.auth.eyebrow}
            </Text>
          </View>

          <LanguageToggle locale={locale} onToggle={() => void toggleLocale()} />
        </View>

        <View className="flex-1 justify-center">
          <View className="rounded-[30px] border border-zinc-800 bg-zinc-950 px-6 py-7">
            <View className="mb-5 h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
              <ShieldCheck color="#10B981" size={24} />
            </View>

            <Text className="text-3xl font-semibold leading-10 text-white">
              {copy.auth.verifyEmailTitle}
            </Text>
            <Text className="mt-3 text-sm leading-6 text-zinc-400">
              {copy.auth.verifyEmailSubtitle}
            </Text>

            <View className="mt-5 rounded-2xl border border-zinc-800 bg-black px-4 py-4">
              <Text className="text-[10px] font-semibold uppercase tracking-[1.4px] text-zinc-500">
                {copy.auth.email}
              </Text>
              <Text className="mt-2 text-sm font-medium text-white">
                {pendingVerification?.email ?? "no-email@postureflow.app"}
              </Text>
            </View>

            {pendingVerification?.devVerificationCode ? (
              <View className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                <Text className="text-[10px] font-semibold uppercase tracking-[1.3px] text-emerald-300">
                  {copy.auth.verificationHint}
                </Text>
                <Text className="mt-1 text-base font-semibold tracking-[3px] text-white">
                  {pendingVerification.devVerificationCode}
                </Text>
              </View>
            ) : null}

            <View className="mt-5">
              <Text className="mb-2 text-xs font-semibold uppercase tracking-[1.2px] text-zinc-500">
                {copy.auth.verificationCode}
              </Text>
              <View className="rounded-[22px] border border-zinc-800 bg-black px-4">
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder="123456"
                  placeholderTextColor="#52525B"
                  keyboardType="number-pad"
                  style={{
                    color: "#FFFFFF",
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
              <View className="mt-4 rounded-2xl border border-zinc-800 bg-black px-4 py-3">
                <Text className="text-sm leading-5 text-zinc-400">
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
                  <ActivityIndicator color="#10B981" size="small" />
                ) : (
                  <Text className="text-sm font-semibold text-emerald-400">
                    {copy.auth.resendButton}
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={() => {
                  void logout().then(() => navigation.replace("Auth", { mode: "login" }));
                }}
              >
                <Text className="text-sm font-medium text-zinc-400">
                  {copy.auth.backToLogin}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
