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
import { zenAmbientGlow, zenDarkTheme } from "../theme/zen-dark";
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
    <LinearGradient
      colors={[zenDarkTheme.canvas, zenDarkTheme.surface, zenDarkTheme.surfaceMuted]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            position: "absolute",
            left: "-10%",
            top: "-5%",
            height: 288,
            width: "130%",
            borderRadius: 999,
            backgroundColor: zenDarkTheme.accentGlow,
          }}
        />

        <View className="flex-1 px-6 py-6">
          <View className="mb-10 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              style={[
                {
                  marginRight: 12,
                  height: 36,
                  width: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 16,
                  backgroundColor: zenDarkTheme.accent,
                  borderWidth: 1,
                  borderColor: "rgba(52,211,153,0.22)",
                },
                zenAmbientGlow(0.16, 22),
              ]}
            >
              <Building2 color={zenDarkTheme.textInverse} size={18} strokeWidth={2.4} />
            </View>
            <Text style={{ fontSize: 14, fontWeight: "600", letterSpacing: 1, color: zenDarkTheme.textPrimary }}>
              {getLocalizedText(paywall.brand, locale)}
            </Text>
          </View>

          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              height: 40,
              width: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              borderWidth: 1,
              borderColor: zenDarkTheme.border,
              backgroundColor: zenDarkTheme.surfaceGlass,
            }}
          >
            <X color={zenDarkTheme.textPrimary} size={18} />
          </Pressable>
          </View>

          <View className="flex-1">
            <Text style={{ marginBottom: 32, fontSize: 36, fontWeight: "300", lineHeight: 46, color: zenDarkTheme.textPrimary }}>
              {getLocalizedText(paywall.headline, locale)}
            </Text>

            <View className="mb-10 gap-4">
              {paywall.features.map((feature) => {
                const Icon =
                  featureIcons[feature.icon as keyof typeof featureIcons] ?? Check;
                return (
                  <View key={feature.icon} className="flex-row items-center">
                    <Icon color={zenDarkTheme.accentStrong} size={18} />
                    <Text style={{ marginLeft: 16, fontSize: 16, fontWeight: "500", color: zenDarkTheme.textSecondary }}>
                      {getLocalizedText(feature.text, locale)}
                    </Text>
                  </View>
                );
              })}
            </View>

            <BentoCard
              className="mt-auto overflow-hidden p-6"
              style={{ backgroundColor: zenDarkTheme.surfaceOverlay }}
            >
              <View className="absolute right-4 top-4 opacity-10">
                <Building2 color={zenDarkTheme.textPrimary} size={84} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: "500", color: zenDarkTheme.textSecondary }}>
                {getLocalizedText(paywall.pricing.planName, locale)}
              </Text>
              <View className="mt-3 flex-row items-end">
                <Text style={{ fontSize: 60, fontWeight: "600", letterSpacing: -1.4, color: zenDarkTheme.textPrimary }}>
                  ${paywall.pricing.pricePerSeat}
                </Text>
                <Text style={{ marginBottom: 8, marginLeft: 8, fontSize: 14, fontWeight: "500", color: zenDarkTheme.textTertiary }}>
                  {getLocalizedText(paywall.pricing.unit, locale)}
                </Text>
              </View>

              <Pressable
                style={[
                  {
                    marginTop: 32,
                    borderRadius: 22,
                    backgroundColor: zenDarkTheme.accent,
                    paddingHorizontal: 24,
                    paddingVertical: 16,
                    borderWidth: 1,
                    borderColor: "rgba(52,211,153,0.26)",
                  },
                  zenAmbientGlow(0.18, 26),
                ]}
              >
                <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "600", color: zenDarkTheme.textInverse }}>
                  {getLocalizedText(paywall.pricing.cta, locale)}
                </Text>
              </Pressable>
            </BentoCard>

            <Pressable className="mt-6 pb-6">
              <Text style={{ textAlign: "center", fontSize: 14, fontWeight: "500", color: zenDarkTheme.textTertiary }}>
                {getLocalizedText(paywall.pricing.secondaryCta, locale)}
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
