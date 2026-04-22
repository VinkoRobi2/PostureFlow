import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Locale } from '@prisma/client';

export class UpdateLocaleDto {
  @IsString()
  userId!: string;

  @IsEnum(Locale)
  locale!: Locale;
}

export class CompleteOnboardingDto {
  @IsString()
  userId!: string;

  @IsEnum(Locale)
  @IsOptional()
  locale?: Locale;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(14)
  @IsString({ each: true })
  painRegionIds!: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  setupOptionIds!: string[];
}

export class DownloadRoutineDto {
  @IsString()
  userId!: string;

  @IsString()
  routineId!: string;

  @IsString()
  @IsOptional()
  source?: string;
}

export class StartSessionDto {
  @IsString()
  userId!: string;

  @IsString()
  routineId!: string;

  @IsEnum(Locale)
  locale!: Locale;
}

export class UpdateSessionProgressDto {
  @IsInt()
  @Min(0)
  @Max(100)
  progress!: number;
}

export class CompleteSessionDto {
  @IsString()
  userId!: string;

  @IsEnum(Locale)
  locale!: Locale;

  @IsOptional()
  @IsString()
  routineId?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;
}

export class SyncEventDto {
  @IsString()
  type!: string;

  @IsObject()
  payload!: Record<string, unknown>;
}

export class SyncBatchDto {
  @IsString()
  userId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncEventDto)
  events!: SyncEventDto[];
}
