import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-8 h-32 w-32 items-center justify-center rounded-full border border-teal-100 bg-teal-50">
          <ActivityIndicator color="#0f766e" size="large" />
        </View>

        <View className="h-14 items-center justify-center">
          <Text className="text-center text-lg font-light text-slate-600">
            {steps[stepIndex]}
          </Text>
        </View>

        <View className="mt-8 h-2 w-56 overflow-hidden rounded-full bg-slate-100">
          <View
            className="h-full rounded-full bg-teal-500"
            style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
