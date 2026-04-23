import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import { useAppModel } from "../providers/app-provider";
import { zenAmbientGlow } from "../theme/zen-dark";
import { onboardingDarkTheme } from "../theme/onboarding-pro-dark";
import type { AppScreenProps } from "../types/app";
import { getLocalizedOnboardingText } from "./onboarding/content";

type Props = AppScreenProps<"Splash">;

export function SplashScreen({ navigation }: Props) {
  const { entryRoute, isHydrated, locale } = useAppModel();
  const copy = getLocalizedOnboardingText(locale);
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
      <StatusBar style="light" />

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
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
            backgroundColor: onboardingDarkTheme.background,
          }}
        >
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: -80,
              right: -60,
              width: 220,
              height: 220,
              borderRadius: 999,
              backgroundColor: onboardingDarkTheme.accentGlow,
              opacity: 0.8,
            }}
          />

          <Animated.View
            style={{
              alignItems: "center",
              opacity,
              transform: [{ scale }],
            }}
          >
            <View
              style={{
                width: 140,
                height: 140,
                borderRadius: 40,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: onboardingDarkTheme.card,
                borderWidth: 1,
                borderColor: onboardingDarkTheme.border,
                marginBottom: 26,
                ...zenAmbientGlow(0.08, 20),
              }}
            >
              <Svg width={96} height={110} viewBox="0 0 112 136">
                <Circle
                  cx="56"
                  cy="20"
                  r="10"
                  stroke={onboardingDarkTheme.accent}
                  strokeWidth="1.6"
                  fill="none"
                />
                <Line
                  x1="56"
                  y1="32"
                  x2="56"
                  y2="76"
                  stroke={onboardingDarkTheme.accent}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <Line
                  x1="36"
                  y1="42"
                  x2="76"
                  y2="42"
                  stroke={onboardingDarkTheme.accent}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <Rect x="51" y="40" width="10" height="5" rx="2.5" fill={onboardingDarkTheme.accent} />
                <Rect x="51" y="49" width="10" height="5" rx="2.5" fill={onboardingDarkTheme.accent} />
                <Rect x="51" y="58" width="10" height="5" rx="2.5" fill={onboardingDarkTheme.accent} />
                <Rect x="51" y="67" width="10" height="5" rx="2.5" fill={onboardingDarkTheme.accent} />
                <Path
                  d="M56 76 L82 76 L82 108"
                  stroke={onboardingDarkTheme.accent}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <Path
                  d="M56 76 L46 108 L78 108"
                  stroke={onboardingDarkTheme.accent}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </Svg>
            </View>

            <Text
              style={{
                color: onboardingDarkTheme.textPrimary,
                fontSize: 42,
                fontWeight: "400",
                letterSpacing: -1.2,
              }}
            >
              {copy.welcome}
            </Text>
          </Animated.View>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}
