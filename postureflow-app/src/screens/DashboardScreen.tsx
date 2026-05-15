import { type ReactNode, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Activity,
  BarChart3,
  BookOpen,
  Flame,
  Home,
  LogOut,
  Play,
  RefreshCcw,
  Sparkles,
  UserRound,
  Waves,
  Wind,
} from "lucide-react-native";
import { useChairDashboard } from "../hooks/useChairDashboard";
import { useAppModel } from "../providers/app-provider";
import type { AppScreenProps, ChairDashboardExercise } from "../types/app";
import { ff, rs } from "../utils/responsive";

type Props = AppScreenProps<"Dashboard">;

const palette = {
  ink: "#1D1915",
  espresso: "#2C241D",
  cocoa: "#3A3027",
  terracotta: "#C66F4E",
  terracottaDeep: "#A95A3E",
  cinnamon: "#B87945",
  ochre: "#D6A45F",
  sage: "#9AA582",
  sand: "#F4EEE6",
  sandDeep: "#E4D7C8",
  stone: "#B8AB9C",
  cream: "#FFF9F1",
} as const;

const floatingShadow: ViewStyle = {
  shadowColor: "#241B14",
  shadowOffset: { width: 0, height: rs(18) },
  shadowOpacity: 0.12,
  shadowRadius: rs(28),
  elevation: 8,
};

const softShadow: ViewStyle = {
  shadowColor: "#241B14",
  shadowOffset: { width: 0, height: rs(10) },
  shadowOpacity: 0.08,
  shadowRadius: rs(18),
  elevation: 4,
};

