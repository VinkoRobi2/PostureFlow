import { BadRequestException, Injectable } from '@nestjs/common';
import { Exercise, ExerciseCategory, UserProgress } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { DEMO_USER } from '../postureflow/seed-data';
import { CHAIR_FLOW_EXERCISES } from './chair-exercises.data';
import type { ChairExerciseCategory, ChairFlowExercise } from './chair-exercises.model';
import type { CompleteExerciseDto, DashboardQueryDto } from './dto/dashboard.dto';

type ExerciseWithProgress = Exercise & {
  userProgress: UserProgress[];
};

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(query: DashboardQueryDto = {}) {
    await this.ensureCatalogReady();

    const user = query.userId
      ? await this.prisma.user.findUniqueOrThrow({ where: { id: query.userId } })
      : await this.getDemoUser();

    const exercises = await this.prisma.exercise.findMany({
      include: {
        userProgress: {
          where: { userId: user.id },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    const completedCount = exercises.filter((exercise) =>
      exercise.userProgress.some((progress) => progress.completed),
    ).length;
    const totalCount = exercises.length;

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
      },
      dailyProgressPercentage:
        totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100),
      completedCount,
      totalCount,
      exercises: exercises.map((exercise) => this.serializeExercise(exercise)),
    };
  }

  async completeExercise(dto: CompleteExerciseDto) {
    await this.ensureCatalogReady();

    const user = dto.userId
      ? await this.prisma.user.findUniqueOrThrow({ where: { id: dto.userId } })
      : await this.getDemoUser();

    const exercise = await this.prisma.exercise.findUnique({
      where: { id: dto.exerciseId },
    });

    if (!exercise) {
      throw new BadRequestException('Exercise not found.');
    }

    await this.prisma.userProgress.upsert({
      where: {
        userId_exerciseId: {
          userId: user.id,
          exerciseId: dto.exerciseId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId: user.id,
        exerciseId: dto.exerciseId,
        completed: true,
        completedAt: new Date(),
      },
    });

    return this.getDashboard({ userId: user.id });
  }

  async listChairExercises(): Promise<ChairFlowExercise[]> {
    await this.ensureCatalogReady();

    const exercises = await this.prisma.exercise.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return exercises.map((exercise) => ({
      ...this.serializeExercise(exercise),
      difficulty: this.getDifficulty(exercise.category),
    }));
  }

  private async ensureCatalogReady() {
    await this.prisma.user.upsert({
      where: { email: DEMO_USER.email },
      update: {
        firstName: DEMO_USER.firstName,
        lastName: DEMO_USER.lastName,
      },
      create: DEMO_USER,
    });

    for (const exercise of CHAIR_FLOW_EXERCISES) {
      await this.prisma.exercise.upsert({
        where: { id: exercise.id },
        update: {
          title: exercise.title,
          youtubeId: exercise.youtubeId,
          startTime: exercise.startTime,
          endTime: exercise.endTime,
          category: exercise.category,
          duration: exercise.duration,
          sortOrder: exercise.sortOrder,
        },
        create: {
          id: exercise.id,
          title: exercise.title,
          youtubeId: exercise.youtubeId,
          startTime: exercise.startTime,
          endTime: exercise.endTime,
          category: exercise.category,
          duration: exercise.duration,
          sortOrder: exercise.sortOrder,
        },
      });
    }
  }

  private async getDemoUser() {
    return this.prisma.user.findUniqueOrThrow({
      where: { email: DEMO_USER.email },
    });
  }

  private serializeExercise(exercise: ExerciseWithProgress | Exercise) {
    const progress =
      'userProgress' in exercise ? exercise.userProgress[0] : undefined;

    return {
      id: exercise.id,
      title: exercise.title,
      youtubeId: exercise.youtubeId,
      startTime: exercise.startTime,
      endTime: exercise.endTime,
      category: this.getCategoryLabel(exercise.category),
      duration: exercise.duration,
      completed: Boolean(progress?.completed),
    };
  }

  private getCategoryLabel(category: ExerciseCategory): ChairExerciseCategory {
    switch (category) {
      case ExerciseCategory.UPPER_BODY:
        return 'Upper Body';
      case ExerciseCategory.LOWER_BODY:
        return 'Lower Body';
      case ExerciseCategory.FULL_FLOW:
      default:
        return 'Full Flow';
    }
  }

  private getDifficulty(category: ExerciseCategory) {
    return category === ExerciseCategory.FULL_FLOW ? 'Intermediate' : 'Beginner';
  }
}
