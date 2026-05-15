export type TargetBodyPart =
  | 'antebrazos'
  | 'brazos'
  | 'caderas'
  | 'core'
  | 'cuello'
  | 'espalda_alta'
  | 'espalda_baja'
  | 'hombros'
  | 'manos'
  | 'pantorrillas'
  | 'pecho'
  | 'piernas'
  | 'pies'
  | 'rodillas';

export type BodyVideoCatalogItem = {
  id: string;
  youtubeId: string;
  title: string;
  targetBodyPart: TargetBodyPart;
  startTime: number;
  endTime: number | null;
  sortOrder: number;
};

export type RecommendedBodyVideo = Omit<BodyVideoCatalogItem, 'sortOrder'>;

export type BodyVideoRecommendationResponse = {
  success: true;
  filters: {
    requestedBodyPart: string;
    normalizedBodyPart: TargetBodyPart;
    count: number;
  };
  data: RecommendedBodyVideo[];
};
