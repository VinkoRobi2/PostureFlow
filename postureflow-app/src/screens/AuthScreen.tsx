import { StatusBar } from "expo-status-bar";
import { type ReactNode, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Globe, LockKeyhole, Mail, UserRound } from "lucide-react-native";
import { KeyboardDismissView } from "../components/KeyboardDismissView";
import { LanguageToggle } from "../components/LanguageToggle";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenAtmosphere } from "../components/ScreenAtmosphere";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import { zenDarkTheme, zenGlassEffect } from "../theme/zen-dark";
import type { AppScreenProps, AuthFormMode } from "../types/app";

type Props = AppScreenProps<"Auth">;

export function AuthScreen({ navigation, route }: Props) {
  const {
    continueWithGoogle,
    isOnline,
    locale,
    loginWithEmail,
    onboardingDraft,
    painSelection,
    registerWithEmail,
    setupSelection,
    toggleLocale,
  } = useAppModel();
  const copy = messages[locale];
  const [mode, setMode] = useState<AuthFormMode>(route.params?.mode ?? "login");
  const [firstName, setFirstName] = useState(onboardingDraft.firstName);
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRegister = mode === "register";
  const isDisabled = !isOnline || submitting;
  const helperCopy = useMemo(
    () => (isOnline ? copy.auth.googleHint : copy.auth.offlineNoSession),
    [copy.auth.googleHint, copy.auth.offlineNoSession, isOnline],
  );

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

  const handleSubmit = async () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password.trim() || (isRegister && !trimmedFirstName)) {
      setError(
        locale === "es"
          ? "Completa los campos obligatorios."
          : "Fill in the required fields.",
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = isRegister
        ? await registerWithEmail(
            trimmedFirstName,
            trimmedEmail,
            password,
            trimmedLastName || undefined,
          )
        : await loginWithEmail(trimmedEmail, password);

      if (result.authenticated) {
        goNext(result.session.user.onboardingCompleted);
      } else {
        navigation.replace("VerifyEmail");
      }
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : locale === "es"
            ? "No se pudo continuar."
            : "Unable to continue.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const result = await continueWithGoogle(email, firstName, lastName);

      if (result.authenticated) {
        goNext(result.session.user.onboardingCompleted);
      } else {
        navigation.replace("VerifyEmail");
      }
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : locale === "es"
            ? "No se pudo iniciar con Google."
            : "Google sign-in failed.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: zenDarkTheme.canvas }}>
      <StatusBar style="light" />
      <ScreenAtmosphere />

      <KeyboardDismissView>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 18,
            paddingBottom: 28,
            maxWidth: 460,
            alignSelf: "center",
            width: "100%",
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
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

          <View className="mb-8">
            <Text style={{ fontSize: 30, fontWeight: "400", lineHeight: 40, color: zenDarkTheme.textPrimary }}>
              {copy.auth.title}
            </Text>
            <Text style={{ marginTop: 12, fontSize: 14, lineHeight: 24, color: zenDarkTheme.textSecondary }}>
              {copy.auth.subtitle}
            </Text>
          </View>

          <View
            style={{
              marginBottom: 24,
              flexDirection: "row",
              borderRadius: 999,
              borderWidth: 1,
              borderColor: zenDarkTheme.border,
              backgroundColor: zenDarkTheme.surfaceGlass,
              padding: 4,
              ...zenGlassEffect,
            }}
          >
            {(["login", "register"] as const).map((item) => {
              const active = item === mode;
              return (
                <Pressable
                  key={item}
                  onPress={() => {
                    setMode(item);
                    setError(null);
                  }}
                  style={{
                    flex: 1,
                    borderRadius: 999,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: active ? zenDarkTheme.accentSoft : "transparent",
                    borderWidth: active ? 1 : 0,
                    borderColor: active ? zenDarkTheme.borderMuted : "transparent",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 12,
                      fontWeight: "500",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      color: active
                        ? zenDarkTheme.textPrimary
                        : zenDarkTheme.textSecondary,
                    }}
                  >
                    {item === "login" ? copy.auth.loginTab : copy.auth.registerTab}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View
            style={{
              borderRadius: 28,
              borderWidth: 1,
              borderColor: zenDarkTheme.border,
              backgroundColor: zenDarkTheme.surfaceGlass,
              paddingHorizontal: 20,
              paddingVertical: 20,
              ...zenGlassEffect,
            }}
          >
            {isRegister ? (
              <Field
                icon={<UserRound color={zenDarkTheme.accent} size={16} />}
                label={copy.auth.firstName}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                placeholder={copy.auth.firstName}
              />
            ) : null}

            {isRegister ? (
              <Field
                icon={<UserRound color={zenDarkTheme.textSecondary} size={16} />}
                label={copy.auth.lastName}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                placeholder={copy.auth.lastName}
              />
            ) : null}

            <Field
              icon={<Mail color={zenDarkTheme.accent} size={16} />}
              label={copy.auth.email}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholder={copy.auth.emailPlaceholder}
            />

            <Field
              icon={<LockKeyhole color={zenDarkTheme.accent} size={16} />}
              label={copy.auth.password}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry
              autoComplete={isRegister ? "new-password" : "password"}
              placeholder={copy.auth.passwordPlaceholder}
            />

            {error ? (
              <View className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <Text className="text-sm font-medium text-red-200">{error}</Text>
              </View>
            ) : null}

            {!isOnline ? (
              <View
                style={{
                  marginBottom: 16,
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
                  {copy.auth.offlineKnownUser}
                </Text>
              </View>
            ) : null}

            <PrimaryButton
              label={isRegister ? copy.auth.registerButton : copy.auth.loginButton}
              onPress={() => void handleSubmit()}
              disabled={isDisabled}
            />

            <View className="my-5 flex-row items-center">
              <View
                style={{
                  height: 1,
                  flex: 1,
                  backgroundColor: zenDarkTheme.borderMuted,
                }}
              />
              <Text
                style={{
                  marginHorizontal: 12,
                  fontSize: 10,
                  fontWeight: "500",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: zenDarkTheme.textTertiary,
                }}
              >
                {copy.auth.divider}
              </Text>
              <View
                style={{
                  height: 1,
                  flex: 1,
                  backgroundColor: zenDarkTheme.borderMuted,
                }}
              />
            </View>

            <Pressable
              onPress={() => void handleGoogle()}
              disabled={isDisabled}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 22,
                borderWidth: 1,
                borderColor: zenDarkTheme.border,
                backgroundColor: zenDarkTheme.input,
                paddingHorizontal: 20,
                paddingVertical: 16,
                opacity: isDisabled ? 0.5 : 1,
                ...zenGlassEffect,
              }}
            >
              {submitting ? (
                <ActivityIndicator color={zenDarkTheme.accent} size="small" />
              ) : (
                <>
                  <Globe color={zenDarkTheme.accent} size={18} />
                  <Text
                    style={{
                      marginLeft: 12,
                      fontSize: 14,
                      fontWeight: "500",
                      color: zenDarkTheme.textPrimary,
                    }}
                  >
                    {copy.auth.googleButton}
                  </Text>
                </>
              )}
            </Pressable>

            <Text
              style={{
                marginTop: 16,
                fontSize: 12,
                lineHeight: 20,
                color: zenDarkTheme.textTertiary,
              }}
            >
              {helperCopy}
            </Text>
          </View>
        </ScrollView>
      </KeyboardDismissView>
    </SafeAreaView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  icon: ReactNode;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: "email" | "password" | "name" | "new-password" | "off";
  keyboardType?: "default" | "email-address";
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  secureTextEntry,
  autoCapitalize = "none",
  autoComplete = "off",
  keyboardType = "default",
}: FieldProps) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-xs font-semibold uppercase tracking-[1.2px]" style={{ color: zenDarkTheme.textTertiary, fontWeight: "500" }}>
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 22,
          borderWidth: 1,
          borderColor: zenDarkTheme.border,
          backgroundColor: zenDarkTheme.input,
          paddingHorizontal: 16,
          paddingVertical: 4,
          ...zenGlassEffect,
        }}
      >
        <View className="mr-3">{icon}</View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#52525B"
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          keyboardType={keyboardType}
          style={{
            flex: 1,
            color: zenDarkTheme.textPrimary,
            fontSize: 15,
            paddingVertical: 14,
          }}
        />
      </View>
    </View>
  );
}
