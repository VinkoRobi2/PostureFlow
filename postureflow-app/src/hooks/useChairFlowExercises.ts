import { useCallback, useEffect, useMemo, useState } from "react";
import { FALLBACK_CHAIR_FLOW_EXERCISES } from "../data/chair-flow-exercises";
import { api } from "../services/api";
import type { ChairExerciseCategory, ChairFlowExercise } from "../types/app";

export type ChairFlowFilter = ChairExerciseCategory | "All";

type LoadState = "idle" | "loading" | "ready" | "error";

export function useChairFlowExercises() {
  const [exercises, setExercises] = useState<ChairFlowExercise[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");

  const refresh = useCallback(async () => {
    setLoadState("loading");

    try {
      const response = await api.getChairFlowExercises();
      setExercises(
        response.length > 0 ? response : FALLBACK_CHAIR_FLOW_EXERCISES,
      );
      setLoadState("ready");
    } catch {
      setExercises(FALLBACK_CHAIR_FLOW_EXERCISES);
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const categories = useMemo<ChairFlowFilter[]>(() => {
    const uniqueCategories = exercises.reduce<ChairExerciseCategory[]>(
      (current, exercise) =>
        current.includes(exercise.category)
          ? current
          : [...current, exercise.category],
      [],
    );

    return ["All", ...uniqueCategories];
  }, [exercises]);

  return {
    categories,
    exercises,
    isFallback: loadState === "error",
    isLoading: loadState === "loading" && exercises.length === 0,
    refresh,
  };
}
