import { useCallback, useEffect, useState } from "react";
import { createFallbackChairDashboard } from "../data/chair-dashboard";
import { api } from "../services/api";
import type { ChairDashboardResponse } from "../types/app";

type LoadState = "idle" | "loading" | "ready" | "error";

export function useChairDashboard() {
  const [dashboard, setDashboard] = useState<ChairDashboardResponse>(
    createFallbackChairDashboard(),
  );
  const [loadState, setLoadState] = useState<LoadState>("idle");

  const refresh = useCallback(async () => {
    setLoadState("loading");

    try {
      const response = await api.getChairDashboard();
      setDashboard(response);
      setLoadState("ready");
    } catch {
      setDashboard((current) =>
        createFallbackChairDashboard(
          current.exercises
            .filter((exercise) => exercise.completed)
            .map((exercise) => exercise.id),
        ),
      );
      setLoadState("error");
    }
  }, []);

  const completeExercise = useCallback(
    async (exerciseId: string) => {
      const optimisticDashboard = markExerciseCompleted(dashboard, exerciseId);
      setDashboard(optimisticDashboard);

      try {
        const response = await api.completeChairExercise(
          exerciseId,
          dashboard.user.id,
        );
        setDashboard(response);
      } catch {
        setDashboard(optimisticDashboard);
      }
    },
    [dashboard],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    completeExercise,
    dashboard,
    isFallback: loadState === "error",
    isLoading: loadState === "loading" && dashboard.exercises.length === 0,
    isRefreshing: loadState === "loading",
    refresh,
  };
}

function markExerciseCompleted(
  dashboard: ChairDashboardResponse,
  exerciseId: string,
): ChairDashboardResponse {
  const exercises = dashboard.exercises.map((exercise) =>
    exercise.id === exerciseId ? { ...exercise, completed: true } : exercise,
  );
  const completedCount = exercises.filter((exercise) => exercise.completed).length;

  return {
    ...dashboard,
    completedCount,
    dailyProgressPercentage: Math.round(
      (completedCount / Math.max(exercises.length, 1)) * 100,
    ),
    exercises,
  };
}
