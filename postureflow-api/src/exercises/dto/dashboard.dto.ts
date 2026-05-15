import { IsOptional, IsString } from 'class-validator';

export class DashboardQueryDto {
  @IsOptional()
  @IsString()
  userId?: string;
}

export class CompleteExerciseDto {
  @IsString()
  exerciseId!: string;

  @IsOptional()
  @IsString()
  userId?: string;
}

export class BodyVideoRecommendationQueryDto {
  @IsOptional()
  @IsString()
  bodyPart?: string;

  @IsOptional()
  @IsString()
  targetBodyPart?: string;

  @IsOptional()
  @IsString()
  painRegionId?: string;
}