export function DashboardScreen({ navigation }: Props) {
  const { authSession, handleLogout, locale } = useAppModel();
  const { dashboard, isFallback, isRefreshing, refresh } = useChairDashboard();
  const firstName =
    authSession?.user.firstName?.trim() || dashboard.user.firstName || "Alex";
  const initials = firstName.slice(0, 1).toUpperCase();
  const completedCount = dashboard.completedCount;
  const totalCount = Math.max(dashboard.totalCount, 1);
  const progressPercentage = Math.min(
    100,
    Math.round((completedCount / totalCount) * 100),
  );
  const weeklyAlignment = Math.min(
    96,
    Math.max(progressPercentage, 64 + completedCount * 8),
  );
  const weeklyProgressWidth = `${weeklyAlignment}%` as `${number}%`;
  const breathingExercise =
    dashboard.exercises.find((exercise) =>
      exercise.id.toLowerCase().includes("breath"),
    ) ?? dashboard.exercises[0];

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (locale === "es") {
      if (hour < 12) {
        return "Buenos dias";
      }

      if (hour < 18) {
        return "Buenas tardes";
      }

      return "Buenas noches";
    }

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 18) {
      return "Good afternoon";
    }

    return "Good evening";
  }, [locale]);

  const copy =
    locale === "es"
      ? {
          eyebrow: "PostureFlow Premium",
          headline: "Tu cuerpo listo para trabajar con menos tension.",
          profileHint: "Salir",
          weekly: "Alineacion semanal",
          progressNote: "flujo corporal estabilizado",
          completed: "sesiones completadas",
          quickFlows: "Flows rapidos",
          breathing: "Quick Breathing",
          breathingTitle: "Respiracion 4-6",
          breathingBody:
            "Baja el tono del cuello y recupera foco antes de tu siguiente bloque.",
          start: "Iniciar",
          localMode: "modo local",
          tabs: {
            home: "Inicio",
            flows: "Flows",
            breath: "Respira",
            library: "Biblioteca",
          },
        }
      : {
          eyebrow: "PostureFlow Premium",
          headline: "Your body ready for deeper work with less tension.",
          profileHint: "Logout",
          weekly: "Weekly alignment",
          progressNote: "body flow stabilized",
          completed: "sessions completed",
          quickFlows: "Quick flows",
          breathing: "Quick Breathing",
          breathingTitle: "4-6 Breathing",
          breathingBody:
            "Lower neck tone and recover focus before the next work block.",
          start: "Start",
          localMode: "local mode",
          tabs: {
            home: "Home",
            flows: "Flows",
            breath: "Breath",
            library: "Library",
          },
        };

  return (
    <SafeAreaView className="flex-1 bg-[#F4EEE6]">
      <View className="flex-1">
        <ScrollView
          contentContainerStyle={{
            alignSelf: "center",
            maxWidth: rs(480),
            paddingBottom: rs(128),
            paddingHorizontal: rs(20),
            paddingTop: rs(18),
            width: "100%",
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-6 flex-row items-center justify-between">
            <View className="min-w-0 flex-1 pr-4">
              <Text
                className="text-[11px] font-black uppercase tracking-[1.8px] text-[#A95A3E]"
                style={{ fontFamily: ff }}
              >
                {copy.eyebrow}
              </Text>
              <Text
                className="mt-2 text-[32px] font-black leading-[37px] text-[#1D1915]"
                style={{ fontFamily: ff }}
              >
                {greeting}, {firstName}
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              <Pressable
                accessibilityLabel="Refresh dashboard"
                className="h-12 w-12 items-center justify-center rounded-[18px] border border-[#E4D7C8] bg-[#FFF9F1]"
                onPress={() => void refresh()}
                style={({ pressed }) => [
                  softShadow,
                  { opacity: pressed ? 0.78 : 1 },
                ]}
              >
                {isRefreshing ? (
                  <ActivityIndicator color={palette.terracotta} />
                ) : (
                  <RefreshCcw color={palette.espresso} size={rs(18)} />
                )}
              </Pressable>

              <Pressable
                accessibilityLabel={copy.profileHint}
                className="h-12 min-w-[52px] flex-row items-center justify-center rounded-[18px] border border-[#C66F4E]/30 bg-[#2C241D] px-3"
                onPress={() => void handleLogout()}
                style={({ pressed }) => [
                  softShadow,
                  { opacity: pressed ? 0.82 : 1 },
                ]}
              >
                <Text
                  className="mr-2 text-sm font-black text-[#FFF9F1]"
                  style={{ fontFamily: ff }}
                >
                  {initials}
                </Text>
                <LogOut color={palette.terracotta} size={rs(15)} strokeWidth={2} />
              </Pressable>
            </View>
          </View>

          <View
            className="mb-5 overflow-hidden rounded-[34px] border border-[#E4D7C8] bg-[#FFF9F1] p-5"
            style={floatingShadow}
          >
            <View className="flex-row items-start justify-between">
              <View className="max-w-[76%]">
                <Text
                  className="text-[13px] font-bold leading-5 text-[#7E6F61]"
                  style={{ fontFamily: ff }}
                >
                  {copy.headline}
                </Text>
                <Text
                  className="mt-4 text-[44px] font-black leading-[48px] text-[#1D1915]"
                  style={{ fontFamily: ff }}
                >
                  {weeklyAlignment}%
                </Text>
              </View>

              <View className="h-16 w-16 items-center justify-center rounded-[24px] bg-[#C66F4E]/15">
                <BarChart3 color={palette.terracottaDeep} size={rs(26)} />
              </View>
            </View>

            <View className="mt-5 h-3 overflow-hidden rounded-full bg-[#E4D7C8]">
              <View
                className="h-full rounded-full bg-[#C66F4E]"
                style={{ width: weeklyProgressWidth }}
              />
            </View>

            <View className="mt-4 flex-row items-center justify-between">
              <Text
                className="text-xs font-black uppercase tracking-[1px] text-[#A95A3E]"
                style={{ fontFamily: ff }}
              >
                {copy.weekly}
              </Text>
              <Text
                className="text-xs font-bold text-[#7E6F61]"
                style={{ fontFamily: ff }}
              >
                {completedCount}/{totalCount} {copy.completed}
              </Text>
            </View>

            <View className="mt-5 flex-row gap-3">
              <MetricPill
                icon={<Flame color={palette.terracottaDeep} size={rs(15)} />}
                label={`${weeklyAlignment}% ${copy.progressNote}`}
              />
              {isFallback ? (
                <MetricPill
                  icon={<Sparkles color={palette.sage} size={rs(15)} />}
                  label={copy.localMode}
                />
              ) : null}
            </View>
          </View>

          <View className="mb-4 flex-row items-center justify-between">
            <Text
              className="text-lg font-black text-[#1D1915]"
              style={{ fontFamily: ff }}
            >
              {copy.quickFlows}
            </Text>
            <Pressable
              className="rounded-full border border-[#E4D7C8] bg-[#FFF9F1] px-4 py-2"
              onPress={() => navigation.navigate("ChairFlow")}
            >
              <Text
                className="text-xs font-black uppercase tracking-[0.8px] text-[#A95A3E]"
                style={{ fontFamily: ff }}
              >
                Chair Tai Chi
              </Text>
            </Pressable>
          </View>

          <View className="mb-5 flex-row flex-wrap gap-3">
            {dashboard.exercises.slice(0, 4).map((exercise, index) => (
              <FlowTile
                exercise={exercise}
                index={index}
                key={exercise.id}
                onPress={() =>
                  navigation.navigate("ChairExercisePlayer", {
                    exerciseId: exercise.id,
                  })
                }
              />
            ))}
          </View>

          <Pressable
            className="overflow-hidden rounded-[34px] bg-[#2C241D]"
            onPress={() =>
              breathingExercise
                ? navigation.navigate("ChairExercisePlayer", {
                    exerciseId: breathingExercise.id,
                  })
                : navigation.navigate("Training")
            }
            style={({ pressed }) => [
              floatingShadow,
              { opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <View className="p-5">
              <View className="mb-5 flex-row items-center justify-between">
                <View className="rounded-full bg-[#FFF9F1]/10 px-3 py-2">
                  <Text
                    className="text-[10px] font-black uppercase tracking-[1.4px] text-[#D6A45F]"
                    style={{ fontFamily: ff }}
                  >
                    {copy.breathing}
                  </Text>
                </View>
                <View className="h-12 w-12 items-center justify-center rounded-[18px] bg-[#C66F4E]">
                  <Wind color={palette.cream} size={rs(22)} strokeWidth={2} />
                </View>
              </View>

              <Text
                className="text-[28px] font-black leading-[32px] text-[#FFF9F1]"
                style={{ fontFamily: ff }}
              >
                {copy.breathingTitle}
              </Text>
              <Text
                className="mt-3 max-w-[310px] text-sm font-semibold leading-5 text-[#D8CAB9]"
                style={{ fontFamily: ff }}
              >
                {copy.breathingBody}
              </Text>

              <View className="mt-6 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  {[0, 1, 2].map((item) => (
                    <View
                      className="rounded-full"
                      key={item}
                      style={{
                        width: rs(item === 1 ? 34 : 18),
                        height: rs(8),
                        backgroundColor:
                          item === 1 ? palette.ochre : "rgba(255,249,241,0.2)",
                      }}
                    />
                  ))}
                </View>

                <View className="flex-row items-center rounded-full bg-[#FFF9F1] px-4 py-3">
                  <Play
                    color={palette.espresso}
                    fill={palette.espresso}
                    size={rs(14)}
                  />
                  <Text
                    className="ml-2 text-xs font-black uppercase tracking-[0.8px] text-[#2C241D]"
                    style={{ fontFamily: ff }}
                  >
                    {copy.start}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        </ScrollView>

        <BottomTabBar
          labels={copy.tabs}
          onBreath={() => navigation.navigate("Training")}
          onFlows={() => navigation.navigate("ChairFlow")}
          onLibrary={() => navigation.navigate("Library")}
        />
      </View>
    </SafeAreaView>
  );
}

function MetricPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <View className="min-w-0 flex-1 flex-row items-center rounded-[18px] bg-[#F4EEE6] px-3 py-3">
      <View className="mr-2 h-7 w-7 items-center justify-center rounded-[10px] bg-[#FFF9F1]">
        {icon}
      </View>
      <Text
        className="min-w-0 flex-1 text-[11px] font-black uppercase leading-4 tracking-[0.6px] text-[#7E6F61]"
        numberOfLines={2}
        style={{ fontFamily: ff }}
      >
        {label}
      </Text>
    </View>
  );
}

