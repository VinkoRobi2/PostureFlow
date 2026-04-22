import {
  Check,
  ChevronRight,
  Clock3,
  Cloud,
  Flame,
  Play,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import Svg, { Circle, Line, Path } from "react-native-svg";
import { BentoCard } from "../components/BentoCard";
import { LanguageToggle } from "../components/LanguageToggle";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import type { AppScreenProps } from "../types/app";
import { getLocalizedText } from "../utils/localize";

type Props = AppScreenProps<"Dashboard">;

const highlightMap = {
  neck: { cx: 50, cy: 38, r: 12 },
  shoulders: { cx: 50, cy: 50, r: 18 },
  chest: { cx: 50, cy: 58, r: 16 },
  arms: { cx: 28, cy: 66, r: 10 },
  forearms: { cx: 24, cy: 84, r: 10 },
  hands: { cx: 23, cy: 102, r: 8 },
  core: { cx: 50, cy: 76, r: 16 },
  upper_back: { cx: 50, cy: 68, r: 16 },
  lower_back: { cx: 50, cy: 90, r: 16 },
  hips: { cx: 50, cy: 105, r: 18 },
  legs: { cx: 50, cy: 112, r: 20 },
  knees: { cx: 50, cy: 118, r: 10 },
  calves: { cx: 50, cy: 120, r: 12 },
  feet: { cx: 50, cy: 122, r: 8 },
};

export function DashboardScreen({ navigation }: Props) {
  const {
    dashboard,
    locale,
    logout,
    refreshRemoteState,
    toggleLocale,
  } = useAppModel();
  const copy = messages[locale];

  useEffect(() => {
    void refreshRemoteState();
  }, [refreshRemoteState]);

  if (!dashboard) {
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

  const highlight =
    highlightMap[
      dashboard.muscleState.highlightedPainRegionId as keyof typeof highlightMap
    ] ?? highlightMap.neck;
  const featured = dashboard.featuredRoutine;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 42,
          maxWidth: 460,
          alignSelf: "center",
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-3xl font-semibold tracking-tight text-slate-800">
              {`${locale === "es" ? "Buen dia" : "Good day"}, ${dashboard.header.greetingName}`}
            </Text>
            <Text className="mt-2 text-sm font-medium text-slate-500">
              {getLocalizedText(dashboard.header.tagline, locale)}
            </Text>
          </View>

          <View className="items-end gap-3">
            <LanguageToggle locale={locale} onToggle={() => void toggleLocale()} />
            <Pressable
              onPress={() => {
                void logout().then(() =>
                  navigation.replace("Auth", { mode: "login" }),
                );
              }}
            >
              <Text className="text-xs font-semibold uppercase tracking-[1px] text-slate-400">
                {copy.common.signOut}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Library")}
              className="flex-row items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2"
            >
              <View>
                <Cloud color="#059669" size={16} />
                <View className="absolute -bottom-1 -right-1 rounded-full bg-emerald-50">
                  <Check color="#059669" size={10} strokeWidth={3} />
                </View>
              </View>
              <Text className="ml-2 text-[10px] font-bold uppercase tracking-[1px] text-emerald-700">
                {copy.common.offlineReady}
              </Text>
            </Pressable>
          </View>
        </View>

        <BentoCard
          onPress={() => navigation.navigate("Player", { routineId: featured.id })}
          className="mb-4 h-[288px] overflow-hidden"
        >
          <View style={{ flex: 1 }}>
            <Image
              source={{ uri: featured.imageUrl }}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["rgba(15,23,42,0.08)", "rgba(15,23,42,0.92)"]}
              style={StyleSheet.absoluteFillObject}
            />
            <View className="flex-1 justify-between p-6">
              <View>
                <View className="self-start rounded-full border border-white/20 bg-white/15 px-3 py-1">
                  <Text className="text-[10px] font-bold uppercase tracking-[1px] text-white">
                    {copy.dashboard.dailySuggestion}
                  </Text>
                </View>
              </View>

              <View>
                <Text className="mb-3 text-3xl font-bold leading-9 text-white">
                  {getLocalizedText(featured.title, locale)}
                </Text>
                <Pressable
                  onPress={() => navigation.navigate("Player", { routineId: featured.id })}
                  className="self-start flex-row items-center rounded-full bg-slate-900 px-5 py-3"
                >
                  <Text className="mr-2 text-sm font-semibold text-white">
                    {`${getLocalizedText(featured.cta, locale)} (${featured.durationMinutes} min)`}
                  </Text>
                  <Play color="#ffffff" fill="#ffffff" size={14} />
                </Pressable>
              </View>
            </View>
          </View>
        </BentoCard>

        <View className="mb-4 flex-row gap-4">
          <BentoCard className="aspect-square flex-1 p-5">
            <View className="flex-1 justify-between">
              <View className="flex-row items-start justify-between">
                <Text className="text-sm font-medium text-slate-500">
                  {getLocalizedText(dashboard.streak.label, locale)}
                </Text>
                <Flame color="#fb923c" size={20} strokeWidth={2.4} />
              </View>

              <View>
                <View className="flex-row items-end">
                  <Text className="text-5xl font-light tracking-tight text-slate-800">
                    {dashboard.streak.days}
                  </Text>
                  <Text className="mb-1 ml-2 text-sm font-medium text-slate-400">
                    {locale === "es" ? "dias" : "days"}
                  </Text>
                </View>
                <Text className="mt-2 text-xs font-medium text-slate-400">
                  {getLocalizedText(dashboard.streak.caption, locale)}
                </Text>
              </View>
            </View>
          </BentoCard>

          <BentoCard
            onPress={() => navigation.navigate("PainMap")}
            className="aspect-square flex-1 overflow-hidden p-5"
          >
            <View className="flex-1 justify-between">
              <View className="flex-row items-start justify-between">
                <Text className="text-sm font-medium leading-5 text-slate-500">
                  {copy.dashboard.muscleState}
                </Text>
                <ChevronRight color="#cbd5e1" size={16} />
              </View>

              <View className="self-end">
                <Svg width={110} height={140} viewBox="0 0 100 120">
                  <Circle cx={50} cy={20} r={10} stroke="#cbd5e1" strokeWidth={1.7} fill="none" />
                  <Line x1={50} y1={30} x2={50} y2={45} stroke="#cbd5e1" strokeWidth={1.7} />
                  <Path
                    d="M 30 55 C 30 40, 70 40, 70 55"
                    stroke="#cbd5e1"
                    strokeWidth={1.7}
                    fill="none"
                  />
                  <Path d="M 30 55 L 30 100" stroke="#cbd5e1" strokeWidth={1.7} fill="none" />
                  <Path d="M 70 55 L 70 100" stroke="#cbd5e1" strokeWidth={1.7} fill="none" />
                  <Path d="M 40 55 C 40 90, 40 110, 50 120" stroke="#cbd5e1" strokeWidth={1.7} fill="none" />
                  <Path d="M 60 55 C 60 90, 60 110, 50 120" stroke="#cbd5e1" strokeWidth={1.7} fill="none" />
                  <Circle
                    cx={highlight.cx}
                    cy={highlight.cy}
                    r={highlight.r}
                    fill="rgba(239,68,68,0.15)"
                    stroke="#ef4444"
                    strokeWidth={1.4}
                  />
                </Svg>
              </View>
            </View>
          </BentoCard>
        </View>

        <BentoCard className="mb-4 p-5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="mr-4 h-12 w-12 items-center justify-center rounded-3xl bg-slate-100">
                <Clock3 color="#94a3b8" size={22} />
              </View>
              <View>
                <Text className="text-sm font-medium text-slate-500">
                  {getLocalizedText(dashboard.breakTimer.label, locale)}
                </Text>
                <Text className="mt-1 text-2xl font-semibold tracking-tight text-slate-800">
                  {dashboard.breakTimer.displayValue}
                  <Text className="text-sm font-normal text-slate-400">
                    {locale === "es" ? " min" : " min"}
                  </Text>
                </Text>
              </View>
            </View>

            <View className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
              <View
                className="h-full rounded-full bg-slate-300"
                style={{ width: `${dashboard.breakTimer.progress * 100}%` }}
              />
            </View>
          </View>
        </BentoCard>

        <BentoCard
          onPress={() => navigation.navigate("Paywall")}
          className="border-slate-800 bg-slate-900 p-5"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-sm font-semibold tracking-wide text-white">
                {getLocalizedText(dashboard.teamUpsell.brand, locale)}
              </Text>
              <Text className="mt-2 text-xs font-medium text-slate-400">
                {getLocalizedText(dashboard.teamUpsell.headline, locale)}
              </Text>
            </View>
            <View className="rounded-full bg-white/10 px-3 py-1">
              <Text className="text-[10px] font-bold uppercase tracking-[1px] text-white">
                {copy.dashboard.teamsBadge}
              </Text>
            </View>
          </View>
        </BentoCard>
      </ScrollView>
    </SafeAreaView>
  );
}
