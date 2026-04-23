import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import { zenAmbientGlow, zenDarkTheme } from "../theme/zen-dark";
import type { AppScreenProps } from "../types/app";

type Props = AppScreenProps<"Splash">;

export function SplashScreen({ navigation }: Props) {
  const { entryRoute, isHydrated, locale } = useAppModel();
  const entranceOpacity = useRef(new Animated.Value(0)).current;
  const entranceTranslate = useRef(new Animated.Value(10)).current;
  const entranceScale = useRef(new Animated.Value(0.96)).current;
  const spinnerRotate = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const hasNavigated = useRef(false);
  const copy = messages[locale];

  useEffect(() => {
    const entrance = Animated.parallel([
      Animated.timing(entranceOpacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(entranceTranslate, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(entranceScale, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    const spinLoop = Animated.loop(
      Animated.timing(spinnerRotate, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    entrance.start();
    spinLoop.start();
    pulseLoop.start();

    return () => {
      spinLoop.stop();
      pulseLoop.stop();
    };
  }, [entranceOpacity, entranceScale, entranceTranslate, pulse, spinnerRotate]);

  useEffect(() => {
    if (!isHydrated || hasNavigated.current) {
      return;
    }

    const timer = setTimeout(() => {
      hasNavigated.current = true;
      navigation.replace(entryRoute);
    }, 2500);

    return () => clearTimeout(timer);
  }, [entryRoute, isHydrated, navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: zenDarkTheme.canvas }}>
      <StatusBar style="light" />

      <View style={{ flex: 1, paddingHorizontal: 32 }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Animated.View
            style={{
              alignItems: "center",
              opacity: entranceOpacity,
              transform: [
                { translateY: entranceTranslate },
                { scale: entranceScale },
              ],
            }}
          >
            <View
              style={{
                width: 136,
                height: 156,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Animated.View
                style={{
                  position: "absolute",
                  width: 110,
                  height: 110,
                  borderRadius: 999,
                  backgroundColor: zenDarkTheme.accent,
                  opacity: 0.08,
                  ...zenAmbientGlow(0.08, 24),
                  transform: [
                    {
                      scale: pulse.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.92, 1.06],
                      }),
                    },
                  ],
                }}
              />

              <Svg width={112} height={136} viewBox="0 0 112 136">
                <Circle
                  cx="56"
                  cy="20"
                  r="10"
                  stroke={zenDarkTheme.accent}
                  strokeWidth="1.6"
                  fill="none"
                />
                <Line
                  x1="56"
                  y1="32"
                  x2="56"
                  y2="76"
                  stroke={zenDarkTheme.accent}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <Line
                  x1="36"
                  y1="42"
                  x2="76"
                  y2="42"
                  stroke={zenDarkTheme.accent}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <Rect x="51" y="40" width="10" height="5" rx="2.5" fill={zenDarkTheme.accent} />
                <Rect x="51" y="49" width="10" height="5" rx="2.5" fill={zenDarkTheme.accent} />
                <Rect x="51" y="58" width="10" height="5" rx="2.5" fill={zenDarkTheme.accent} />
                <Rect x="51" y="67" width="10" height="5" rx="2.5" fill={zenDarkTheme.accent} />
                <Path
                  d="M56 76 L82 76 L82 108"
                  stroke={zenDarkTheme.accent}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <Path
                  d="M56 76 L46 108 L78 108"
                  stroke={zenDarkTheme.accent}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <Line
                  x1="30"
                  y1="116"
                  x2="88"
                  y2="116"
                  stroke={zenDarkTheme.borderMuted}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </Svg>
            </View>

            <Text
              style={{
                color: zenDarkTheme.textPrimary,
                fontSize: 30,
                fontWeight: "700",
                letterSpacing: 0.9,
              }}
            >
              {copy.splash.brand}
            </Text>
          </Animated.View>
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 52,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Animated.View
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: zenDarkTheme.borderMuted,
                borderTopColor: zenDarkTheme.accent,
                borderRightColor: zenDarkTheme.accent,
                marginRight: 10,
                transform: [
                  {
                    rotate: spinnerRotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              }}
            />
            <Text
              style={{
                color: zenDarkTheme.textSecondary,
                fontSize: 12,
                fontWeight: "500",
                letterSpacing: 0.6,
              }}
            >
              {copy.splash.calibrating}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
