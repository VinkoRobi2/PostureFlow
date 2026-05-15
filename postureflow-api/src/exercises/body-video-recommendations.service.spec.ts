import { BadRequestException } from '@nestjs/common';
import { BodyVideoRecommendationsService } from './body-video-recommendations.service';

describe('BodyVideoRecommendationsService', () => {
  let service: BodyVideoRecommendationsService;

  beforeEach(() => {
    service = new BodyVideoRecommendationsService();
  });

  it('returns videos filtered by a Spanish body part', () => {
    const response = service.getRecommendations({ bodyPart: 'cuello' });

    expect(response.success).toBe(true);
    expect(response.filters.normalizedBodyPart).toBe('cuello');
    expect(response.filters.count).toBeGreaterThan(0);
    expect(
      response.data.every((video) => video.targetBodyPart === 'cuello'),
    ).toBe(true);
  });

  it('accepts onboarding pain region ids as aliases', () => {
    const response = service.getRecommendations({ painRegionId: 'lower_back' });

    expect(response.filters.normalizedBodyPart).toBe('espalda_baja');
    expect(
      response.data.every((video) => video.targetBodyPart === 'espalda_baja'),
    ).toBe(true);
  });

  it('keeps whole-video recommendations with endTime null', () => {
    const response = service.getRecommendations({ bodyPart: 'espalda_baja' });

    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'lower-back-complete-video',
          startTime: 0,
          endTime: null,
        }),
      ]),
    );
  });

  it('rejects requests without a body part', () => {
    expect(() => service.getRecommendations({})).toThrow(BadRequestException);
  });
});
