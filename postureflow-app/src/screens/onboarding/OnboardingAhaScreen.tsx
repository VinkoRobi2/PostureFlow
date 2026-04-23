import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  Text,
  Vibration,
  View,
} from "react-native";
import { OnboardingFrame } from "../../components/onboarding/OnboardingFrame";
import { createFallbackBootstrap } from "../../data/fallback-data";
import { useAppModel } from "../../providers/app-provider";
import {
  onboardingCardStyle,
  onboardingDarkTheme,
  onboardingEyebrow,
  onboardingGlow,
} from "../../theme/onboarding-pro-dark";
import type { AppScreenProps } from "../../types/app";
import { getLocalizedOnboardingText } from "./content";

type Props = AppScreenProps<"OnboardingAha">;

const SESSION_MS = 15000;

export function OnboardingAhaScreen({ navigation }: Props) {
  const { bootstrap, locale, onboardingDraft, painSelection } = useAppModel();
  const copy = getLocalizedOnboardingText(locale);
  const resolvedBootstrap = bootstrap ?? createFallbackBootstrap(locale);
  const [progress, setProgress] = useState(0);
  const [isDone, setDone] = useState(false);
  const breathScale = useRef(new Animated.Value(0.92)).current;
  const primaryZoneLabel =
    painSelection.length > 0
      ? resolvedBootstrap.onboarding.painRegions.find(
          (region) => region.id === painSelection[0],
        )?.label[locale]
      : locale === "es"
        ? "trapecio"
        : "trapezius";
  const personalizedTitle =
    locale === "es"
      ? `Vamos a liberar esa tensión en ${primaryZoneLabel ?? "trapecio"}. Son solo 15 segundos. Acompáñame.`
      : `Let's release that tension in your ${primaryZoneLabel ?? "trapezius"}. It only takes 15 seconds. Stay with me.`;

  useEffect(() => {
    const breath = Animated.loop(
      Animated.sequence([
        Animated.timing(breathScale, {
          toValue: 1.14,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breathScale, {
          toValue: 0.92,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    const startAt = Date.now();
    breath.start();

    const interval = setInterval(() => {
      const ratio = Math.min((Date.now() - startAt) / SESSION_MS, 1);
      setProgress(ratio);

      if (ratio >= 1) {
        clearInterval(interval);
        breath.stop();
        setDone(true);
        Vibration.vibrate(24);
      }
    }, 120);

    return () => {
      clearInterval(interval);
      breath.stop();
    };
  }, [breathScale]);

  const stepIndex = useMemo(() => {
    if (progress < 0.34) {
      return 0;
    }

    if (progress < 0.67) {
      return 1;
    }

    return 2;
  }, [progress]);

  return (
    <OnboardingFrame>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={{ marginTop: 32 }}>
          <Text style={onboardingEyebrow}>The Aha Moment</Text>
          <Text
            style={{
              marginTop: 12,
              color: onboardingDarkTheme.textPrimary,
              fontSize: 28,
              fontWeight: "400",
              lineHeight: 36,
              letterSpacing: -0.8,
            }}
          >
            {copy.ahaGreeting(onboardingDraft.firstName)}
          </Text>
          <Text
            style={{
              marginTop: 12,
              color: onboardingDarkTheme.textSecondary,
              fontSize: 17,
              fontWeight: "400",
              lineHeight: 28,
            }}
          >
            {personalizedTitle}
          </Text>
        </View>

        <View
          style={[
            onboardingCardStyle,
            onboardingGlow(0.14, 34),
            {
              paddingHorizontal: 24,
              paddingVertical: 28,
              alignItems: "center",
              borderColor: onboardingDarkTheme.borderStrong,
            },
          ]}
        >
          <Animated.View
            style={{
              width: 188,
              height: 188,
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: onboardingDarkTheme.accentSoft,
              borderWidth: 1,
              borderColor: onboardingDarkTheme.borderStrong,
              transform: [{ scale: breathScale }],
            }}
          >
            <View
              style={{
                width: 132,
                height: 132,
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: onboardingDarkTheme.card,
                borderWidth: 1,
                borderColor: onboardingDarkTheme.border,
              }}
            >
              <Text
                style={{
                  color: onboardingDarkTheme.accent,
                  fontSize: 18,
                  fontWeight: "500",
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                }}
              >
                {copy.ahaSteps[stepIndex]}
              </Text>
            </View>
          </Animated.View>

          <Text
            style={{
              marginTop: 26,
              color: onboardingDarkTheme.textPrimary,
              fontSize: 24,
              fontWeight: "400",
              letterSpacing: -0.6,
            }}
          >
            {Math.round(progress * 15)} / 15s
          </Text>

          <View
            style={{
              marginTop: 18,
              height: 6,
              width: "100%",
              borderRadius: 999,
              overflow: "hidden",
              backgroundColor: onboardingDarkTheme.divider,
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${progress * 100}%`,
                borderRadius: 999,
                backgroundColor: onboardingDarkTheme.accent,
              }}
            />
          </View>
        </View>

        <View>
          <Text
            style={{
              marginBottom: 18,
              color: onboardingDarkTheme.textTertiary,
              fontSize: 14,
              fontWeight: "400",
              lineHeight: 22,
            }}
          >
            {copy.ahaFooter}
          </Text>

          <Pressable
            disabled={!isDone}
            onPress={() => navigation.replace("OnboardingTrust")}
            style={{
              borderRadius: 32,
              backgroundColor: isDone
                ? onboardingDarkTheme.accentSoft
                : onboardingDarkTheme.card,
              borderWidth: 1,
              borderColor: isDone
                ? onboardingDarkTheme.borderStrong
                : onboardingDarkTheme.border,
              paddingVertical: 18,
              opacity: isDone ? 1 : 0.5,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: onboardingDarkTheme.textPrimary,
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              {copy.ahaCta}
            </Text>
          </Pressable>
        </View>
      </View>
    </OnboardingFrame>
  );
}
