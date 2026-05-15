import { useCallback, useEffect, useMemo, useState } from "react";
import { FALLBACK_TRAINING_EXERCISES } from "../data/training-exercises";
import { api } from "../services/api";
import type { TrainingExercise, TrainingExerciseCategory } from "../types/app";

type LoadState = "idle" | "loading" | "ready" | "error";

export type TrainingExerciseFilter = TrainingExerciseCategory | "Todos";

export function useTrainingExercises() {
  const [exercises, setExercises] = useState<TrainingExercise[]>(
    FALLBACK_TRAINING_EXERCISES,
  );
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoadState("loading");

    try {
      const response = await api.getExercises();
      setExercises(response.length > 0 ? response : FALLBACK_TRAINING_EXERCISES);
      setErrorMessage(null);
      setLoadState("ready");
    } catch (error) {
      setExercises(FALLBACK_TRAINING_EXERCISES);
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudo cargar ejercicios.",
      );
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const categories = useMemo<TrainingExerciseFilter[]>(() => {
    const uniqueCategories = exercises.reduce<TrainingExerciseCategory[]>(
      (current, exercise) =>
        current.includes(exercise.category)
          ? current
          : [...current, exercise.category],
      [],
    );

    return ["Todos", ...uniqueCategories];
  }, [exercises]);

  return {
    exercises,
    categories,
    errorMessage,
    isFallback: loadState === "error",
    isLoading: loadState === "loading" && exercises.length === 0,
    isRefreshing: loadState === "loading",
    refresh,
  };
}
