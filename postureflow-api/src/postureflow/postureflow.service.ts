import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  Locale,
  PainRegion,
  Prisma,
  Routine,
  RoutineCategory,
  SessionStatus,
  SetupOption,
  User,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CompleteOnboardingDto,
  CompleteSessionDto,
  DownloadRoutineDto,
  StartSessionDto,
  SyncBatchDto,
  UpdateLocaleDto,
  UpdateSessionProgressDto,
} from './dto/postureflow.dto';
import { DEMO_USER, PAIN_REGIONS, ROUTINES, SETUP_OPTIONS } from './seed-data';

type LocalizedText = {
  en: string;
  es: string;
};

@Injectable()
export class PostureFlowService {
  private seedPromise: Promise<void> | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async ensureReady() {
    await this.ensureSeeded();
  }

  async getBootstrap(locale: Locale = Locale.EN, userId?: string) {
    await this.ensureReady();

    const user = userId ? await this.getUserById(userId) : await this.getDemoUser();
    const [painRegions, setupOptions] = await Promise.all([
      this.prisma.painRegion.findMany({ orderBy: { sortOrder: 'asc' } }),
      this.prisma.setupOption.findMany({ orderBy: { sortOrder: 'asc' } }),
    ]);

    return {
      locale,
      user: this.serializeUser(user),
      onboarding: {
        totalSteps: 2,
        completed: Boolean(user.onboardingCompletedAt),
        selectedPainRegionIds: user.onboarding?.painRegionIds ?? [],
        selectedSetupOptionIds: user.onboarding?.setupOptionIds ?? [],
        painRegions: painRegions.map((region) => this.serializePainRegion(region)),
        setupOptions: setupOptions.map((option) => this.serializeSetupOption(option)),
      },
    };
  }

  async updateLocale(dto: UpdateLocaleDto) {
    await this.ensureSeeded();

    const user = await this.prisma.user.update({
      where: { id: dto.userId },
      data: { locale: dto.locale },
    });

    return {
      ok: true,
      user: this.serializeUser(user),
    };
  }

  async completeOnboarding(dto: CompleteOnboardingDto) {
    await this.ensureSeeded();
    await this.validateCatalogIds(dto.painRegionIds, dto.setupOptionIds);

    const user = await this.prisma.user.update({
      where: { id: dto.userId },
      data: {
        locale: dto.locale ?? undefined,
        onboardingCompletedAt: new Date(),
      },
    });

    await this.prisma.userOnboarding.upsert({
      where: { userId: dto.userId },
      update: {
        painRegionIds: dto.painRegionIds,
        setupOptionIds: dto.setupOptionIds,
      },
      create: {
        userId: dto.userId,
        painRegionIds: dto.painRegionIds,
        setupOptionIds: dto.setupOptionIds,
      },
    });

    const recommendedRoutine = await this.getRecommendedRoutine(
      dto.painRegionIds,
      dto.setupOptionIds,
    );

    return {
      ok: true,
      user: this.serializeUser(user),
      recommendedRoutine: this.serializeRoutine(recommendedRoutine, user.locale),
    };
  }

