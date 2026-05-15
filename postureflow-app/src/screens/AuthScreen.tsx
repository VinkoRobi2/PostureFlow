import { StatusBar } from "expo-status-bar";
import { type ReactNode, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AlertCircle,
  Globe,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react-native";
import Svg, { Path } from "react-native-svg";
import { KeyboardDismissView } from "../components/KeyboardDismissView";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import { zenDarkTheme } from "../theme/zen-dark";
import type { AppScreenProps, AuthFormMode } from "../types/app";
import { ff, hairline, rs, screenPadH } from "../utils/responsive";

type Props = AppScreenProps<"Auth">;

const GLASS_CARD = "rounded-[28px] border border-[#DDD5CA] bg-[#F8F5EF]/90";
const GLASS_CONTROL = "rounded-[28px] border border-[#DDD5CA] bg-[#F2EFE9]";

export function AuthScreen({ navigation, route }: Props) {
  const { height: screenH, width: screenW } = useWindowDimensions();
  const {
    continueWithGoogle,
    hasCompletedOnboarding,
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
  const compactPhone = screenH < 760 || screenW < 380;
  const tinyPhone = screenH < 690 || screenW < 360;
  const helperCopy = useMemo(
    () => (isOnline ? copy.auth.googleHint : copy.auth.offlineNoSession),
    [copy.auth.googleHint, copy.auth.offlineNoSession, isOnline],
  );
  const titleLead = locale === "es" ? "Accede a tu" : "Access your";
  const titleStrong = locale === "es" ? "plan postural." : "posture plan.";
  const primaryCta = locale === "es" ? "Continuar" : "Continue";
  const authTabLabels: Record<AuthFormMode, string> =
    locale === "es"
      ? { login: "Entrar", register: "Registro" }
      : { login: "Sign in", register: "Sign up" };

  const goNext = (onboardingCompleted: boolean) => {
    if (
      !onboardingCompleted &&
      hasCompletedOnboarding &&
      painSelection.length > 0 &&
      setupSelection.length > 0
    ) {
      navigation.replace("Analyzing");
      return;
    }

    if (onboardingCompleted || hasCompletedOnboarding) {
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

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const result = await continueWithGoogle();

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
    <SafeAreaView className="flex-1 bg-[#F2EFE9]">
      <StatusBar style="dark" />

      <KeyboardDismissView>
        <View className="flex-1 bg-[#F2EFE9]">
          {error ? (
            <View
              className="absolute left-6 right-6 z-50 flex-row items-start rounded-[28px] border border-[#C7825D]/30 bg-[#F8E7DE] px-4 py-3"
              style={{ top: rs(58) }}
            >
              <AlertCircle
                color={zenDarkTheme.accentStrong}
                size={rs(17)}
                strokeWidth={2}
              />
              <Text
                className="ml-3 flex-1 text-sm font-bold text-[#1D1A17]"
                style={{ fontFamily: ff, lineHeight: rs(19) }}
              >
                {error}
              </Text>
            </View>
          ) : null}

          <ScrollView
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: screenPadH,
              paddingTop: compactPhone ? rs(18) : rs(24),
              paddingBottom: rs(132),
              maxWidth: rs(460),
              alignSelf: "center",
              width: "100%",
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="h-8 max-w-[220px] flex-row items-center rounded-full border border-[#DDD5CA] bg-[#F8F5EF]/90 px-3">
                <LockKeyhole
                  color={zenDarkTheme.accentStrong}
                  size={rs(11)}
                  strokeWidth={2}
                />
                <Text
                  className="ml-2 text-[10px] font-extrabold uppercase tracking-[1px] text-[#B77551]"
                  numberOfLines={1}
                  style={{ fontFamily: ff }}
                >
                  {copy.auth.eyebrow}
                </Text>
              </View>

              <LanguagePill locale={locale} onToggle={() => void toggleLocale()} />
            </View>

            <View
              className="flex-1 justify-center"
              style={{ paddingTop: tinyPhone ? rs(28) : rs(42) }}
            >
              <View className="mb-7">
                <Text
                  className="text-[#161412]"
                  style={{
                    fontFamily: ff,
                    fontSize: tinyPhone ? rs(34) : rs(42),
                    fontWeight: "500",
                    lineHeight: tinyPhone ? rs(39) : rs(48),
                  }}
                >
                  {titleLead}
                  {"\n"}
                  <Text style={{ fontFamily: ff, fontWeight: "900" }}>
                    {titleStrong}
                  </Text>
                </Text>
              </View>

              <View
                className={`${GLASS_CARD} px-5 py-7`}
                style={{
                  shadowColor: zenDarkTheme.textPrimary,
                  shadowOffset: { width: 0, height: 18 },
                  shadowOpacity: 0.08,
                  shadowRadius: rs(28),
                  elevation: 5,
                }}
              >
                <View className="mb-6 flex-row gap-2 rounded-full border border-[#DDD5CA] bg-[#F2EFE9] p-1">
                  {(["login", "register"] as const).map((item) => {
                    const active = item === mode;

                    return (
                      <Pressable
                        key={item}
                        className={`h-11 flex-1 items-center justify-center rounded-full ${
                          active ? "bg-[#B77551]" : "bg-transparent"
                        }`}
                        onPress={() => {
                          setMode(item);
                          setError(null);
                        }}
                      >
                        <Text
                          className={`text-xs font-black uppercase tracking-[0.6px] ${
                            active ? "text-white" : "text-[#B77551]"
                          }`}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          minimumFontScale={0.78}
                          style={{ fontFamily: ff }}
                        >
                          {authTabLabels[item]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View className="gap-4 py-2">
                  {isRegister ? (
                    <View className={`${tinyPhone ? "gap-4" : "flex-row gap-4"}`}>
                      <View className="flex-1">
                        <Field
                          icon={
                            <UserRound
                              color={zenDarkTheme.accentStrong}
                              size={rs(16)}
                              strokeWidth={1.8}
                            />
                          }
                          label={copy.auth.firstName}
                          value={firstName}
                          onChangeText={setFirstName}
                          autoCapitalize="words"
                          autoComplete="name"
                          placeholder={copy.auth.firstName}
                        />
                      </View>

                      <View className="flex-1">
                        <Field
                          icon={
                            <UserRound
                              color={zenDarkTheme.textSecondary}
                              size={rs(16)}
                              strokeWidth={1.8}
                            />
                          }
                          label={copy.auth.lastName}
                          value={lastName}
                          onChangeText={setLastName}
                          autoCapitalize="words"
                          autoComplete="name"
                          placeholder={copy.auth.lastName}
                        />
                      </View>
                    </View>
                  ) : null}

                  <Field
                    icon={
                      <Mail
                        color={zenDarkTheme.accentStrong}
                        size={rs(16)}
                        strokeWidth={1.8}
                      />
                    }
                    label={copy.auth.email}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    placeholder={copy.auth.emailPlaceholder}
                  />

                  <Field
                    icon={
                      <LockKeyhole
                        color={zenDarkTheme.accentStrong}
                        size={rs(16)}
                        strokeWidth={1.8}
                      />
                    }
                    label={copy.auth.password}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    secureTextEntry
                    autoComplete={isRegister ? "new-password" : "password"}
                    placeholder={copy.auth.passwordPlaceholder}
                  />
                </View>

                {!isOnline ? (
                  <View className="mt-5 rounded-[28px] border border-[#DDD5CA] bg-[#EEE7DC] px-4 py-3">
                    <Text
                      className="text-sm text-[#756E66]"
                      style={{ fontFamily: ff, lineHeight: rs(20) }}
                    >
                      {copy.auth.offlineKnownUser}
                    </Text>
                  </View>
                ) : null}

                <View className="my-6 flex-row items-center">
                  <View className="h-px flex-1 bg-[#D3CCC1]" />
                  <Text
                    className="mx-3 text-[10px] font-black uppercase tracking-[1.2px] text-[#9D968B]"
                    style={{ fontFamily: ff }}
                  >
                    {copy.auth.divider}
                  </Text>
                  <View className="h-px flex-1 bg-[#D3CCC1]" />
                </View>

                <Pressable
                  className={`${GLASS_CONTROL} min-h-[58px] flex-row items-center justify-center px-5 py-4`}
                  disabled={isDisabled}
                  onPress={() => void handleGoogleLogin()}
                  style={({ pressed }) => ({
                    opacity: isDisabled ? 0.5 : pressed ? 0.84 : 1,
                  })}
                >
                  {submitting ? (
                    <ActivityIndicator color={zenDarkTheme.accentStrong} size="small" />
                  ) : (
                    <>
                      <View className="h-8 w-8 items-center justify-center rounded-full bg-[#F8F5EF]">
                        <GoogleLogo size={rs(18)} />
                      </View>
                      <Text
                        className="ml-3 text-base font-black text-[#161412]"
                        style={{ fontFamily: ff }}
                      >
                        {copy.auth.googleButton}
                      </Text>
                    </>
                  )}
                </Pressable>

                <Text
                  className="mt-4 text-center text-xs text-[#9D968B]"
                  style={{ fontFamily: ff, lineHeight: rs(18) }}
                >
                  {helperCopy}
                </Text>
              </View>
            </View>
          </ScrollView>

          <View className="absolute bottom-0 left-0 right-0 items-center bg-[#F2EFE9]/95 px-6 pb-6 pt-3">
            <Pressable
              className="h-14 w-11/12 items-center justify-center rounded-full bg-black"
              disabled={isDisabled}
              onPress={() => void handleSubmit()}
              style={({ pressed }) => ({
                opacity: isDisabled ? 0.45 : pressed ? 0.86 : 1,
              })}
            >
              <Text
                className="text-base font-black text-white"
                style={{ fontFamily: ff }}
              >
                {submitting ? copy.common.loading : primaryCta}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardDismissView>
    </SafeAreaView>
  );
}

function LanguagePill({
  locale,
  onToggle,
}: {
  locale: "en" | "es";
  onToggle: () => void;
}) {
  return (
    <Pressable
      className="h-8 w-20 flex-row items-center rounded-full border border-[#DDD5CA] bg-[#F8F5EF] p-1"
      onPress={onToggle}
    >
      <Globe color={zenDarkTheme.accentStrong} size={rs(10)} strokeWidth={1.8} />
      {(["en", "es"] as const).map((item) => {
        const active = locale === item;

        return (
          <View
            key={item}
            className={`ml-1 h-6 flex-1 items-center justify-center rounded-full ${
              active ? "bg-[#1B1815]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-xs font-black uppercase ${
                active ? "text-white" : "text-[#8C857B]"
              }`}
              style={{ fontFamily: ff }}
            >
              {item.toUpperCase()}
            </Text>
          </View>
        );
      })}
    </Pressable>
  );
}

function GoogleLogo({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <Path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <Path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <Path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <Path fill="none" d="M0 0h48v48H0z" />
    </Svg>
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
    <View className={`${GLASS_CONTROL} px-5 py-5`}>
      <Text
        className="mb-3 text-[11px] font-black uppercase tracking-[1.6px] text-[#70695F]"
        numberOfLines={1}
        style={{ fontFamily: ff }}
      >
        {label}
      </Text>

      <View className="flex-row items-center">
        <View className="mr-4 h-9 w-9 items-center justify-center rounded-full bg-[#F8F5EF]">
          {icon}
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={zenDarkTheme.textTertiary}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          keyboardType={keyboardType}
          className="min-w-0 flex-1 p-0 text-base font-bold text-[#161412]"
          style={{ fontFamily: ff }}
        />
      </View>
    </View>
  );
}
