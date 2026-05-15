import { Module } from '@nestjs/common';
import { BodyVideoRecommendationsService } from './body-video-recommendations.service';
import { ChairExercisesController } from './chair-exercises.controller';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [ChairExercisesController],
  providers: [DashboardService, BodyVideoRecommendationsService],
})
export class ExercisesModule {}
