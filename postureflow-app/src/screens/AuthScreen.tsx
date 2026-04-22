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
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import type { AppScreenProps, AuthFormMode } from "../types/app";

type Props = AppScreenProps<"Auth">;

export function AuthScreen({ navigation, route }: Props) {
  const {
    continueWithGoogle,
    isOnline,
    locale,
    loginWithEmail,
    registerWithEmail,
    toggleLocale,
  } = useAppModel();
  const copy = messages[locale];
  const [mode, setMode] = useState<AuthFormMode>(route.params?.mode ?? "login");
  const [firstName, setFirstName] = useState("");
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
    navigation.replace(onboardingCompleted ? "Dashboard" : "PainMap");
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar style="light" />

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
            <View className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1">
              <Text className="text-[10px] font-semibold uppercase tracking-[1.5px] text-emerald-400">
                {copy.auth.eyebrow}
              </Text>
            </View>

            <LanguageToggle locale={locale} onToggle={() => void toggleLocale()} />
          </View>

          <View className="mb-8">
            <Text className="text-3xl font-semibold leading-10 text-white">
              {copy.auth.title}
            </Text>
            <Text className="mt-3 text-sm leading-6 text-zinc-400">
              {copy.auth.subtitle}
            </Text>
          </View>

          <View className="mb-6 flex-row rounded-full border border-zinc-800 bg-zinc-950 p-1">
            {(["login", "register"] as const).map((item) => {
              const active = item === mode;
              return (
                <Pressable
                  key={item}
                  onPress={() => {
                    setMode(item);
                    setError(null);
                  }}
                  className={`flex-1 rounded-full px-4 py-3 ${
                    active ? "bg-emerald-500" : ""
                  }`}
                >
                  <Text
                    className={`text-center text-xs font-semibold uppercase tracking-[1px] ${
                      active ? "text-black" : "text-zinc-400"
                    }`}
                  >
                    {item === "login" ? copy.auth.loginTab : copy.auth.registerTab}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="rounded-[28px] border border-zinc-800 bg-zinc-950 px-5 py-5">
            {isRegister ? (
              <Field
                icon={<UserRound color="#10B981" size={16} />}
                label={copy.auth.firstName}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                placeholder={copy.auth.firstName}
              />
            ) : null}

            {isRegister ? (
              <Field
                icon={<UserRound color="#A1A1AA" size={16} />}
                label={copy.auth.lastName}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                placeholder={copy.auth.lastName}
              />
            ) : null}

            <Field
              icon={<Mail color="#10B981" size={16} />}
              label={copy.auth.email}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholder={copy.auth.emailPlaceholder}
            />

            <Field
              icon={<LockKeyhole color="#10B981" size={16} />}
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
              <View className="mb-4 rounded-2xl border border-zinc-800 bg-black px-4 py-3">
                <Text className="text-sm leading-5 text-zinc-400">
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
              <View className="h-px flex-1 bg-zinc-800" />
              <Text className="mx-3 text-[10px] font-semibold uppercase tracking-[1.5px] text-zinc-500">
                {copy.auth.divider}
              </Text>
              <View className="h-px flex-1 bg-zinc-800" />
            </View>

            <Pressable
              onPress={() => void handleGoogle()}
              disabled={isDisabled}
              className={`flex-row items-center justify-center rounded-[22px] border border-zinc-700 bg-black px-5 py-4 ${
                isDisabled ? "opacity-50" : ""
              }`}
            >
              {submitting ? (
                <ActivityIndicator color="#10B981" size="small" />
              ) : (
                <>
                  <Globe color="#10B981" size={18} />
                  <Text className="ml-3 text-sm font-semibold text-white">
                    {copy.auth.googleButton}
                  </Text>
                </>
              )}
            </Pressable>

            <Text className="mt-4 text-xs leading-5 text-zinc-500">{helperCopy}</Text>
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
      <Text className="mb-2 text-xs font-semibold uppercase tracking-[1.2px] text-zinc-500">
        {label}
      </Text>
      <View className="flex-row items-center rounded-[22px] border border-zinc-800 bg-black px-4 py-1">
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
            color: "#FFFFFF",
            fontSize: 15,
            paddingVertical: 14,
          }}
        />
      </View>
    </View>
  );
}