function FlowTile({
  exercise,
  index,
  onPress,
}: {
  exercise: ChairDashboardExercise;
  index: number;
  onPress: () => void;
}) {
  const iconColor = index % 2 === 0 ? palette.terracottaDeep : palette.sage;
  const Icon = index % 3 === 0 ? Waves : index % 3 === 1 ? Activity : Sparkles;
  const shortTitle =
    exercise.id === "chair-breath-posture-reset"
      ? "Reseteo Cuello"
      : exercise.id === "chair-lower-body-foundation"
        ? "Lumbar Relief"
        : exercise.title.replace("Chair Tai Chi ", "").replace("Seated ", "");

  return (
    <Pressable
      className="min-h-[148px] flex-1 basis-[47%] rounded-[28px] border border-[#E4D7C8] bg-[#FFF9F1] p-4"
      onPress={onPress}
      style={({ pressed }) => [softShadow, { opacity: pressed ? 0.84 : 1 }]}
    >
      <View className="mb-4 flex-row items-start justify-between">
        <View
          className="h-11 w-11 items-center justify-center rounded-[16px]"
          style={{ backgroundColor: index % 2 === 0 ? "#F4DFD4" : "#E8E8D9" }}
        >
          <Icon color={iconColor} size={rs(20)} strokeWidth={1.9} />
        </View>
        {exercise.completed ? (
          <View className="rounded-full bg-[#9AA582]/20 px-2 py-1">
            <Text
              className="text-[9px] font-black uppercase text-[#687254]"
              style={{ fontFamily: ff }}
            >
              Done
            </Text>
          </View>
        ) : null}
      </View>

      <Text
        className="text-[17px] font-black leading-[21px] text-[#1D1915]"
        numberOfLines={2}
        style={{ fontFamily: ff }}
      >
        {shortTitle}
      </Text>
      <Text
        className="mt-3 text-[11px] font-black uppercase tracking-[0.8px] text-[#A95A3E]"
        style={{ fontFamily: ff }}
      >
        {exercise.duration} / {exercise.category}
      </Text>
    </Pressable>
  );
}

