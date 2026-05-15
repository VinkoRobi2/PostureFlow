import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BodyVideoRecommendationsService } from './body-video-recommendations.service';
import { DashboardService } from './dashboard.service';
import {
  BodyVideoRecommendationQueryDto,
  CompleteExerciseDto,
  DashboardQueryDto,
} from './dto/dashboard.dto';

@Controller('api')
export class ChairExercisesController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly bodyVideoRecommendationsService: BodyVideoRecommendationsService,
  ) {}

  @Get('dashboard')
  getDashboard(@Query() query: DashboardQueryDto) {
    return this.dashboardService.getDashboard(query);
  }

  @Post('complete-exercise')
  completeExercise(@Body() dto: CompleteExerciseDto) {
    return this.dashboardService.completeExercise(dto);
  }

  @Get('exercises/chair')
  getChairExercises() {
    return this.dashboardService.listChairExercises();
  }

  @Get('videos/recommendations')
  getVideoRecommendations(@Query() query: BodyVideoRecommendationQueryDto) {
    return this.bodyVideoRecommendationsService.getRecommendations(query);
  }
}
