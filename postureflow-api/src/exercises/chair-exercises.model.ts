import { ExerciseCategory } from '@prisma/client';

export type ChairExerciseCategory = 'Upper Body' | 'Lower Body' | 'Full Flow';

export type ChairExerciseDifficulty = 'Beginner' | 'Intermediate';

export type ChairFlowExerciseSeed = {
  id: string;
  title: string;
  duration: string;
  difficulty: ChairExerciseDifficulty;
  youtubeId: string;
  startTime: number;
  endTime: number;
  category: ExerciseCategory;
  sortOrder: number;
};

export type ChairFlowExercise = {
  id: string;
  title: string;
  duration: string;
  difficulty: ChairExerciseDifficulty;
  youtubeId: string;
  startTime: number;
  endTime: number;
  category: ChairExerciseCategory;
};
