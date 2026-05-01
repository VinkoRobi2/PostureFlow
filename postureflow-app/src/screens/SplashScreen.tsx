import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { useAppModel } from "../providers/app-provider";
import { zenAmbientGlow } from "../theme/zen-dark";
import { onboardingDarkTheme } from "../theme/onboarding-pro-dark";
import type { AppScreenProps } from "../types/app";

type Props = AppScreenProps<"Splash">;

export function SplashScreen({ navigation }: Props) {
  const { entryRoute, isHydrated, locale } = useAppModel();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;
  const hasNavigated = useRef(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  useEffect(() => {
    if (!isHydrated || hasNavigated.current) {
      return;
    }

    const timer = setTimeout(() => {
      hasNavigated.current = true;
      navigation.replace(entryRoute);
    }, 2000);

    return () => clearTimeout(timer);
  }, [entryRoute, isHydrated, navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: onboardingDarkTheme.background }}>
      <StatusBar style="dark" />

      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          if (hasNavigated.current || !isHydrated) {
            return;
          }

          hasNavigated.current = true;
          navigation.replace(entryRoute);
        }}
      >
        <Animated.View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 32,
            opacity,
            transform: [{ scale }],
          }}
        >
          <View
            style={{
              width: 142,
              height: 142,
              borderRadius: 44,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: onboardingDarkTheme.card,
              borderWidth: 1,
              borderColor: onboardingDarkTheme.border,
              ...zenAmbientGlow(0.09, 24, onboardingDarkTheme.accent),
            }}
          >
            <PostureFlowMark />
          </View>

          <Text
            style={{
              marginTop: 26,
              color: onboardingDarkTheme.textPrimary,
              fontSize: 31,
              fontWeight: "900",
              letterSpacing: -0.8,
            }}
          >
            PostureFlow
          </Text>

          <Text
            style={{
              marginTop: 8,
              color: onboardingDarkTheme.textSecondary,
              fontSize: 14,
              fontWeight: "700",
              letterSpacing: 0.2,
              textAlign: "center",
            }}
          >
            {locale === "es"
              ? "Inhala. Exhala. Trabaja mejor."
              : "Inhale. Exhale. Work better."}
          </Text>
        </Animated.View>
      </Pressable>
    </SafeAreaView>
  );
}

function PostureFlowMark() {
  return (
    <Svg width={86} height={86} viewBox="0 0 86 86">
      <Circle
        cx="43"
        cy="43"
        r="35"
        fill={onboardingDarkTheme.porcelain}
        stroke={onboardingDarkTheme.borderStrong}
        strokeWidth="2"
      />
      <Path
        d="M43 17 C51 25 51 35 43 43 C35 51 35 61 43 69"
        fill="none"
        stroke={onboardingDarkTheme.textPrimary}
        strokeLinecap="round"
        strokeWidth="4"
      />
      <Circle cx="43" cy="15" r="6" fill={onboardingDarkTheme.accent} />
      <Rect
        x="36"
        y="32"
        width="14"
        height="5"
        rx="2.5"
        fill={onboardingDarkTheme.accent}
      />
      <Rect
        x="36"
        y="42"
        width="14"
        height="5"
        rx="2.5"
        fill={onboardingDarkTheme.accent}
      />
      <Rect
        x="36"
        y="52"
        width="14"
        height="5"
        rx="2.5"
        fill={onboardingDarkTheme.accent}
      />
    </Svg>
  );
}
