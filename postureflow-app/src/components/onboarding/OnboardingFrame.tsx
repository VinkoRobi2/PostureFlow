import { StatusBar } from "expo-status-bar";
import {
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  type StyleProp,
  type ViewStyle,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onboardingDarkTheme } from "../../theme/onboarding-pro-dark";

type OnboardingFrameProps = PropsWithChildren<{
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  keyboard?: boolean;
}>;

export function OnboardingFrame({
  children,
  footer,
  contentStyle,
  keyboard = false,
}: OnboardingFrameProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translate]);

  const body = (
    <Animated.View
      style={[
        {
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 18,
          paddingBottom: 24,
          opacity,
          transform: [{ translateY: translate }],
        },
        contentStyle,
      ]}
    >
      {children}
    </Animated.View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: onboardingDarkTheme.background }}>
      <StatusBar style="light" />

      <View style={{ flex: 1, backgroundColor: onboardingDarkTheme.background }}>
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: -92,
            right: -108,
            width: 184,
            height: 184,
            borderRadius: 999,
            backgroundColor: onboardingDarkTheme.accentGlow,
            opacity: 0.52,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            bottom: -128,
            left: -126,
            width: 236,
            height: 236,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.02)",
          }}
        />

        {keyboard ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            {body}
            {footer}
          </KeyboardAvoidingView>
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
