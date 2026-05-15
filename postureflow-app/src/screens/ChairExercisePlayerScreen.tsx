import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Check, Pause, Play } from "lucide-react-native";
import { ChairFlowVideo } from "../components/chair-flow/ChairFlowVideo";
import { useChairDashboard } from "../hooks/useChairDashboard";
import type { AppScreenProps } from "../types/app";

type Props = AppScreenProps<"ChairExercisePlayer">;

const palette = {
  warmSlate: "#2F353B",
  warmSlateDeep: "#262B30",
  terracotta: "#E2725B",
  cinnamon: "#D2691E",
  bone: "#F5F5F5",
  boneMuted: "#C8C8C8",
} as const;

export function ChairExercisePlayerScreen({ navigation, route }: Props) {
  const { completeExercise, dashboard, isRefreshing } = useChairDashboard();
  const [isPlaying, setPlaying] = useState(true);
  const [isCompleting, setCompleting] = useState(false);
  const { width } = useWindowDimensions();
  const playerWidth = Math.min(width, 480) - 40;
  const playerHeight = Math.max(204, Math.round((playerWidth * 9) / 16));

  const exercise = useMemo(
    () =>
      dashboard.exercises.find(
        (item) => item.id === route.params.exerciseId,
      ) ?? null,
    [dashboard.exercises, route.params.exerciseId],
  );

  if (!exercise || isRefreshing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: palette.warmSlate }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={palette.terracotta} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.warmSlate }}>
      <ScrollView
        contentContainerStyle={{
          alignSelf: "center",
          maxWidth: 480,
          paddingBottom: 36,
          paddingHorizontal: 20,
          paddingTop: 18,
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-5 flex-row items-center justify-between">
          <Pressable
            onPress={() => navigation.goBack()}
            className="h-11 w-12 items-center justify-center rounded-premium border border-white/10 bg-warmSlateDeep"
          >
            <ChevronLeft color={palette.bone} size={20} />
          </Pressable>

          <Text className="text-[12px] font-black uppercase tracking-[1.4px] text-boneMuted">
            Loop segment
          </Text>
        </View>

        <View className="overflow-hidden rounded-premium border border-white/10 bg-warmSlateDeep">
          <ChairFlowVideo
            endTime={exercise.endTime}
            height={playerHeight}
            isPlaying={isPlaying}
            startTime={exercise.startTime}
            videoId={exercise.youtubeId}
            width={playerWidth}
          />
        </View>

        <View className="mt-5 rounded-premium border border-white/10 bg-warmSlateDeep p-4">
          <Text className="text-[11px] font-black uppercase tracking-[1.2px] text-cinnamon">
            {exercise.category}
          </Text>
          <Text className="mt-2 text-[27px] font-black leading-8 text-bone">
            {exercise.title}
          </Text>
          <Text className="mt-3 text-[14px] font-semibold leading-5 text-boneMuted">
            This segment loops from {exercise.startTime}s to {exercise.endTime}s
            so the movement can stay rhythmic without touching the screen.
          </Text>
        </View>

        <View className="mt-4 flex-row gap-3">
          <Pressable
            onPress={() => setPlaying((current) => !current)}
            className="flex-1 flex-row items-center justify-center rounded-premium bg-terracotta px-4 py-4"
          >
            {isPlaying ? (
              <Pause color={palette.bone} fill={palette.bone} size={16} />
            ) : (
              <Play color={palette.bone} fill={palette.bone} size={16} />
            )}
            <Text className="ml-2 text-[12px] font-black uppercase tracking-[1px] text-bone">
              {isPlaying ? "Pause" : "Play"}
            </Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              setCompleting(true);
              await completeExercise(exercise.id);
              setCompleting(false);
              navigation.goBack();
            }}
            className="flex-1 flex-row items-center justify-center rounded-premium border border-cinnamon px-4 py-4"
          >
            {isCompleting ? (
              <ActivityIndicator color={palette.cinnamon} />
            ) : (
              <>
                <Check color={palette.cinnamon} size={16} />
                <Text className="ml-2 text-[12px] font-black uppercase tracking-[1px] text-cinnamon">
                  Complete
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
