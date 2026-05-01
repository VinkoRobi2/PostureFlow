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
import { onboardingDarkTheme } from "../../theme/onboarding-pro-dark";
import type { AppScreenProps } from "../../types/app";
import { ff, rs, screenPadH, screenPadT } from "../../utils/responsive";
import { getLocalizedOnboardingText } from "./content";

type Props = AppScreenProps<"OnboardingAha">;

const SESSION_MS = 15000;
const BREATH_EASING = Easing.bezier(0.42, 0, 0.2, 1);

export function OnboardingAhaScreen({ navigation }: Props) {
  const { bootstrap, locale, onboardingDraft, painSelection } = useAppModel();
  const copy = getLocalizedOnboardingText(locale);
  const resolvedBootstrap = bootstrap ?? createFallbackBootstrap(locale);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDone, setDone] = useState(false);
  const breathScale = useRef(new Animated.Value(0.9)).current;
  const auraScale = useRef(new Animated.Value(0.94)).current;
  const auraOpacity = useRef(new Animated.Value(0.42)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(12)).current;
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      ? `Vamos a soltar la tension en ${primaryZoneLabel ?? "trapecio"} con una sola respiracion guiada.`
      : `We are about to soften the tension in your ${primaryZoneLabel ?? "trapezius"} with one guided breath.`;

  const breathingPhases = useMemo(
    () =>
      locale === "es"
        ? [
            {
              label: "Inhala",
              detail: "Deja que el pecho suba con suavidad.",
              duration: 4000,
              scale: 1.12,
              auraScale: 1.14,
              auraOpacity: 0.72,
            },
            {
              label: "Exhala",
              detail: "Afloja la mandibula y suelta el cuello.",
              duration: 3500,
              scale: 0.9,
              auraScale: 0.96,
              auraOpacity: 0.38,
            },
            {
              label: "Inhala",
              detail: "Abre hombros y espalda sin forzar.",
              duration: 4000,
              scale: 1.14,
              auraScale: 1.18,
              auraOpacity: 0.82,
            },
            {
              label: "Exhala",
              detail: "Deja caer el peso hacia abajo.",
              duration: 3500,
              scale: 0.88,
              auraScale: 0.94,
              auraOpacity: 0.32,
            },
          ]
        : [
            {
              label: "Inhale",
              detail: "Let the chest rise with ease.",
              duration: 4000,
              scale: 1.12,
              auraScale: 1.14,
              auraOpacity: 0.72,
            },
            {
              label: "Exhale",
              detail: "Release your jaw and soften the neck.",
              duration: 3500,
              scale: 0.9,
              auraScale: 0.96,
              auraOpacity: 0.38,
            },
            {
              label: "Inhale",
              detail: "Give your shoulders and back more room.",
              duration: 4000,
              scale: 1.14,
              auraScale: 1.18,
              auraOpacity: 0.82,
            },
            {
              label: "Exhale",
              detail: "Let the weight melt downward.",
              duration: 3500,
              scale: 0.88,
              auraScale: 0.94,
              auraOpacity: 0.32,
            },
          ],
    [locale],
  );

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    const clearTimers = () => {
      timeoutsRef.current.forEach((timer) => clearTimeout(timer));
      timeoutsRef.current = [];
    };

    const animateText = (duration: number) => {
      textOpacity.setValue(0);
      textTranslate.setValue(12);

      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(textTranslate, {
          toValue: 0,
          duration: 320,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();

      const fadeDelay = Math.max(duration - 520, 300);
      const fadeTimer = setTimeout(() => {
        Animated.timing(textOpacity, {
          toValue: 0.46,
          duration: 320,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      }, fadeDelay);

      timeoutsRef.current.push(fadeTimer);
    };

    const playPhase = (index: number) => {
      if (cancelled) {
        return;
      }

      if (index >= breathingPhases.length) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setProgress(1);
        setDone(true);
        Vibration.vibrate(24);
        return;
      }

      const phase = breathingPhases[index];
      setPhaseIndex(index);
      animateText(phase.duration);

      Animated.parallel([
        Animated.timing(breathScale, {
          toValue: phase.scale,
          duration: phase.duration,
          easing: BREATH_EASING,
          useNativeDriver: true,
        }),
        Animated.timing(auraScale, {
          toValue: phase.auraScale,
          duration: phase.duration,
          easing: BREATH_EASING,
          useNativeDriver: true,
        }),
        Animated.timing(auraOpacity, {
          toValue: phase.auraOpacity,
          duration: phase.duration,
          easing: BREATH_EASING,
          useNativeDriver: true,
        }),
      ]).start(() => {
        playPhase(index + 1);
      });
    };

    intervalRef.current = setInterval(() => {
      const ratio = Math.min((Date.now() - startedAt) / SESSION_MS, 1);
      setProgress(ratio);

      if (ratio >= 1 && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 100);

    playPhase(0);

    return () => {
      cancelled = true;
      clearTimers();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      breathScale.stopAnimation();
      auraScale.stopAnimation();
      auraOpacity.stopAnimation();
      textOpacity.stopAnimation();
      textTranslate.stopAnimation();
    };
  }, [
    auraOpacity,
    auraScale,
    breathScale,
    breathingPhases,
    textOpacity,
    textTranslate,
  ]);

  const currentPhase = breathingPhases[phaseIndex] ?? breathingPhases[0];
  const elapsedSeconds = Math.min(Math.round(progress * 15), 15);
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 90,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  return (
    <OnboardingFrame
      contentStyle={{
        flex: 1,
        paddingHorizontal: screenPadH,
        paddingTop: screenPadT,
        paddingBottom: rs(26),
      }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ marginBottom: rs(28) }}>
          <Text
            style={{
              color: onboardingDarkTheme.accentStrong,
              fontFamily: ff,
              fontSize: rs(10),
              fontWeight: "800",
              letterSpacing: 2.5,
              textTransform: "uppercase",
            }}
          >
            {locale === "es" ? "RESET DE RESPIRACION" : "BREATHING RESET"}
          </Text>
          <Text
            style={{
              color: onboardingDarkTheme.textPrimary,
              fontFamily: ff,
              marginTop: rs(12),
              fontSize: rs(36),
              fontWeight: "800",
              lineHeight: rs(38),
              letterSpacing: -1.2,
            }}
          >
            {copy.ahaGreeting(onboardingDraft.firstName)}
          </Text>
          <Text
            style={{
              color: onboardingDarkTheme.textTertiary,
              fontFamily: ff,
              marginTop: rs(10),
              maxWidth: rs(330),
              fontSize: rs(13),
              fontWeight: "500",
              lineHeight: rs(20),
            }}
          >
            {personalizedTitle}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: rs(8),
          }}
        >
          <View style={{ width: "100%", alignItems: "center" }}>
            <View
              style={{
                width: rs(230),
                height: rs(230),
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Animated.View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  width: rs(230),
                  height: rs(230),
                  borderRadius: rs(999),
                  backgroundColor: "#E0DBD3",
                  transform: [{ scale: auraScale }],
                }}
              />
              <Animated.View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  width: rs(170),
                  height: rs(170),
                  borderRadius: rs(999),
                  backgroundColor: "#D8D2C8",
                  opacity: auraOpacity,
                }}
              />

              <Animated.View
                style={{
                  width: rs(110),
                  height: rs(110),
                  borderRadius: rs(999),
                  backgroundColor: onboardingDarkTheme.accentStrong,
                  shadowColor: onboardingDarkTheme.accentStrong,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.25,
                  shadowRadius: rs(40),
                  elevation: 8,
                  transform: [{ scale: breathScale }],
                }}
              />
            </View>

            <Animated.View
              style={{
                marginTop: rs(32),
                alignItems: "center",
                opacity: textOpacity,
                transform: [{ translateY: textTranslate }],
              }}
            >
              <Text
                style={{
                  color: onboardingDarkTheme.textPrimary,
                  fontFamily: ff,
                  fontSize: rs(34),
                  fontWeight: "800",
                  letterSpacing: -1,
                }}
              >
                {currentPhase.label}
              </Text>
              <Text
                style={{
                  marginTop: rs(8),
                  color: onboardingDarkTheme.textTertiary,
                  fontFamily: ff,
                  fontSize: rs(13),
                  fontWeight: "500",
                  lineHeight: rs(20),
                  textAlign: "center",
                  maxWidth: rs(270),
                }}
              >
                {currentPhase.detail}
              </Text>
            </Animated.View>
          </View>
        </View>

        <View style={{ paddingBottom: 0 }}>
          <View
            style={{
              height: rs(3),
              borderRadius: rs(2),
              overflow: "hidden",
              backgroundColor: onboardingDarkTheme.border,
            }}
          >
            <Animated.View
              style={{
                height: "100%",
                width: progressWidth,
                borderRadius: rs(2),
                backgroundColor: onboardingDarkTheme.accentStrong,
              }}
            />
          </View>

          <View
            style={{
              marginTop: rs(10),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: rs(14),
            }}
          >
            <Text
              style={{
                color: onboardingDarkTheme.textTertiary,
                fontFamily: ff,
                fontSize: rs(11),
                fontWeight: "700",
                letterSpacing: 0.5,
              }}
            >
              {elapsedSeconds} / 15s
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: onboardingDarkTheme.textTertiary,
                flex: 1,
                fontFamily: ff,
                fontSize: rs(11),
                fontStyle: "italic",
                fontWeight: "400",
                textAlign: "right",
              }}
            >
              {copy.ahaFooter}
            </Text>
          </View>

          <Pressable
            disabled={!isDone}
            onPress={() => navigation.replace("OnboardingTrust")}
            style={({ pressed }) => ({
              marginTop: rs(36),
              backgroundColor: onboardingDarkTheme.textPrimary,
              borderRadius: rs(18),
              opacity: isDone ? (pressed ? 0.9 : 1) : 0.4,
              paddingVertical: rs(18),
            })}
          >
            <Text
              style={{
                textAlign: "center",
                color: onboardingDarkTheme.background,
                fontFamily: ff,
                fontSize: rs(16),
                fontWeight: "700",
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