  async getDashboard(userId: string) {
    await this.ensureSeeded();
    const user = await this.getUserById(userId);
    const selectedPainRegionIds = user.onboarding?.painRegionIds ?? ['neck'];
    const selectedSetupOptionIds = user.onboarding?.setupOptionIds ?? ['laptop'];
    const [rankedRoutines, selectedPainRegions] = await Promise.all([
      this.getRankedRoutines(selectedPainRegionIds, selectedSetupOptionIds),
      this.prisma.painRegion.findMany({
        where: { id: { in: selectedPainRegionIds } },
        orderBy: { sortOrder: 'asc' },
      }),
    ]);
    const recommendedRoutine = rankedRoutines[0];
    const quickLibraryItems = rankedRoutines.slice(1, 3);
    const downloadedRoutineIds = new Set(
      user.routineDownloads.map((download) => download.routineId),
    );
    const nextBreak = user.nextBreakAt ?? this.createNextBreakAt();
    const tensionValue = this.calculateTensionIndex(
      selectedPainRegionIds,
      selectedSetupOptionIds,
    );
    const previewImageUrls = rankedRoutines
      .slice(0, 3)
      .map((routine) => routine.imageUrl);

    return {
      user: this.serializeUser(user),
      systemStatus: {
        label: this.localized('SYSTEM_ACTIVE', 'SISTEMA_ACTIVO'),
        operatorBadge: this.getUserBadge(user),
      },
      header: {
        greetingName: user.firstName,
        tagline: {
          en: 'Adaptive recovery queue ready.',
          es: 'Cola adaptativa de recuperacion lista.',
        },
        offlineReady: downloadedRoutineIds.size > 0,
      },
      featuredRoutine: this.serializeDashboardRoutine(
        recommendedRoutine,
        user.locale,
        this.localized('Suggested Protocol', 'Protocolo Sugerido'),
        previewImageUrls,
      ),
      tensionIndex: {
        label: this.localized('Tension Index', 'Indice de Tension'),
        value: tensionValue,
        progress: tensionValue / 100,
      },
      criticalZones: {
        label: this.localized('Critical Zones', 'Zonas Criticas'),
        count: selectedPainRegionIds.length,
        regionLabels: selectedPainRegions.map((region) =>
          this.localized(region.nameEn, region.nameEs),
        ),
      },
      quickLibrary: {
        label: this.localized('Quick Library', 'Libreria Rapida'),
        items: quickLibraryItems.map((routine) =>
          this.serializeDashboardRoutine(
            routine,
            user.locale,
            this.localized('Recommended', 'Recomendada'),
            [routine.imageUrl],
          ),
        ),
      },
      streak: {
        days: user.streakCount,
        label: {
          en: 'Your streak',
          es: 'Tu racha',
        },
        caption: {
          en: 'Consistent flow.',
          es: 'Flujo constante.',
        },
      },
      muscleState: {
        title: {
          en: 'Muscle State',
          es: 'Estado Muscular',
        },
        highlightedPainRegionId: selectedPainRegionIds[0],
      },
      breakTimer: {
        label: {
          en: 'Next break in',
          es: 'Proxima pausa en',
        },
        remainingMinutes: 45,
        displayValue: '45:00',
        progress: 0.25,
      },
      teamUpsell: this.getPaywall(),
    };
  }

  async getLibrary(userId: string) {
    await this.ensureSeeded();
    const user = await this.getUserById(userId);
    const routines = await this.prisma.routine.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    const downloadedRoutineIds = new Set(
      user.routineDownloads.map((download) => download.routineId),
    );
    const usedMb = routines.reduce((total, routine) => {
      return downloadedRoutineIds.has(routine.id) ? total + routine.sizeMb : total;
    }, 0);

    return {
      storage: {
        usedMb,
        totalMb: 500,
      },
      routines: routines.map((routine) => ({
        ...this.serializeRoutine(routine, user.locale),
        downloaded: downloadedRoutineIds.has(routine.id),
      })),
    };
  }

  async downloadRoutine(dto: DownloadRoutineDto) {
    await this.ensureSeeded();
    await this.getUserById(dto.userId);
    await this.getRoutineById(dto.routineId);

    await this.prisma.userRoutineDownload.upsert({
      where: {
        userId_routineId: {
          userId: dto.userId,
          routineId: dto.routineId,
        },
      },
      update: {
        downloadedAt: new Date(),
        source: dto.source ?? 'library',
      },
      create: {
        userId: dto.userId,
        routineId: dto.routineId,
        source: dto.source ?? 'library',
      },
    });

    return this.getLibrary(dto.userId);
  }

  getPaywall() {
    return {
      brand: {
        en: 'PostureFlow Teams',
        es: 'PostureFlow Teams',
      },
      headline: {
        en: 'Bring ergonomics to your entire team.',
        es: 'Lleva la ergonomia a todo tu equipo.',
      },
      features: [
        {
          icon: 'ShieldCheck',
          text: {
            en: 'Managed team licenses',
            es: 'Licencias administrables',
          },
        },
        {
          icon: 'Zap',
          text: {
            en: 'Slack and Teams integrations',
            es: 'Integracion con Slack y Teams',
          },
        },
        {
          icon: 'Check',
          text: {
            en: 'Workplace health reports',
            es: 'Reportes de salud laboral',
          },
        },
      ],
      pricing: {
        planName: {
          en: 'Enterprise Plan',
          es: 'Plan Enterprise',
        },
        pricePerSeat: 8,
        unit: {
          en: '/ user / month',
          es: '/ usuario / mes',
        },
        cta: {
          en: 'Contact Sales',
          es: 'Contactar Ventas',
        },
        secondaryCta: {
          en: 'Enter company code (B2B)',
          es: 'Ingresar codigo de empresa (B2B)',
        },
      },
    };
  }

