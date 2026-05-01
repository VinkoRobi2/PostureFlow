import { Check, ArrowRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenAtmosphere } from "../components/ScreenAtmosphere";
import { useAppModel } from "../providers/app-provider";
import { zenAmbientGlow, zenDarkTheme, zenGlassEffect } from "../theme/zen-dark";
import type { AppScreenProps } from "../types/app";
import { getLocalizedText } from "../utils/localize";

type Props = AppScreenProps<"Success">;

export function SuccessScreen({ navigation }: Props) {
  const { successSummary, locale } = useAppModel();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: zenDarkTheme.canvas }}>
      <ScreenAtmosphere />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 52,
          paddingBottom: 34,
          maxWidth: 460,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <View
          style={{
            height: 112,
            width: 112,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 34,
            backgroundColor: zenDarkTheme.accentSoft,
            borderWidth: 1,
            borderColor: zenDarkTheme.borderMuted,
            ...zenAmbientGlow(0.12, 24, zenDarkTheme.accent),
            ...zenGlassEffect,
          }}
        >
          <Check color={zenDarkTheme.textPrimary} size={44} strokeWidth={3} />
        </View>

        <View style={{ width: "100%", marginTop: 34 }}>
          <Text
            style={{
              fontSize: 42,
              fontWeight: "800",
              lineHeight: 48,
              letterSpacing: -1,
              color: zenDarkTheme.textPrimary,
            }}
          >
            {successSummary?.title ?? (locale === "es" ? "Flujo Completado" : "Flow Completed")}
          </Text>

          <View style={{ marginTop: 28, width: "100%", gap: 12 }}>
            {(successSummary?.benefits ?? []).map((benefit, index) => (
              <View
                key={`${benefit.en}-${index}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 30,
                  borderWidth: 1,
                  borderColor: zenDarkTheme.border,
                  backgroundColor: zenDarkTheme.surfaceGlass,
                  paddingHorizontal: 20,
                  paddingVertical: 18,
                  ...zenAmbientGlow(0.04, 14),
                }}
              >
                <View
                  style={{
                    marginRight: 12,
                    height: 34,
                    width: 34,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: zenDarkTheme.accentSoft,
                  }}
                >
                  <Text style={{ color: zenDarkTheme.accentStrong, fontWeight: "800" }}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={{ flex: 1, fontSize: 15, fontWeight: "700", color: zenDarkTheme.textSecondary, lineHeight: 22 }}>
                  {getLocalizedText(benefit, locale)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          onPress={() => navigation.replace("Dashboard")}
          style={{
            position: "absolute",
            bottom: 34,
            left: 24,
            right: 24,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 28,
            backgroundColor: zenDarkTheme.buttonPrimary,
            borderWidth: 1,
            borderColor: zenDarkTheme.borderMuted,
            paddingHorizontal: 32,
            paddingVertical: 16,
            ...zenAmbientGlow(0.16, 24, zenDarkTheme.accent),
            ...zenGlassEffect,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500", color: zenDarkTheme.textInverse }}>
            {getLocalizedText(
              successSummary?.cta ?? {
                en: "Back to Dashboard",
                es: "Volver al Dashboard",
              },
              locale,
            )}
          </Text>
          <ArrowRight color={zenDarkTheme.textInverse} size={20} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
