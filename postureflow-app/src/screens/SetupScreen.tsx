import {
  Armchair,
  CheckCircle2,
  Monitor,
  MonitorSmartphone,
} from "lucide-react-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BentoCard } from "../components/BentoCard";
import { LanguageToggle } from "../components/LanguageToggle";
import { PrimaryButton } from "../components/PrimaryButton";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import type { AppScreenProps } from "../types/app";
import { getLocalizedText } from "../utils/localize";

type Props = AppScreenProps<"Setup">;

const iconMap = {
  Monitor,
  MonitorSmartphone,
  Armchair,
};

export function SetupScreen({ navigation }: Props) {
  const { bootstrap, locale, setupSelection, setSetupSelection, toggleLocale } =
    useAppModel();
  const copy = messages[locale];

  if (!bootstrap) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <Text className="text-base font-medium text-slate-500">
          {copy.common.loading}
        </Text>
      </SafeAreaView>
    );
  }

  const toggleOption = (id: string) => {
    setSetupSelection(
      setupSelection.includes(id)
        ? setupSelection.filter((value) => value !== id)
        : [...setupSelection, id],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <View className="flex-1 px-6 py-6" style={{ maxWidth: 460, alignSelf: "center" }}>
        <View className="mb-8 flex-row items-start justify-between">
          <View className="mr-4 flex-1">
            <View className="mb-4 self-start rounded-full bg-teal-50 px-3 py-1">
              <Text className="text-xs font-semibold uppercase tracking-[1px] text-teal-700">
                {copy.setup.step}
              </Text>
            </View>
            <Text className="text-3xl font-light leading-10 text-slate-800">
              {copy.setup.title}
            </Text>
            <Text className="mt-3 text-base font-medium text-slate-500">
              {copy.setup.subtitle}
            </Text>
          </View>
          <LanguageToggle locale={locale} onToggle={() => void toggleLocale()} />
        </View>

        <View className="flex-1 justify-center">
          <View className="gap-4">
            {bootstrap.onboarding.setupOptions.map((option) => {
              const isSelected = setupSelection.includes(option.id);
              const Icon =
                iconMap[option.icon as keyof typeof iconMap] ?? MonitorSmartphone;

              return (
                <BentoCard
                  key={option.id}
                  onPress={() => toggleOption(option.id)}
                  className={`p-6 ${isSelected ? "border-teal-500 bg-teal-50/40" : ""}`}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`rounded-3xl p-4 ${
                        isSelected
                          ? "bg-teal-100"
                          : "bg-slate-100"
                      }`}
                    >
                      <Icon
                        color={isSelected ? "#0f766e" : "#94a3b8"}
                        size={26}
                        strokeWidth={1.8}
                      />
                    </View>

                    <View className="ml-4 flex-1">
                      <Text
                        className={`text-lg font-semibold ${
                          isSelected ? "text-teal-900" : "text-slate-800"
                        }`}
                      >
                        {getLocalizedText(option.title, locale)}
                      </Text>
                      <Text className="mt-1 text-sm font-medium text-slate-500">
                        {getLocalizedText(option.description, locale)}
                      </Text>
                    </View>

                    <View className="ml-3">
                      {isSelected ? (
                        <CheckCircle2 color="#14b8a6" size={24} />
                      ) : (
                        <View className="h-6 w-6 rounded-full border-2 border-slate-200" />
                      )}
                    </View>
                  </View>
                </BentoCard>
              );
            })}
          </View>
        </View>

        {setupSelection.length > 0 ? (
          <View className="pb-4 pt-3">
            <PrimaryButton
              label={copy.common.generateProgram}
              onPress={() => navigation.navigate("Analyzing")}
              variant="dark"
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