  async startSession(dto: StartSessionDto) {
    await this.ensureSeeded();
    const [user, routine] = await Promise.all([
      this.getUserById(dto.userId),
      this.getRoutineById(dto.routineId),
    ]);

    const session = await this.prisma.routineSession.create({
      data: {
        userId: dto.userId,
        routineId: dto.routineId,
        localeAtStart: dto.locale,
      },
    });

    return {
      sessionId: session.id,
      routine: this.serializePlayerRoutine(routine, user.locale),
    };
  }

  async updateSessionProgress(sessionId: string, dto: UpdateSessionProgressDto) {
    await this.ensureSeeded();

    const session = await this.prisma.routineSession.update({
      where: { id: sessionId },
      data: {
        progress: dto.progress,
      },
    });

    return {
      ok: true,
      sessionId: session.id,
      progress: session.progress,
    };
  }

  async completeSession(sessionId: string, dto: CompleteSessionDto) {
    await this.ensureSeeded();

    if (sessionId === 'offline') {
      const routineId = dto.routineId;
      if (!routineId) {
        throw new BadRequestException('Offline completion requires a routineId.');
      }

      return this.completeOfflineSession(dto.userId, routineId, dto.locale, dto.completedAt);
    }

    const session = await this.prisma.routineSession.findUnique({
      where: { id: sessionId },
      include: { routine: true, user: true },
    });

    if (!session) {
      throw new NotFoundException('Routine session not found.');
    }

    const completedAt = dto.completedAt ? new Date(dto.completedAt) : new Date();

    const [updatedSession] = await this.prisma.$transaction([
      this.prisma.routineSession.update({
        where: { id: sessionId },
        data: {
          status: SessionStatus.COMPLETED,
          progress: 100,
          completedAt,
        },
        include: {
          routine: true,
          user: true,
        },
      }),
      this.prisma.user.update({
        where: { id: dto.userId },
        data: this.getStreakUpdate(session.user.lastFlowCompletedAt),
      }),
    ]);

    return {
      ok: true,
      summary: this.serializeCompletionSummary(updatedSession.routine, dto.locale),
    };
  }

  async sync(dto: SyncBatchDto) {
    await this.ensureSeeded();
    const results: Array<Record<string, unknown>> = [];

    for (const event of dto.events) {
      const payload = event.payload as Record<string, unknown>;
      await this.prisma.syncLog.create({
        data: {
          userId: dto.userId,
          eventType: event.type,
          payload: payload as Prisma.InputJsonValue,
        },
      });

      switch (event.type) {
        case 'SET_LOCALE':
          results.push(
            await this.updateLocale({
              userId: dto.userId,
              locale: payload.locale as Locale,
            }),
          );
          break;
        case 'COMPLETE_ONBOARDING':
          results.push(
            await this.completeOnboarding({
              userId: dto.userId,
              locale: payload.locale as Locale,
              painRegionIds: payload.painRegionIds as string[],
              setupOptionIds: payload.setupOptionIds as string[],
            }),
          );
          break;
        case 'DOWNLOAD_ROUTINE':
          results.push(
            await this.downloadRoutine({
              userId: dto.userId,
              routineId: payload.routineId as string,
              source: 'sync',
            }),
          );
          break;
        case 'COMPLETE_SESSION':
          results.push(
            await this.completeSession('offline', {
              userId: dto.userId,
              locale: (payload.locale as Locale) ?? Locale.EN,
              routineId: payload.routineId as string,
              completedAt: payload.completedAt as string | undefined,
            }),
          );
          break;
        default:
          throw new BadRequestException(`Unsupported sync event: ${event.type}`);
      }
    }

    return {
      ok: true,
      processed: results.length,
      results,
    };
  }

  private async completeOfflineSession(
    userId: string,
    routineId: string,
    locale: Locale,
    completedAt?: string,
  ) {
    const [user, routine] = await Promise.all([
      this.getUserById(userId),
      this.getRoutineById(routineId),
    ]);

    await this.prisma.$transaction([
      this.prisma.routineSession.create({
        data: {
          userId,
          routineId,
          localeAtStart: locale,
          progress: 100,
          status: SessionStatus.COMPLETED,
          completedAt: completedAt ? new Date(completedAt) : new Date(),
        },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: this.getStreakUpdate(user.lastFlowCompletedAt),
      }),
    ]);

    return {
      ok: true,
      summary: this.serializeCompletionSummary(routine, locale),
    };
  }

