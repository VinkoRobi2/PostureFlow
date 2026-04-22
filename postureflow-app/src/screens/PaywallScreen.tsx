import {
  Building2,
  Check,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BentoCard } from "../components/BentoCard";
import { useAppModel } from "../providers/app-provider";
import type { AppScreenProps } from "../types/app";
import { getLocalizedText } from "../utils/localize";

type Props = AppScreenProps<"Paywall">;

const featureIcons = {
  Check,
  ShieldCheck,
  Zap,
};

export function PaywallScreen({ navigation }: Props) {
  const { paywall, locale } = useAppModel();

  if (!paywall) {
    return null;
  }

  return (
    <LinearGradient colors={["#020617", "#0f172a", "#111827"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View className="absolute left-[-10%] top-[-5%] h-72 w-[130%] rounded-full bg-teal-500/20" />

        <View className="flex-1 px-6 py-6">
          <View className="mb-10 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-2xl bg-teal-500">
              <Building2 color="#020617" size={18} strokeWidth={2.4} />
            </View>
            <Text className="text-sm font-semibold uppercase tracking-[1px] text-teal-50">
              {getLocalizedText(paywall.brand, locale)}
            </Text>
          </View>

          <Pressable
            onPress={() => navigation.goBack()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
          >
            <X color="#ffffff" size={18} />
          </Pressable>
          </View>

          <View className="flex-1">
            <Text className="mb-8 text-4xl font-light leading-[46px] text-white">
              {getLocalizedText(paywall.headline, locale)}
            </Text>

            <View className="mb-10 gap-4">
              {paywall.features.map((feature) => {
                const Icon =
                  featureIcons[feature.icon as keyof typeof featureIcons] ?? Check;
                return (
                  <View key={feature.icon} className="flex-row items-center">
                    <Icon color="#2dd4bf" size={18} />
                    <Text className="ml-4 text-base font-medium text-slate-300">
                      {getLocalizedText(feature.text, locale)}
                    </Text>
                  </View>
                );
              })}
            </View>

            <BentoCard className="mt-auto overflow-hidden border-white/10 bg-slate-900 p-6">
              <View className="absolute right-4 top-4 opacity-10">
                <Building2 color="#ffffff" size={84} />
              </View>
              <Text className="text-lg font-medium text-slate-300">
                {getLocalizedText(paywall.pricing.planName, locale)}
              </Text>
              <View className="mt-3 flex-row items-end">
                <Text className="text-6xl font-semibold tracking-tight text-white">
                  ${paywall.pricing.pricePerSeat}
                </Text>
                <Text className="mb-2 ml-2 text-sm font-medium text-slate-400">
                  {getLocalizedText(paywall.pricing.unit, locale)}
                </Text>
              </View>

              <Pressable className="mt-8 rounded-[22px] bg-teal-500 px-6 py-4">
                <Text className="text-center text-base font-semibold text-slate-950">
                  {getLocalizedText(paywall.pricing.cta, locale)}
                </Text>
              </Pressable>
            </BentoCard>

            <Pressable className="mt-6 pb-6">
              <Text className="text-center text-sm font-medium text-slate-500">
                {getLocalizedText(paywall.pricing.secondaryCta, locale)}
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