function BottomTabBar({
  labels,
  onBreath,
  onFlows,
  onLibrary,
}: {
  labels: {
    home: string;
    flows: string;
    breath: string;
    library: string;
  };
  onBreath: () => void;
  onFlows: () => void;
  onLibrary: () => void;
}) {
  const items = [
    {
      key: "home",
      label: labels.home,
      icon: Home,
      active: true,
      onPress: undefined,
    },
    {
      key: "flows",
      label: labels.flows,
      icon: Waves,
      active: false,
      onPress: onFlows,
    },
    {
      key: "breath",
      label: labels.breath,
      icon: Wind,
      active: false,
      onPress: onBreath,
    },
    {
      key: "library",
      label: labels.library,
      icon: BookOpen,
      active: false,
      onPress: onLibrary,
    },
    {
      key: "profile",
      label: "",
      icon: UserRound,
      active: false,
      onPress: undefined,
    },
  ] as const;

  return (
    <View className="absolute bottom-0 left-0 right-0 items-center px-4 pb-5">
      <BlurView
        intensity={38}
        tint="light"
        className="w-full max-w-[440px] overflow-hidden rounded-[30px] border border-[#FFF9F1]/70"
        style={floatingShadow}
      >
        <View className="flex-row items-center justify-between bg-[#FFF9F1]/78 px-2 py-2">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Pressable
                className={`h-14 min-w-[54px] flex-1 items-center justify-center rounded-[22px] ${
                  item.active ? "bg-[#2C241D]" : "bg-transparent"
                }`}
                disabled={!item.onPress}
                key={item.key}
                onPress={item.onPress}
                style={({ pressed }) => ({ opacity: pressed ? 0.78 : 1 })}
              >
                <Icon
                  color={item.active ? palette.cream : palette.stone}
                  size={rs(19)}
                  strokeWidth={2}
                />
                {item.label ? (
                  <Text
                    className={`mt-1 text-[9px] font-black ${
                      item.active ? "text-[#FFF9F1]" : "text-[#8D8072]"
                    }`}
                    numberOfLines={1}
                    style={{ fontFamily: ff }}
                  >
                    {item.label}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}
