import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
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
  const { height: screenH, width: screenW } = useWindowDimensions();
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

  const compactScreen = screenH < 740 || screenW < 380;
  const tinyScreen = screenH < 690 || screenW < 360;
  const orbSize = tinyScreen ? rs(168) : compactScreen ? rs(190) : rs(230);
  const auraInnerSize = tinyScreen ? rs(124) : compactScreen ? rs(142) : rs(170);
  const breathCoreSize = tinyScreen ? rs(80) : compactScreen ? rs(92) : rs(110);
  const readyCta =
    locale === "es" ? "Continuar cuando este listo" : "Continue when ready";
  const pendingCta =
    locale === "es" ? "Completa la respiracion" : "Finish the breath";

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
              detail: "Let the weight soften downward.",
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
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: screenPadH,
          paddingTop: compactScreen ? rs(32) : screenPadT,
          paddingBottom: rs(40),
        }}
      >
        <View className="flex-grow justify-between">
          <View className="flex-shrink-0">
            <Text
              className="text-[10px] font-black uppercase tracking-[2.5px] text-[#B77551]"
              style={{ fontFamily: ff }}
            >
              {locale === "es" ? "RESET DE RESPIRACION" : "BREATHING RESET"}
            </Text>
            <Text
              className="mt-3 font-black text-[#161412]"
              style={{
                fontFamily: ff,
                fontSize: compactScreen ? rs(32) : rs(38),
                lineHeight: compactScreen ? rs(36) : rs(42),
              }}
            >
              {copy.ahaGreeting(onboardingDraft.firstName)}
            </Text>
            <Text
              className="mt-3 text-sm font-semibold text-[#8C857B]"
              style={{ fontFamily: ff, lineHeight: rs(22) }}
            >
              {personalizedTitle}
            </Text>
          </View>

          <View
            className="items-center justify-center"
            style={{
              paddingVertical: compactScreen ? rs(26) : rs(48),
            }}
          >
            <View className="w-full items-center">
              <View
                style={{
                  width: orbSize,
                  height: orbSize,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Animated.View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    width: orbSize,
                    height: orbSize,
                    borderRadius: rs(999),
                    backgroundColor: "#E4DED6",
                    transform: [{ scale: auraScale }],
                  }}
                />
                <Animated.View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    width: auraInnerSize,
                    height: auraInnerSize,
                    borderRadius: rs(999),
                    backgroundColor: "#DDD5CA",
                    opacity: auraOpacity,
                  }}
                />

                <Animated.View
                  style={{
                    width: breathCoreSize,
                    height: breathCoreSize,
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
                className="items-center"
                style={{
                  marginTop: compactScreen ? rs(22) : rs(34),
                  opacity: textOpacity,
                  transform: [{ translateY: textTranslate }],
                }}
              >
                <Text
                  className="font-black text-[#161412]"
                  style={{
                    fontFamily: ff,
                    fontSize: compactScreen ? rs(30) : rs(36),
                  }}
                >
                  {currentPhase.label}
                </Text>
                <Text
                  className="mt-2 max-w-[290px] text-center text-sm font-semibold text-[#8C857B]"
                  style={{ fontFamily: ff, lineHeight: rs(21) }}
                >
                  {currentPhase.detail}
                </Text>
              </Animated.View>
            </View>
          </View>

          <View className="flex-shrink-0 pb-10">
            <View className="h-1 overflow-hidden rounded-full bg-[#D8D1C7]">
              <Animated.View
                style={{
                  height: "100%",
                  width: progressWidth,
                  borderRadius: rs(999),
                  backgroundColor: onboardingDarkTheme.accentStrong,
                }}
              />
            </View>

            <View className="mt-3 flex-row items-start gap-4">
              <Text
                className="flex-shrink-0 text-xs font-black text-[#8C857B]"
                style={{ fontFamily: ff }}
              >
                {elapsedSeconds} / 15s
              </Text>
              <Text
                className="min-w-0 flex-1 flex-shrink text-right text-xs font-semibold italic text-[#8C857B]"
                style={{ fontFamily: ff, lineHeight: rs(18) }}
              >
                {copy.ahaFooter}
              </Text>
            </View>

            <Pressable
              className="mt-7 h-14 w-11/12 self-center items-center justify-center rounded-full bg-black"
              disabled={!isDone}
              onPress={() => navigation.replace("OnboardingTrust")}
              style={({ pressed }) => ({
                opacity: isDone ? (pressed ? 0.86 : 1) : 0.38,
              })}
            >
              <Text
                className="text-base font-black text-white"
                style={{ fontFamily: ff }}
              >
                {isDone ? readyCta : pendingCta}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </OnboardingFrame>
  );
}