  private async ensureSeeded() {
    if (!this.seedPromise) {
      this.seedPromise = this.seedCatalog().catch((error) => {
        this.seedPromise = null;
        throw new InternalServerErrorException(
          `Failed to seed catalog: ${String(error)}`,
        );
      });
    }

    await this.seedPromise;
  }

  private async seedCatalog() {
    await this.prisma.user.upsert({
      where: { email: DEMO_USER.email },
      update: {
        firstName: DEMO_USER.firstName,
        lastName: DEMO_USER.lastName,
        nextBreakAt: this.createNextBreakAt(),
      },
      create: {
        ...DEMO_USER,
        nextBreakAt: this.createNextBreakAt(),
      },
    });

    for (const region of PAIN_REGIONS) {
      await this.prisma.painRegion.upsert({
        where: { id: region.id },
        update: region,
        create: region,
      });
    }

    for (const option of SETUP_OPTIONS) {
      await this.prisma.setupOption.upsert({
        where: { id: option.id },
        update: option,
        create: option,
      });
    }

    for (const routine of ROUTINES) {
      const routineInput = {
        ...routine,
        targetPainRegionIds: [...routine.targetPainRegionIds],
        targetSetupOptionIds: [...routine.targetSetupOptionIds],
      };

      await this.prisma.routine.upsert({
        where: { slug: routine.slug },
        update: routineInput,
        create: routineInput,
      });
    }
  }

  private async validateCatalogIds(
    painRegionIds: string[],
    setupOptionIds: string[],
  ) {
    const [painCount, setupCount] = await Promise.all([
      this.prisma.painRegion.count({
        where: { id: { in: painRegionIds } },
      }),
      this.prisma.setupOption.count({
        where: { id: { in: setupOptionIds } },
      }),
    ]);

    if (painCount !== painRegionIds.length || setupCount !== setupOptionIds.length) {
      throw new BadRequestException('One or more onboarding selections are invalid.');
    }
  }

  private async getDemoUser() {
    return this.prisma.user.findUniqueOrThrow({
      where: { email: DEMO_USER.email },
      include: {
        onboarding: true,
        routineDownloads: true,
      },
    });
  }

