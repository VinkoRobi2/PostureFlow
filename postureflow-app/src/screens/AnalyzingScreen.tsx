import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import { zenDarkTheme } from "../theme/zen-dark";
import type { AppScreenProps } from "../types/app";

type Props = AppScreenProps<"Analyzing">;

export function AnalyzingScreen({ navigation }: Props) {
  const { locale, submitOnboarding } = useAppModel();
  const [stepIndex, setStepIndex] = useState(0);
  const steps = messages[locale].analyzing.steps;

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const submitPromise = submitOnboarding();

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
  }, [navigation, steps.length, submitOnboarding]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: zenDarkTheme.canvas }}>
      <View className="flex-1 items-center justify-center px-8">
        <View
          style={{
            marginBottom: 32,
            height: 128,
            width: 128,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            borderWidth: 1,
            borderColor: zenDarkTheme.border,
            backgroundColor: zenDarkTheme.surfaceGlass,
          }}
        >
          <ActivityIndicator color={zenDarkTheme.accent} size="large" />
        </View>

        <View className="h-14 items-center justify-center">
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: "300",
              color: zenDarkTheme.textSecondary,
            }}
          >
            {steps[stepIndex]}
          </Text>
        </View>

        <View
          style={{
            marginTop: 32,
            height: 8,
            width: 224,
            overflow: "hidden",
            borderRadius: 999,
            backgroundColor: zenDarkTheme.surface,
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
      </View>
    </SafeAreaView>
  );
}
