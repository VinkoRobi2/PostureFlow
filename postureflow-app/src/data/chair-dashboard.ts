import type { ChairDashboardResponse } from "../types/app";

const fallbackExercises = [
  {
    id: "chair-breath-posture-reset",
    title: "Seated Breath and Posture Reset",
    youtubeId: "UCTjyqX_vZ0",
    startTime: 12,
    endTime: 42,
    category: "Upper Body",
    duration: "3:51",
  },
  {
    id: "chair-upper-body-flow",
    title: "Chair Tai Chi Upper Body Flow",
    youtubeId: "PMXleOOpYjo",
    startTime: 24,
    endTime: 58,
    category: "Upper Body",
    duration: "5:00",
  },
  {
    id: "chair-lower-body-foundation",
    title: "Seated Lower Body Foundation",
    youtubeId: "7nUePhUPZJk",
    startTime: 18,
    endTime: 52,
    category: "Lower Body",
    duration: "3:51",
  },
  {
    id: "chair-complete-form",
    title: "Seated Tai Chi Complete Flow",
    youtubeId: "-dzJZriroQA",
    startTime: 31,
    endTime: 72,
    category: "Full Flow",
    duration: "3:21",
  },
] as const;

export function createFallbackChairDashboard(
  completedExerciseIds: string[] = [],
): ChairDashboardResponse {
  const exercises = fallbackExercises.map((exercise) => ({
    ...exercise,
    completed: completedExerciseIds.includes(exercise.id),
  }));
  const completedCount = exercises.filter((exercise) => exercise.completed).length;

  return {
    user: {
      id: "demo-user-alex",
      firstName: "Alex",
    },
    completedCount,
    dailyProgressPercentage: Math.round(
      (completedCount / Math.max(exercises.length, 1)) * 100,
    ),
    exercises,
    totalCount: exercises.length,
  };
}
