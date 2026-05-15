import { ExerciseCategory } from '@prisma/client';
import type { ChairFlowExerciseSeed } from './chair-exercises.model';

export const CHAIR_FLOW_EXERCISES: ChairFlowExerciseSeed[] = [
  {
    id: 'chair-breath-posture-reset',
    title: 'Seated Breath and Posture Reset',
    duration: '3:51',
    difficulty: 'Beginner',
    youtubeId: 'UCTjyqX_vZ0',
    startTime: 12,
    endTime: 42,
    category: ExerciseCategory.UPPER_BODY,
    sortOrder: 1,
  },
  {
    id: 'chair-upper-body-flow',
    title: 'Chair Tai Chi Upper Body Flow',
    duration: '5:00',
    difficulty: 'Beginner',
    youtubeId: 'PMXleOOpYjo',
    startTime: 24,
    endTime: 58,
    category: ExerciseCategory.UPPER_BODY,
    sortOrder: 2,
  },
  {
    id: 'chair-lower-body-foundation',
    title: 'Seated Lower Body Foundation',
    duration: '3:51',
    difficulty: 'Beginner',
    youtubeId: '7nUePhUPZJk',
    startTime: 18,
    endTime: 52,
    category: ExerciseCategory.LOWER_BODY,
    sortOrder: 3,
  },
  {
    id: 'chair-complete-form',
    title: 'Seated Tai Chi Complete Flow',
    duration: '3:21',
    difficulty: 'Intermediate',
    youtubeId: '-dzJZriroQA',
    startTime: 31,
    endTime: 72,
    category: ExerciseCategory.FULL_FLOW,
    sortOrder: 4,
  },
];
