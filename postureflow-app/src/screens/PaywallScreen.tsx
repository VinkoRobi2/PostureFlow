import { Building2, Check, ShieldCheck, X, Zap } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BentoCard } from "../components/BentoCard";
import { ScreenAtmosphere } from "../components/ScreenAtmosphere";
import { useAppModel } from "../providers/app-provider";
import { zenAmbientGlow, zenDarkTheme, zenGlassEffect } from "../theme/zen-dark";
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
    <SafeAreaView style={{ flex: 1, backgroundColor: zenDarkTheme.canvas }}>
      <ScreenAtmosphere />

      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 28,
          paddingBottom: 28,
        }}
      >
        <View
          style={{
            marginBottom: 22,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View
              style={[
                {
                  marginRight: 12,
                  height: 46,
                  width: 46,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 18,
                  backgroundColor: zenDarkTheme.accentSoft,
                  borderWidth: 1,
                  borderColor: zenDarkTheme.borderMuted,
                },
                zenAmbientGlow(0.1, 18),
              ]}
            >
              <Building2
                color={zenDarkTheme.accentStrong}
                size={20}
                strokeWidth={1.7}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: zenDarkTheme.textTertiary,
                  fontSize: 11,
                  fontWeight: "700",
                  letterSpacing: 1.3,
                  textTransform: "uppercase",
                }}
              >
                Ocean Flow
              </Text>
              <Text
                style={{
                  marginTop: 3,
                  color: zenDarkTheme.textPrimary,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                {getLocalizedText(paywall.brand, locale)}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              height: 44,
              width: 44,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 18,
              borderWidth: 1,
              borderColor: zenDarkTheme.border,
              backgroundColor: zenDarkTheme.surfaceGlass,
              ...zenGlassEffect,
            }}
          >
            <X color={zenDarkTheme.textPrimary} size={18} strokeWidth={1.7} />
          </Pressable>
        </View>

        <View
          style={{
            marginBottom: 20,
            borderRadius: 36,
            borderWidth: 1,
            borderColor: zenDarkTheme.border,
            backgroundColor: zenDarkTheme.surface,
            padding: 22,
            ...zenAmbientGlow(0.08, 22),
          }}
        >
          <Text
            style={{
              fontSize: 38,
              fontWeight: "900",
              lineHeight: 44,
              letterSpacing: -1.1,
              color: zenDarkTheme.textPrimary,
            }}
          >
            {getLocalizedText(paywall.headline, locale)}
          </Text>
          <Text
            style={{
              marginTop: 12,
              color: zenDarkTheme.textSecondary,
              fontSize: 15,
              fontWeight: "600",
              lineHeight: 23,
            }}
          >
            {locale === "es"
              ? "PostureFlow para equipos que pasan muchas horas frente a pantalla."
              : "PostureFlow for teams spending long hours in front of screens."}
          </Text>
        </View>

        <View style={{ gap: 10, marginBottom: 18 }}>
          {paywall.features.map((feature) => {
            const Icon =
              featureIcons[feature.icon as keyof typeof featureIcons] ?? Check;
            return (
              <View
                key={feature.icon}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 24,
                  backgroundColor: zenDarkTheme.surface,
                  borderWidth: 1,
                  borderColor: zenDarkTheme.border,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  ...zenAmbientGlow(0.035, 14),
                }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: zenDarkTheme.violetSoft,
                    marginRight: 12,
                  }}
                >
                  <Icon
                    color={zenDarkTheme.violetStrong}
                    size={17}
                    strokeWidth={1.7}
                  />
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    fontWeight: "700",
                    lineHeight: 21,
                    color: zenDarkTheme.textSecondary,
                  }}
                >
                  {getLocalizedText(feature.text, locale)}
                </Text>
              </View>
            );
          })}
        </View>

        <BentoCard
          style={{
            marginTop: "auto",
            padding: 24,
            backgroundColor: zenDarkTheme.porcelain,
            borderColor: zenDarkTheme.borderMuted,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              letterSpacing: 1.2,
              textTransform: "uppercase",
              color: zenDarkTheme.textTertiary,
            }}
          >
            {getLocalizedText(paywall.pricing.planName, locale)}
          </Text>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <Text
              style={{
                fontSize: 66,
                fontWeight: "900",
                letterSpacing: -2,
                color: zenDarkTheme.textPrimary,
              }}
            >
              ${paywall.pricing.pricePerSeat}
            </Text>
            <Text
              style={{
                marginBottom: 11,
                marginLeft: 8,
                fontSize: 14,
                fontWeight: "600",
                color: zenDarkTheme.textTertiary,
              }}
            >
              {getLocalizedText(paywall.pricing.unit, locale)}
            </Text>
          </View>

          <Pressable
            style={[
              {
                marginTop: 28,
                borderRadius: 26,
                backgroundColor: zenDarkTheme.buttonPrimary,
                paddingHorizontal: 24,
                paddingVertical: 18,
                ...zenGlassEffect,
              },
              zenAmbientGlow(0.12, 22, zenDarkTheme.accent),
            ]}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "900",
                color: zenDarkTheme.textInverse,
              }}
            >
              {getLocalizedText(paywall.pricing.cta, locale)}
            </Text>
          </Pressable>
        </BentoCard>

        <Pressable style={{ marginTop: 18, paddingBottom: 8 }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 14,
              fontWeight: "600",
              color: zenDarkTheme.textTertiary,
            }}
          >
            {getLocalizedText(paywall.pricing.secondaryCta, locale)}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
