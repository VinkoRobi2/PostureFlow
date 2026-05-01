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
  ArrowRight,
  Check,
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

export function AuthScreen({ navigation, route }: Props) {
  const { height: screenH, width: screenW } = useWindowDimensions();
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
  const tinyPhone = screenW < 360 || screenH < 690;
  const compactPhone = screenH < 760 || screenW < 380;
  const roomyPhone = screenW >= 410 && screenH >= 780;
  const helperCopy = useMemo(
    () => (isOnline ? copy.auth.googleHint : copy.auth.offlineNoSession),
    [copy.auth.googleHint, copy.auth.offlineNoSession, isOnline],
  );
  const titleLead = locale === "es" ? "Accede a tu" : "Access your";
  const titleStrong = locale === "es" ? "plan postural." : "posture plan.";

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
    <SafeAreaView style={{ flex: 1, backgroundColor: zenDarkTheme.canvas }}>
      <StatusBar style="dark" />

      <KeyboardDismissView>
        <View style={{ flex: 1, backgroundColor: zenDarkTheme.canvas }}>
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: zenDarkTheme.canvas,
            }}
          />

          <ScrollView
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: screenPadH,
              paddingTop: compactPhone ? rs(74) : rs(88),
              paddingBottom: compactPhone ? rs(22) : rs(30),
              maxWidth: rs(460),
              alignSelf: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                position: "absolute",
                top: compactPhone ? rs(14) : rs(18),
                left: screenPadH,
                flexDirection: "row",
                alignItems: "center",
                gap: rs(6),
                borderRadius: rs(999),
                borderWidth: hairline,
                borderColor: zenDarkTheme.border,
                backgroundColor: zenDarkTheme.surface,
                paddingHorizontal: rs(11),
                paddingVertical: rs(8),
              }}
            >
              <LockKeyhole
                color={zenDarkTheme.accentStrong}
                size={rs(11)}
                strokeWidth={2}
              />
              <Text
                style={{
                  color: zenDarkTheme.accentStrong,
                  fontFamily: ff,
                  fontSize: rs(10),
                  fontWeight: "800",
                  letterSpacing: 1.3,
                  textTransform: "uppercase",
                }}
              >
                {copy.auth.eyebrow}
              </Text>
            </View>

            <Pressable
              onPress={() => void toggleLocale()}
              style={({ pressed }) => ({
                position: "absolute",
                top: compactPhone ? rs(14) : rs(18),
                right: screenPadH,
                flexDirection: "row",
                alignItems: "center",
                borderRadius: rs(999),
                borderWidth: hairline,
                borderColor: zenDarkTheme.border,
                backgroundColor: zenDarkTheme.surface,
                gap: rs(4),
                padding: rs(4),
                opacity: pressed ? 0.82 : 1,
              })}
            >
              <Globe
                color={zenDarkTheme.accentStrong}
                size={rs(14)}
                strokeWidth={1.8}
              />
              {(["en", "es"] as const).map((item) => {
                const active = locale === item;

                return (
                  <View
                    key={item}
                    style={{
                      minWidth: rs(38),
                      borderRadius: rs(999),
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: rs(3),
                      backgroundColor: active
                        ? zenDarkTheme.accentStrong
                        : "transparent",
                      paddingHorizontal: rs(8),
                      paddingVertical: rs(5),
                    }}
                  >
                    <Text
                      style={{
                        color: active
                          ? zenDarkTheme.textInverse
                          : zenDarkTheme.textPrimary,
                        fontFamily: ff,
                        fontSize: rs(10),
                        fontWeight: "800",
                        letterSpacing: 0.7,
                        textTransform: "uppercase",
                      }}
                    >
                      {item.toUpperCase()}
                    </Text>
                    {active ? (
                      <Check
                        color={zenDarkTheme.textInverse}
                        size={rs(10)}
                        strokeWidth={2.6}
                      />
                    ) : null}
                  </View>
                );
              })}
            </Pressable>

            <View
              style={{
                flex: 1,
                justifyContent: "center",
                paddingTop: tinyPhone ? rs(2) : rs(10),
              }}
            >
              <View
                style={{
                  marginBottom: compactPhone ? rs(18) : rs(26),
                  paddingRight: rs(18),
                }}
              >
                <Text
                  style={{
                    color: zenDarkTheme.textPrimary,
                    fontFamily: ff,
                    fontSize: tinyPhone ? rs(30) : roomyPhone ? rs(38) : rs(34),
                    fontWeight: "500",
                    lineHeight: tinyPhone ? rs(35) : roomyPhone ? rs(43) : rs(39),
                    letterSpacing: -0.8,
                  }}
                >
                  {titleLead}
                  {"\n"}
                  <Text
                    style={{
                      color: zenDarkTheme.textPrimary,
                      fontFamily: ff,
                      fontWeight: "900",
                      letterSpacing: -1.2,
                    }}
                  >
                    {titleStrong}
                  </Text>
                </Text>
              </View>

              <View
                style={{
                  borderRadius: rs(34),
                  borderWidth: hairline,
                  borderColor: zenDarkTheme.border,
                  backgroundColor: zenDarkTheme.surface,
                  padding: compactPhone ? rs(14) : rs(16),
                  overflow: "hidden",
                  shadowColor: zenDarkTheme.textPrimary,
                  shadowOffset: { width: 0, height: 16 },
                  shadowOpacity: 0.08,
                  shadowRadius: rs(30),
                  elevation: 5,
                }}
              >
                <View
                  style={{
                    position: "relative",
                    marginBottom: compactPhone ? rs(14) : rs(18),
                    flexDirection: "row",
                    borderRadius: rs(999),
                    backgroundColor: zenDarkTheme.canvas,
                    padding: rs(4),
                    borderWidth: hairline,
                    borderColor: zenDarkTheme.border,
                    overflow: "hidden",
                  }}
                >
                  <View
                    pointerEvents="none"
                    style={[
                      {
                        position: "absolute",
                        top: rs(4),
                        bottom: rs(4),
                        borderRadius: rs(999),
                        backgroundColor: zenDarkTheme.accentStrong,
                        borderWidth: hairline,
                        borderColor: "rgba(91,54,36,0.22)",
                      },
                      isRegister
                        ? { left: "50%", right: rs(4) }
                        : { left: rs(4), right: "50%" },
                    ]}
                  />

                  {(["login", "register"] as const).map((item) => {
                    const active = item === mode;

                    return (
                      <Pressable
                        key={item}
                        onPress={() => {
                          setMode(item);
                          setError(null);
                        }}
                        style={({ pressed }) => ({
                          flex: 1,
                          alignItems: "center",
                          borderRadius: rs(999),
                          paddingHorizontal: rs(10),
                          paddingVertical: compactPhone ? rs(10) : rs(12),
                          opacity: pressed ? 0.76 : 1,
                        })}
                      >
                        <Text
                          style={{
                            color: active
                              ? zenDarkTheme.textInverse
                              : zenDarkTheme.accentStrong,
                            fontFamily: ff,
                            fontSize: rs(11),
                            fontWeight: "900",
                            letterSpacing: 1.1,
                            textTransform: "uppercase",
                          }}
                        >
                          {item === "login"
                            ? copy.auth.loginTab
                            : copy.auth.registerTab}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={{ gap: compactPhone ? rs(10) : rs(12) }}>
                  {isRegister ? (
                    <View style={{ flexDirection: "row", gap: rs(12) }}>
                      <View style={{ flex: 1 }}>
                        <Field
                          icon={
                            <UserRound
                              color={zenDarkTheme.accentStrong}
                              size={rs(15)}
                              strokeWidth={1.7}
                            />
                          }
                          label={copy.auth.firstName}
                          value={firstName}
                          onChangeText={setFirstName}
                          autoCapitalize="words"
                          autoComplete="name"
                          placeholder={copy.auth.firstName}
                          compact={compactPhone}
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Field
                          icon={
                            <UserRound
                              color={zenDarkTheme.textSecondary}
                              size={rs(15)}
                              strokeWidth={1.7}
                            />
                          }
                          label={copy.auth.lastName}
                          value={lastName}
                          onChangeText={setLastName}
                          autoCapitalize="words"
                          autoComplete="name"
                          placeholder={copy.auth.lastName}
                          compact={compactPhone}
                        />
                      </View>
                    </View>
                  ) : null}

                  <Field
                    icon={
                      <Mail
                        color={zenDarkTheme.accentStrong}
                        size={rs(15)}
                        strokeWidth={1.7}
                      />
                    }
                    label={copy.auth.email}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    placeholder={copy.auth.emailPlaceholder}
                    compact={compactPhone}
                  />

                  <Field
                    icon={
                      <LockKeyhole
                        color={zenDarkTheme.accentStrong}
                        size={rs(15)}
                        strokeWidth={1.7}
                      />
                    }
                    label={copy.auth.password}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    secureTextEntry
                    autoComplete={isRegister ? "new-password" : "password"}
                    placeholder={copy.auth.passwordPlaceholder}
                    compact={compactPhone}
                  />
                </View>

                {error ? (
                  <View
                    style={{
                      marginTop: rs(12),
                      borderRadius: rs(18),
                      borderWidth: hairline,
                      borderColor: "rgba(176,112,80,0.28)",
                      backgroundColor: "rgba(176,112,80,0.10)",
                      paddingHorizontal: rs(14),
                      paddingVertical: rs(10),
                    }}
                  >
                    <Text
                      style={{
                        color: zenDarkTheme.textPrimary,
                        fontFamily: ff,
                        fontSize: rs(13),
                        fontWeight: "600",
                        lineHeight: rs(19),
                      }}
                    >
                      {error}
                    </Text>
                  </View>
                ) : null}

                {!isOnline ? (
                  <View
                    style={{
                      marginTop: rs(12),
                      borderRadius: rs(18),
                      borderWidth: hairline,
                      borderColor: zenDarkTheme.border,
                      backgroundColor: "rgba(232,228,220,0.66)",
                      paddingHorizontal: rs(14),
                      paddingVertical: rs(10),
                    }}
                  >
                    <Text
                      style={{
                        color: zenDarkTheme.textSecondary,
                        fontFamily: ff,
                        fontSize: rs(13),
                        lineHeight: rs(19),
                      }}
                    >
                      {copy.auth.offlineKnownUser}
                    </Text>
                  </View>
                ) : null}

                <Pressable
                  disabled={isDisabled}
                  onPress={() => void handleSubmit()}
                  style={({ pressed }) => ({
                    marginTop: compactPhone ? rs(14) : rs(18),
                    minHeight: compactPhone ? rs(58) : rs(64),
                    borderRadius: rs(24),
                    borderWidth: hairline,
                    borderColor: "rgba(91,54,36,0.22)",
                    backgroundColor: zenDarkTheme.accentStrong,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: rs(20),
                    paddingVertical: compactPhone ? rs(13) : rs(15),
                    opacity: isDisabled ? 0.5 : pressed ? 0.9 : 1,
                    shadowColor: zenDarkTheme.accentStrong,
                    shadowOffset: { width: 0, height: 16 },
                    shadowOpacity: 0.18,
                    shadowRadius: rs(20),
                    elevation: 7,
                  })}
                >
                  <Text
                    style={{
                      color: zenDarkTheme.textInverse,
                      fontFamily: ff,
                      fontSize: compactPhone ? rs(16) : rs(17),
                      fontWeight: "900",
                      letterSpacing: -0.2,
                    }}
                  >
                    {isRegister ? copy.auth.registerButton : copy.auth.loginButton}
                  </Text>
                  <View
                    style={{
                      width: rs(38),
                      height: rs(38),
                      borderRadius: rs(16),
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(28,24,20,0.14)",
                      borderWidth: hairline,
                      borderColor: "rgba(255,255,255,0.16)",
                    }}
                  >
                    <ArrowRight
                      color={zenDarkTheme.textInverse}
                      size={rs(18)}
                      strokeWidth={1.9}
                    />
                  </View>
                </Pressable>

                <View
                  style={{
                    marginVertical: compactPhone ? rs(12) : rs(16),
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      height: hairline,
                      flex: 1,
                      backgroundColor: "rgba(204,200,192,0.85)",
                    }}
                  />
                  <Text
                    style={{
                      marginHorizontal: rs(12),
                      color: zenDarkTheme.textTertiary,
                      fontFamily: ff,
                      fontSize: rs(10),
                      fontWeight: "800",
                      letterSpacing: 1.4,
                      textTransform: "uppercase",
                    }}
                  >
                    {copy.auth.divider}
                  </Text>
                  <View
                    style={{
                      height: hairline,
                      flex: 1,
                      backgroundColor: "rgba(204,200,192,0.85)",
                    }}
                  />
                </View>

                <Pressable
                  onPress={() => void handleGoogleLogin()}
                  disabled={isDisabled}
                  style={({ pressed }) => ({
                    minHeight: compactPhone ? rs(54) : rs(58),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: rs(20),
                    borderWidth: hairline,
                    borderColor: zenDarkTheme.border,
                    backgroundColor: pressed
                      ? zenDarkTheme.canvasAlt
                      : zenDarkTheme.canvas,
                    paddingHorizontal: rs(18),
                    paddingVertical: compactPhone ? rs(12) : rs(14),
                    opacity: isDisabled ? 0.5 : 1,
                  })}
                >
                  {submitting ? (
                    <ActivityIndicator color={zenDarkTheme.accentStrong} size="small" />
                  ) : (
                    <>
                      <View
                        style={{
                          width: rs(25),
                          height: rs(25),
                          borderRadius: rs(10),
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: zenDarkTheme.canvas,
                          borderWidth: hairline,
                          borderColor: zenDarkTheme.border,
                        }}
                      >
                        <GoogleLogo size={rs(18)} />
                      </View>
                      <Text
                        style={{
                          marginLeft: rs(11),
                          color: zenDarkTheme.textPrimary,
                          fontFamily: ff,
                          fontSize: rs(14),
                          fontWeight: "800",
                        }}
                      >
                        {copy.auth.googleButton}
                      </Text>
                    </>
                  )}
                </Pressable>

                <Text
                  style={{
                    marginTop: compactPhone ? rs(10) : rs(14),
                    color: zenDarkTheme.textTertiary,
                    fontFamily: ff,
                    fontSize: rs(12),
                    lineHeight: rs(18),
                    textAlign: "center",
                  }}
                >
                  {helperCopy}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardDismissView>
    </SafeAreaView>
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
  compact: boolean;
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
  compact,
  secureTextEntry,
  autoCapitalize = "none",
  autoComplete = "off",
  keyboardType = "default",
}: FieldProps) {
  return (
    <View
      style={{
        borderRadius: rs(20),
        borderWidth: hairline,
        borderColor: zenDarkTheme.border,
        backgroundColor: zenDarkTheme.canvas,
        paddingHorizontal: compact ? rs(12) : rs(14),
        paddingTop: compact ? rs(10) : rs(12),
        paddingBottom: compact ? rs(10) : rs(12),
        shadowColor: zenDarkTheme.accentStrong,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.06,
        shadowRadius: rs(18),
        elevation: 2,
      }}
    >
      <Text
        numberOfLines={1}
        style={{
          color: zenDarkTheme.textSecondary,
          fontFamily: ff,
          fontSize: rs(10),
          fontWeight: "900",
          letterSpacing: 1.1,
          marginBottom: compact ? rs(7) : rs(8),
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: rs(28),
            height: rs(28),
            borderRadius: rs(11),
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: zenDarkTheme.surface,
            marginRight: rs(10),
          }}
        >
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
          style={{
            flex: 1,
            color: zenDarkTheme.textPrimary,
            fontFamily: ff,
            fontSize: rs(15),
            fontWeight: "700",
            minWidth: 0,
            padding: 0,
          }}
        />
      </View>
    </View>
  );
}
