import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { ScreenAtmosphere } from "../components/ScreenAtmosphere";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import { zenAmbientGlow, zenDarkTheme, zenGlassEffect } from "../theme/zen-dark";
import type { AppScreenProps } from "../types/app";

type Props = AppScreenProps<"Analyzing">;

export function AnalyzingScreen({ navigation }: Props) {
  const { locale, submitOnboarding } = useAppModel();
  const [stepIndex, setStepIndex] = useState(0);
  const steps = messages[locale].analyzing.steps;
  const hasStartedRef = useRef(false);
  const submitOnboardingRef = useRef(submitOnboarding);

  useEffect(() => {
    submitOnboardingRef.current = submitOnboarding;
  }, [submitOnboarding]);

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    let active = true;

    const run = async () => {
      try {
        const submitPromise = submitOnboardingRef.current();

        for (let index = 1; index < steps.length; index += 1) {
          await new Promise((resolve) => setTimeout(resolve, 900));
          if (!active) {
            return;
          }
          setStepIndex(index);
        }

        await submitPromise;
        await new Promise((resolve) => setTimeout(resolve, 600));

        if (active) {
          navigation.replace("Dashboard");
        }
      } catch {
        if (active) {
          navigation.replace("Dashboard");
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [navigation, steps]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: zenDarkTheme.canvas }}>
      <ScreenAtmosphere />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 26,
          maxWidth: 460,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <View
          style={{
            borderRadius: 40,
            backgroundColor: zenDarkTheme.surface,
            borderWidth: 1,
            borderColor: zenDarkTheme.border,
            padding: 28,
            ...zenAmbientGlow(0.11, 28),
            ...zenGlassEffect,
          }}
        >
          <View
            style={{
              marginBottom: 24,
              height: 96,
              width: 96,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 32,
              borderWidth: 1,
              borderColor: zenDarkTheme.borderMuted,
              backgroundColor: zenDarkTheme.accentSoft,
            }}
          >
            <ActivityIndicator color={zenDarkTheme.accentStrong} size="large" />
          </View>

          <Text
            style={{
              fontSize: 32,
              fontWeight: "900",
              lineHeight: 38,
              letterSpacing: -0.8,
              color: zenDarkTheme.textPrimary,
            }}
          >
            {steps[stepIndex]}
          </Text>

          <Text
            style={{
              marginTop: 12,
              color: zenDarkTheme.textSecondary,
              fontSize: 14,
              fontWeight: "600",
              lineHeight: 22,
            }}
          >
            {locale === "es"
              ? "Estamos armando tu primer flujo segun tension, energia y tiempo sentado."
              : "We are building your first flow from tension, energy, and screen time."}
          </Text>

          <View
            style={{
              marginTop: 26,
              height: 11,
              overflow: "hidden",
              borderRadius: 999,
              backgroundColor: zenDarkTheme.surfaceMuted,
            }}
          >
            <View
              style={{
                height: "100%",
                borderRadius: 999,
                backgroundColor: zenDarkTheme.accent,
                width: `${((stepIndex + 1) / steps.length) * 100}%`,
              }}
            />
          </View>

          <View style={{ marginTop: 22 }}>
            {steps.map((step, index) => (
              <Text
                key={step}
                style={{
                  marginTop: index === 0 ? 0 : 8,
                  color:
                    index <= stepIndex
                      ? zenDarkTheme.textPrimary
                      : zenDarkTheme.textTertiary,
                  fontSize: 13,
                  fontWeight: index === stepIndex ? "900" : "600",
                }}
              >
                {index + 1}. {step}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
