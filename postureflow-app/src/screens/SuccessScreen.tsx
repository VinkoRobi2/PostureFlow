import { Check, ArrowRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenAtmosphere } from "../components/ScreenAtmosphere";
import { useAppModel } from "../providers/app-provider";
import { zenDarkTheme, zenGlassEffect } from "../theme/zen-dark";
import type { AppScreenProps } from "../types/app";
import { getLocalizedText } from "../utils/localize";

type Props = AppScreenProps<"Success">;

export function SuccessScreen({ navigation }: Props) {
  const { successSummary, locale } = useAppModel();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: zenDarkTheme.canvas }}>
      <ScreenAtmosphere />
      <View className="flex-1 items-center justify-center px-6">
        <View
          style={{
            marginBottom: 40,
            height: 96,
            width: 96,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            backgroundColor: zenDarkTheme.accentSoft,
            borderWidth: 1,
            borderColor: zenDarkTheme.borderMuted,
            ...zenGlassEffect,
          }}
        >
          <Check color={zenDarkTheme.textPrimary} size={44} strokeWidth={3} />
        </View>

        <View className="w-full max-w-sm items-center">
          <Text
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "300",
              letterSpacing: -0.5,
              color: zenDarkTheme.textPrimary,
            }}
          >
            {successSummary?.title ?? (locale === "es" ? "Flujo Completado" : "Flow Completed")}
          </Text>

          <View className="mt-8 w-full gap-3">
            {(successSummary?.benefits ?? []).map((benefit, index) => (
              <View
                key={`${benefit.en}-${index}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 22,
                  borderWidth: 1,
                  borderColor: zenDarkTheme.border,
                  backgroundColor: zenDarkTheme.surfaceGlass,
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                }}
              >
                <View
                  style={{
                    marginRight: 12,
                    height: 8,
                    width: 8,
                    borderRadius: 999,
                    backgroundColor: zenDarkTheme.accent,
                  }}
                />
                <Text style={{ flex: 1, fontSize: 14, fontWeight: "400", color: zenDarkTheme.textSecondary }}>
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
            bottom: 48,
            left: 24,
            right: 24,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 32,
            backgroundColor: zenDarkTheme.accentSoft,
            borderWidth: 1,
            borderColor: zenDarkTheme.borderMuted,
            paddingHorizontal: 32,
            paddingVertical: 16,
            ...zenGlassEffect,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500", color: zenDarkTheme.textPrimary }}>
            {getLocalizedText(
              successSummary?.cta ?? {
                en: "Back to Dashboard",
                es: "Volver al Dashboard",
              },
              locale,
            )}
          </Text>
          <ArrowRight color={zenDarkTheme.textPrimary} size={20} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
