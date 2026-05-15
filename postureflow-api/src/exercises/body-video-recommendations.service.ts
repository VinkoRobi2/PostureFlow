import { BadRequestException, Injectable } from '@nestjs/common';
import {
  BODY_PART_ALIASES,
  BODY_VIDEO_CATALOG,
  SUPPORTED_BODY_PARTS,
} from './body-video-recommendations.data';
import type {
  BodyVideoRecommendationResponse,
  RecommendedBodyVideo,
  TargetBodyPart,
} from './body-video-recommendations.model';
import type { BodyVideoRecommendationQueryDto } from './dto/dashboard.dto';

@Injectable()
export class BodyVideoRecommendationsService {
  getRecommendations(
    query: BodyVideoRecommendationQueryDto,
  ): BodyVideoRecommendationResponse {
    const requestedBodyPart =
      query.bodyPart ?? query.targetBodyPart ?? query.painRegionId;

    if (!requestedBodyPart) {
      throw new BadRequestException(
        'bodyPart, targetBodyPart, or painRegionId is required.',
      );
    }

    const normalizedBodyPart = this.resolveBodyPart(requestedBodyPart);

    if (!normalizedBodyPart) {
      throw new BadRequestException({
        message: `Unsupported body part: ${requestedBodyPart}`,
        supportedBodyParts: SUPPORTED_BODY_PARTS,
      });
    }

    const data = BODY_VIDEO_CATALOG.filter(
      (video) => video.targetBodyPart === normalizedBodyPart,
    )
      .sort((current, next) => current.sortOrder - next.sortOrder)
      .map((video) => this.serializeVideo(video));

    return {
      success: true,
      filters: {
        requestedBodyPart,
        normalizedBodyPart,
        count: data.length,
      },
      data,
    };
  }

  private resolveBodyPart(input: string): TargetBodyPart | null {
    const key = input
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s-]+/g, '_');

    return BODY_PART_ALIASES[key] ?? null;
  }

  private serializeVideo(
    video: (typeof BODY_VIDEO_CATALOG)[number],
  ): RecommendedBodyVideo {
    return {
      id: video.id,
      youtubeId: video.youtubeId,
      title: video.title,
      targetBodyPart: video.targetBodyPart,
      startTime: video.startTime,
      endTime: video.endTime,
    };
  }
}
