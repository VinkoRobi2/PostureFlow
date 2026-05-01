import { StatusBar } from "expo-status-bar";
import {
  type PropsWithChildren,
  type ReactNode,
} from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  type StyleProp,
  type ViewStyle,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LanguageToggle } from "../LanguageToggle";
import { ScreenAtmosphere } from "../ScreenAtmosphere";
import { useAppModel } from "../../providers/app-provider";
import { onboardingDarkTheme } from "../../theme/onboarding-pro-dark";
import { rs, screenPadH, screenPadT } from "../../utils/responsive";

type OnboardingFrameProps = PropsWithChildren<{
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  keyboard?: boolean;
  onPress?: () => void;
  showLanguageToggle?: boolean;
}>;

export function OnboardingFrame({
  children,
  footer,
  contentStyle,
  keyboard = false,
  onPress,
  showLanguageToggle = true,
}: OnboardingFrameProps) {
  const { locale, toggleLocale } = useAppModel();
  const body = (
    <View
      style={[
        {
          flex: 1,
          width: "100%",
          maxWidth: rs(460),
          alignSelf: "center",
          paddingHorizontal: screenPadH,
          paddingTop: screenPadT,
          paddingBottom: rs(28),
        },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: onboardingDarkTheme.background }}>
      <StatusBar style="dark" />

      <View style={{ flex: 1, backgroundColor: onboardingDarkTheme.background }}>
        <ScreenAtmosphere />
        {showLanguageToggle ? (
          <View
            style={{
              position: "absolute",
              top: rs(16),
              right: rs(20),
              zIndex: 10,
            }}
          >
            <LanguageToggle
              locale={locale}
              onToggle={() => void toggleLocale()}
              variant="dark"
            />
          </View>
        ) : null}
        {keyboard ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            {body}
            {footer}
          </KeyboardAvoidingView>
        ) : onPress ? (
          <Pressable style={{ flex: 1 }} onPress={onPress}>
            {body}
            {footer}
          </Pressable>
        ) : (
          <>
            {body}
            {footer}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
