import {
  Info,
  Pause,
  Play,
  RotateCcw,
  X,
} from "lucide-react-native";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useMemo, useState } from "react";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import type { AppScreenProps } from "../types/app";
import { formatSeconds, getLocalizedText } from "../utils/localize";

type Props = AppScreenProps<"Player">;

export function PlayerScreen({ navigation, route }: Props) {
  const {
    locale,
    startRoutine,
    updateActiveSessionProgress,
    completeActiveSession,
  } = useAppModel();
  const [routine, setRoutine] = useState<Awaited<ReturnType<typeof startRoutine>>>(null);
  const [isPlaying, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const copy = messages[locale];

  useEffect(() => {
    let active = true;

    void startRoutine(route.params.routineId).then((value) => {
      if (active) {
        setRoutine(value);
      }
    });

    return () => {
      active = false;
    };
  }, [route.params.routineId, startRoutine]);

  const totalDurationSeconds = routine?.totalDurationSeconds ?? 1;

  useEffect(() => {
    if (!routine || !isPlaying) {
      return;
    }

    const step = 100 / (totalDurationSeconds * 10);
    const interval = setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + step, 100);
        void updateActiveSessionProgress(next);
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, routine, totalDurationSeconds, updateActiveSessionProgress]);

  useEffect(() => {
    if (progress < 100 || !routine) {
      return;
    }

    void completeActiveSession(route.params.routineId).then(() => {
      navigation.replace("Success");
    });
  }, [completeActiveSession, navigation, progress, route.params.routineId, routine]);

  const currentSeconds = useMemo(
    () => Math.round((progress / 100) * totalDurationSeconds),
    [progress, totalDurationSeconds],
  );

  if (!routine) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f4f4f5",
        }}
      >
        <ActivityIndicator color="#0f766e" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f4f5" }}>
      <View className="flex-1 px-4 py-4">
        <View className="absolute left-6 right-6 top-6 z-20 flex-row items-center justify-between">
          <Pressable
            onPress={() => navigation.goBack()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
          >
            <X color="#475569" size={18} />
          </Pressable>

          <View className="rounded-full bg-white/90 px-4 py-2">
            <Text className="text-xs font-semibold uppercase tracking-[1px] text-slate-600">
              {`${formatSeconds(currentSeconds)} / ${formatSeconds(totalDurationSeconds)}`}
            </Text>
          </View>
        </View>

        <View className="mt-16 flex-1 items-center justify-center">
          <View className="mb-6 h-[440px] w-full overflow-hidden rounded-[34px] bg-slate-200">
            <Image
              source={{ uri: routine.imageUrl }}
              className="h-full w-full"
              resizeMode="cover"
            />

            {!isPlaying ? (
              <View className="absolute inset-0 items-center justify-center bg-black/20">
                <Pressable
                  onPress={() => setPlaying(true)}
                  className="h-20 w-20 items-center justify-center rounded-full bg-white/30"
                >
                  <Play color="#ffffff" fill="#ffffff" size={28} />
                </Pressable>
              </View>
            ) : null}
          </View>

          <View className="absolute bottom-40 left-5 right-5 rounded-[24px] border border-slate-100 bg-white/95 p-4">
            <View className="flex-row items-start">
              <View className="mr-3 mt-1 rounded-full bg-teal-100 p-2">
                <Info color="#0f766e" size={16} />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-semibold uppercase tracking-[1px] text-slate-800">
                  {copy.player.position}
                </Text>
                <Text className="mt-1 text-sm font-medium leading-5 text-slate-600">
                  {getLocalizedText(routine.tipBody, locale)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="rounded-[32px] border border-slate-100 bg-white p-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-semibold tracking-tight text-slate-800">
              {getLocalizedText(routine.title, locale)}
            </Text>
            <Text className="text-sm font-medium text-slate-400">
              {getLocalizedText(routine.repetitionsLabel, locale)}
            </Text>
          </View>

          <View className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100">
            <View
              className="h-full rounded-full bg-teal-500"
              style={{ width: `${progress}%` }}
            />
          </View>

          <View className="flex-row items-center justify-center">
            <Pressable className="mr-12">
              <RotateCcw color="#94a3b8" size={22} />
            </Pressable>

            <Pressable
              onPress={() => setPlaying((current) => !current)}
              className="h-16 w-16 items-center justify-center rounded-full bg-slate-900"
            >
              {isPlaying ? (
                <Pause color="#ffffff" fill="#ffffff" size={24} />
              ) : (
                <Play color="#ffffff" fill="#ffffff" size={24} />
              )}
            </Pressable>

            <Pressable
              onPress={() => {
                void completeActiveSession(route.params.routineId).then(() => {
                  navigation.replace("Success");
                });
              }}
              className="ml-12"
            >
              <Text className="text-sm font-semibold uppercase tracking-[1px] text-slate-500">
                {copy.common.skip}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
