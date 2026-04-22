import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BiomechanicalScanner } from "../components/BiomechanicalScanner";
import { LanguageToggle } from "../components/LanguageToggle";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import type { AppScreenProps } from "../types/app";

type Props = AppScreenProps<"PainMap">;

export function PainMapScreen({ navigation }: Props) {
  const {
    bootstrap,
    locale,
    painSelection,
    setPainSelection,
    toggleLocale,
  } = useAppModel();
  const copy = messages[locale];

  if (!bootstrap) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
        }}
      >
        <Text className="text-base font-medium text-zinc-400">
          {copy.common.loading}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <View
        className="flex-1 px-6 pb-6 pt-5"
        style={{ maxWidth: 460, alignSelf: "center", width: "100%" }}
      >
        <View className="mb-2 flex-row justify-end">
          <LanguageToggle locale={locale} onToggle={() => void toggleLocale()} />
        </View>

        <BiomechanicalScanner
          initialSelectedParts={painSelection}
          locale={locale}
          painRegions={bootstrap.onboarding.painRegions}
          onConfirm={(selectedParts) => {
            setPainSelection(selectedParts);
            navigation.navigate("Setup");
          }}
        />
      </View>
    </SafeAreaView>
  );
}