  private async getUserById(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        onboarding: true,
        routineDownloads: true,
      },
    });
  }

  private async getRoutineById(routineId: string) {
    return this.prisma.routine.findUniqueOrThrow({
      where: { id: routineId },
    });
  }

  private async getRecommendedRoutine(
    painRegionIds: string[],
    setupOptionIds: string[],
  ) {
    const ranked = await this.getRankedRoutines(painRegionIds, setupOptionIds);
    return ranked[0];
  }

  private async getRankedRoutines(
    painRegionIds: string[],
    setupOptionIds: string[],
  ) {
    const routines = await this.prisma.routine.findMany({
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }],
    });

    const scored = routines.map((routine) => {
      const painMatches = routine.targetPainRegionIds.filter((id) =>
        painRegionIds.includes(id),
      ).length;
      const setupMatches = routine.targetSetupOptionIds.filter((id) =>
        setupOptionIds.includes(id),
      ).length;
      return {
        routine,
        score: painMatches * 3 + setupMatches * 2 + (routine.featured ? 1 : 0),
      };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.routine);
  }

  private serializeUser(user: User & { onboarding?: { painRegionIds: string[]; setupOptionIds: string[] } | null }) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      emailVerified: Boolean(user.emailVerifiedAt),
      locale: user.locale,
      onboardingCompleted: Boolean(user.onboardingCompletedAt),
      streakCount: user.streakCount,
      painRegionIds: user.onboarding?.painRegionIds ?? [],
      setupOptionIds: user.onboarding?.setupOptionIds ?? [],
    };
  }

  private serializePainRegion(region: PainRegion) {
    return {
      id: region.id,
      label: this.localized(region.nameEn, region.nameEs),
      shape: region.shape,
      cx: region.cx,
      cy: region.cy,
      radius: region.radius,
      radiusX: region.radiusX,
      radiusY: region.radiusY,
    };
  }

  private serializeSetupOption(option: SetupOption) {
    return {
      id: option.id,
      title: this.localized(option.titleEn, option.titleEs),
      description: this.localized(option.descriptionEn, option.descriptionEs),
      icon: option.icon,
    };
  }

  private serializeRoutine(routine: Routine, locale: Locale) {
    return {
      id: routine.id,
      slug: routine.slug,
      title: this.localized(routine.titleEn, routine.titleEs),
      subtitle: this.localized(routine.subtitleEn, routine.subtitleEs),
      description: this.localized(routine.descriptionEn, routine.descriptionEs),
      imageUrl: routine.imageUrl,
      durationMinutes: routine.durationMinutes,
      durationLabel: this.localized(
        `${routine.durationMinutes} min`,
        `${routine.durationMinutes} min`,
      ),
      sizeMb: routine.sizeMb,
      sizeLabel: `${routine.sizeMb} MB`,
      cta: this.localized('Start Flow', 'Iniciar Flujo'),
      locale,
    };
  }

  private serializeDashboardRoutine(
    routine: Routine,
    locale: Locale,
    badge: LocalizedText,
    previewImageUrls: string[],
  ) {
    return {
      ...this.serializeRoutine(routine, locale),
      badge,
      categoryLabel: this.getRoutineCategoryLabel(routine.category),
      previewImageUrls,
    };
  }

  private serializePlayerRoutine(routine: Routine, locale: Locale) {
    const tip = routine.slug === 'deep-cervical-decompression'
      ? this.localized(
          'Hold the lower edge of your chair and keep your chin neutral.',
          'Sujeta el borde inferior de tu silla y manten la barbilla neutra.',
        )
      : this.localized(
          'Move slowly and let your shoulders stay heavy.',
          'Muevete lento y deja caer el peso de tus hombros.',
        );

    return {
      ...this.serializeRoutine(routine, locale),
      repetitionsLabel: this.localized('Rep 1 of 3', 'Rep 1 de 3'),
      tipTitle: this.localized('Position', 'Posicion'),
      tipBody: tip,
      totalDurationSeconds: routine.durationMinutes * 60,
    };
  }

  private serializeCompletionSummary(routine: Routine, locale: Locale) {
    const title =
      locale === Locale.ES
        ? 'Flujo Completado'
        : 'Flow Completed';

    const benefits =
      routine.slug === 'lumbar-reset'
        ? [
            this.localized('Lower back is unloading with more ease.', 'Espalda baja descargada con mas soltura.'),
            this.localized('Pelvis and hips feel more mobile.', 'Pelvis y caderas con mas movilidad.'),
          ]
        : [
            this.localized('Back is 20% more aligned.', 'Espalda 20% mas alineada.'),
            this.localized('Joints feel lubricated and lighter.', 'Articulaciones lubricadas y mas ligeras.'),
          ];

    return {
      title,
      benefits,
      cta: this.localized('Back to Dashboard', 'Volver al Dashboard'),
    };
  }

  private localized(en: string, es: string): LocalizedText {
    return { en, es };
  }

  private getRoutineCategoryLabel(category: RoutineCategory) {
    switch (category) {
      case 'RECOVERY':
        return this.localized('Recovery', 'Recuperacion');
      case 'MOBILITY':
        return this.localized('Preventive', 'Preventivo');
      case 'BREATHWORK':
        return this.localized('Reset', 'Reset');
      case 'RELIEF':
      default:
        return this.localized('Focus', 'Enfoque');
    }
  }

  private calculateTensionIndex(
    painRegionIds: string[],
    setupOptionIds: string[],
  ) {
    return Math.min(
      96,
      18 + painRegionIds.length * 12 + (setupOptionIds.length > 0 ? 8 : 0),
    );
  }

  private getUserBadge(user: User) {
    return `${(user.firstName?.[0] ?? 'A').toUpperCase()}${(
      user.lastName?.[0] ?? 'L'
    ).toUpperCase()}`;
  }

  private createNextBreakAt() {
    return new Date(Date.now() + 45 * 60 * 1000);
  }

  private getStreakUpdate(lastFlowCompletedAt: Date | null) {
    const today = new Date();

    if (!lastFlowCompletedAt) {
      return {
        streakCount: 1,
        lastFlowCompletedAt: today,
      };
    }

    const previous = new Date(lastFlowCompletedAt);
    const previousDay = new Date(previous.getFullYear(), previous.getMonth(), previous.getDate());
    const currentDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffInDays = Math.round(
      (currentDay.getTime() - previousDay.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays <= 0) {
      return {
        lastFlowCompletedAt: today,
      };
    }

    return {
      streakCount: diffInDays === 1 ? { increment: 1 } : 1,
      lastFlowCompletedAt: today,
    };
  }
}
