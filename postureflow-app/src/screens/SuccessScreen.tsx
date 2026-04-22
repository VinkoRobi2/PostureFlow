import { Check, ArrowRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppModel } from "../providers/app-provider";
import type { AppScreenProps } from "../types/app";
import { getLocalizedText } from "../utils/localize";

type Props = AppScreenProps<"Success">;

export function SuccessScreen({ navigation }: Props) {
  const { successSummary, locale } = useAppModel();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ecfdf5" }}>
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-10 h-24 w-24 items-center justify-center rounded-full bg-teal-500">
          <Check color="#ffffff" size={44} strokeWidth={3} />
        </View>

        <View className="w-full max-w-sm items-center">
          <Text className="text-center text-3xl font-light tracking-tight text-teal-900">
            {successSummary?.title ?? (locale === "es" ? "Flujo Completado" : "Flow Completed")}
          </Text>

          <View className="mt-8 w-full gap-3">
            {(successSummary?.benefits ?? []).map((benefit, index) => (
              <View
                key={`${benefit.en}-${index}`}
                className="flex-row items-center rounded-[22px] border border-white bg-white/70 px-5 py-4"
              >
                <View className="mr-3 h-2 w-2 rounded-full bg-teal-500" />
                <Text className="flex-1 text-sm font-medium text-teal-800">
                  {getLocalizedText(benefit, locale)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          onPress={() => navigation.replace("Dashboard")}
          className="absolute bottom-12 left-6 right-6 flex-row items-center justify-between rounded-[24px] bg-teal-900 px-8 py-4"
        >
          <Text className="text-base font-semibold text-white">
            {getLocalizedText(
              successSummary?.cta ?? {
                en: "Back to Dashboard",
                es: "Volver al Dashboard",
              },
              locale,
            )}
          </Text>
          <ArrowRight color="#ffffff" size={20} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
