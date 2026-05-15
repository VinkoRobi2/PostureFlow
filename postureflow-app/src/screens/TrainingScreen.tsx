import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Clock3,
  Play,
  RefreshCcw,
  SlidersHorizontal,
  WifiOff,
} from "lucide-react-native";
import { VideoPlayer } from "../components/training/VideoPlayer";
import {
  TrainingExerciseFilter,
  useTrainingExercises,
} from "../hooks/useTrainingExercises";
import { trainingShadow, trainingTheme } from "../theme/training";
import type { AppScreenProps, TrainingExercise } from "../types/app";

type Props = AppScreenProps<"Training">;

const filterLabel: Record<TrainingExerciseFilter, string> = {
  Todos: "Todo",
  Respiracion: "Respiracion",
  Espalda: "Espalda",
  "Flujo Completo": "Flujo Completo",
};

export function TrainingScreen({ navigation }: Props) {
  const {
    categories,
    exercises,
    isFallback,
    isLoading,
    isRefreshing,
    refresh,
  } = useTrainingExercises();
  const [activeFilter, setActiveFilter] =
    useState<TrainingExerciseFilter>("Todos");
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(
    exercises[0]?.id ?? null,
  );

  const filteredExercises = useMemo(
    () =>
      activeFilter === "Todos"
        ? exercises
        : exercises.filter((exercise) => exercise.category === activeFilter),
    [activeFilter, exercises],
  );

  useEffect(() => {
    if (filteredExercises.length === 0) {
      setActiveExerciseId(null);
      return;
    }

    const activeExerciseStillVisible = filteredExercises.some(
      (exercise) => exercise.id === activeExerciseId,
    );

    if (!activeExerciseStillVisible) {
      setActiveExerciseId(filteredExercises[0].id);
    }
  }, [activeExerciseId, filteredExercises]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        decelerationRate="fast"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            hitSlop={8}
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.headerAction,
              pressed ? styles.pressed : null,
            ]}
          >
            <ChevronLeft color={trainingTheme.textPrimary} size={20} />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>PostureFlow</Text>
            <Text style={styles.title}>Entrenamiento</Text>
          </View>

          <Pressable
            hitSlop={8}
            onPress={() => void refresh()}
            style={({ pressed }) => [
              styles.headerAction,
              pressed ? styles.pressed : null,
            ]}
          >
            <RefreshCcw
              color={
                isRefreshing
                  ? trainingTheme.terracotta
                  : trainingTheme.textPrimary
              }
              size={18}
            />
          </Pressable>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.statusPill}>
            <SlidersHorizontal color={trainingTheme.terracotta} size={14} />
            <Text style={styles.statusText}>Categorias</Text>
          </View>

          {isFallback ? (
            <View style={styles.statusPill}>
              <WifiOff color={trainingTheme.textSecondary} size={14} />
              <Text style={styles.statusText}>Modo local</Text>
            </View>
          ) : null}
        </View>

        <ScrollView
          contentContainerStyle={styles.filters}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {categories.map((category) => {
            const isActive = activeFilter === category;

            return (
              <Pressable
                key={category}
                onPress={() => setActiveFilter(category)}
                style={({ pressed }) => [
                  styles.filterChip,
                  isActive ? styles.filterChipActive : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive ? styles.filterTextActive : null,
                  ]}
                >
                  {filterLabel[category]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={trainingTheme.terracotta} />
          </View>
        ) : (
          <View style={styles.exerciseList}>
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                isActive={activeExerciseId === exercise.id}
                onPress={() => setActiveExerciseId(exercise.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ExerciseCard({
  exercise,
  isActive,
  onPress,
}: {
  exercise: TrainingExercise;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.exerciseCard,
        isActive ? styles.exerciseCardActive : null,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <VideoPlayer
        videoUrl={exercise.videoUrl}
        shouldPlay={isActive}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.videoOverlay} />
      <View style={styles.videoShade} />

      <View style={styles.cardContent}>
        <View style={styles.cardMetaRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{exercise.category}</Text>
          </View>

          <View style={styles.durationBadge}>
            <Clock3 color={trainingTheme.cream} size={13} />
            <Text style={styles.durationText}>{exercise.duration}</Text>
          </View>
        </View>

        <View>
          <Text style={styles.exerciseTitle}>{exercise.title}</Text>
          <Text style={styles.exerciseDescription}>{exercise.description}</Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.playBadge}>
            <Play
              color={trainingTheme.cream}
              fill={trainingTheme.cream}
              size={13}
            />
            <Text style={styles.playText}>
              {isActive ? "Reproduciendo" : "Previsualizar"}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: trainingTheme.background,
    flex: 1,
  },
  content: {
    alignSelf: "center",
    maxWidth: 460,
    paddingBottom: 34,
    paddingHorizontal: 20,
    paddingTop: 18,
    width: "100%",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 18,
  },
  headerAction: {
    alignItems: "center",
    backgroundColor: trainingTheme.surface,
    borderColor: trainingTheme.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  headerText: {
    flex: 1,
    paddingHorizontal: 14,
  },
  eyebrow: {
    color: trainingTheme.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: {
    color: trainingTheme.textPrimary,
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
    marginTop: 3,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  statusPill: {
    alignItems: "center",
    backgroundColor: trainingTheme.surfaceRaised,
    borderColor: trainingTheme.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  statusText: {
    color: trainingTheme.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginLeft: 7,
    textTransform: "uppercase",
  },
  filters: {
    gap: 10,
    paddingBottom: 18,
  },
  filterChip: {
    backgroundColor: trainingTheme.surface,
    borderColor: trainingTheme.border,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  filterChipActive: {
    backgroundColor: trainingTheme.terracotta,
    borderColor: trainingTheme.terracotta,
  },
  filterText: {
    color: trainingTheme.textSecondary,
    fontSize: 13,
    fontWeight: "800",
  },
  filterTextActive: {
    color: trainingTheme.cream,
  },
  loadingState: {
    alignItems: "center",
    minHeight: 240,
    justifyContent: "center",
  },
  exerciseList: {
    gap: 16,
  },
  exerciseCard: {
    backgroundColor: trainingTheme.surface,
    borderColor: trainingTheme.border,
    borderRadius: 16,
    borderWidth: 1,
    height: 276,
    overflow: "hidden",
    ...trainingShadow(0.2, 24),
  },
  exerciseCardActive: {
    borderColor: trainingTheme.borderStrong,
  },
  cardPressed: {
    transform: [{ scale: 0.988 }],
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: trainingTheme.terracottaOverlay,
  },
  videoShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(40, 36, 32, 0.38)",
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
    padding: 18,
  },
  cardMetaRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryBadge: {
    backgroundColor: trainingTheme.cinnamonSoft,
    borderColor: "rgba(244, 236, 226, 0.22)",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  categoryText: {
    color: trainingTheme.cream,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.9,
    textTransform: "uppercase",
  },
  durationBadge: {
    alignItems: "center",
    backgroundColor: "rgba(40, 36, 32, 0.54)",
    borderColor: "rgba(244, 236, 226, 0.18)",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  durationText: {
    color: trainingTheme.cream,
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 6,
  },
  exerciseTitle: {
    color: trainingTheme.textPrimary,
    fontSize: 27,
    fontWeight: "900",
    lineHeight: 31,
  },
  exerciseDescription: {
    color: trainingTheme.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 8,
  },
  cardFooter: {
    alignItems: "flex-start",
  },
  playBadge: {
    alignItems: "center",
    backgroundColor: trainingTheme.cinnamon,
    borderColor: "rgba(244, 236, 226, 0.18)",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  playText: {
    color: trainingTheme.cream,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginLeft: 8,
    textTransform: "uppercase",
  },
  pressed: {
    opacity: 0.78,
  },
});
