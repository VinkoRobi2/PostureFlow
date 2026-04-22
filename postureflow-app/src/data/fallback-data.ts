import {
  BootstrapResponse,
  DashboardResponse,
  DashboardRoutineRecommendation,
  LibraryResponse,
  LocaleCode,
  LocalizedText,
  PaywallResponse,
  RoutineCard,
  UserSummary,
} from "../types/app";
import { toBackendLocale } from "../utils/localize";

const FALLBACK_USER_ID = "demo-user-alex";

const FALLBACK_PAIN_REGIONS = [
  {
    id: "neck",
    label: { en: "Neck", es: "Cuello" },
    shape: "circle",
    cx: 100,
    cy: 60,
    radius: 25,
    radiusX: null,
    radiusY: null,
  },
  {
    id: "shoulders",
    label: { en: "Shoulders", es: "Hombros" },
    shape: "ellipse",
    cx: 100,
    cy: 110,
    radius: null,
    radiusX: 70,
    radiusY: 20,
  },
  {
    id: "chest",
    label: { en: "Chest", es: "Pecho" },
    shape: "ellipse",
    cx: 100,
    cy: 145,
    radius: null,
    radiusX: 42,
    radiusY: 24,
  },
  {
    id: "arms",
    label: { en: "Arms", es: "Brazos" },
    shape: "ellipse",
    cx: 100,
    cy: 180,
    radius: null,
    radiusX: 78,
    radiusY: 28,
  },
  {
    id: "forearms",
    label: { en: "Forearms", es: "Antebrazos" },
    shape: "ellipse",
    cx: 100,
    cy: 220,
    radius: null,
    radiusX: 86,
    radiusY: 22,
  },
  {
    id: "hands",
    label: { en: "Hands", es: "Manos" },
    shape: "ellipse",
    cx: 100,
    cy: 255,
    radius: null,
    radiusX: 90,
    radiusY: 18,
  },
  {
    id: "core",
    label: { en: "Core", es: "Core" },
    shape: "ellipse",
    cx: 100,
    cy: 220,
    radius: null,
    radiusX: 34,
    radiusY: 38,
  },
  {
    id: "upper_back",
    label: { en: "Upper Back", es: "Espalda Alta" },
    shape: "ellipse",
    cx: 100,
    cy: 160,
    radius: null,
    radiusX: 45,
    radiusY: 35,
  },
  {
    id: "lower_back",
    label: { en: "Lower Back", es: "Lumbares" },
    shape: "ellipse",
    cx: 100,
    cy: 230,
    radius: null,
    radiusX: 40,
    radiusY: 35,
  },
  {
    id: "hips",
    label: { en: "Hips", es: "Caderas" },
    shape: "ellipse",
    cx: 100,
    cy: 290,
    radius: null,
    radiusX: 50,
    radiusY: 25,
  },
  {
    id: "legs",
    label: { en: "Legs", es: "Piernas" },
    shape: "ellipse",
    cx: 100,
    cy: 360,
    radius: null,
    radiusX: 52,
    radiusY: 34,
  },
  {
    id: "knees",
    label: { en: "Knees", es: "Rodillas" },
    shape: "ellipse",
    cx: 100,
    cy: 420,
    radius: null,
    radiusX: 40,
    radiusY: 20,
  },
  {
    id: "calves",
    label: { en: "Calves", es: "Pantorrillas" },
    shape: "ellipse",
    cx: 100,
    cy: 475,
    radius: null,
    radiusX: 38,
    radiusY: 28,
  },
  {
    id: "feet",
    label: { en: "Feet", es: "Pies" },
    shape: "ellipse",
    cx: 100,
    cy: 540,
    radius: null,
    radiusX: 42,
    radiusY: 18,
  },
] as const;

const FALLBACK_SETUP_OPTIONS = [
  {
    id: "deep_focus",
    title: { en: "Deep Focus (The Zone)", es: "Deep Focus (La Zona)" },
    description: {
      en: "Physical tension but high mental energy. Fast-paced flow.",
      es: "Tension fisica pero energia mental alta. Flujo de ritmo rapido.",
    },
    icon: "Cpu",
  },
  {
    id: "digital_fatigue",
    title: { en: "Digital Fatigue", es: "Fatiga Digital" },
    description: {
      en: "Eye strain and mental fog. Focus on slow movements and ocular relief.",
      es: "Fatiga visual y niebla mental. Prioriza movimientos lentos y alivio ocular.",
    },
    icon: "Eye",
  },
  {
    id: "burnout",
    title: { en: "End of Shift / Burnout", es: "Fin de Turno / Burnout" },
    description: {
      en: "Full body exhaustion. Pure restorative and grounding session.",
      es: "Agotamiento corporal completo. Sesion puramente restaurativa y de aterrizaje.",
    },
    icon: "BatteryLow",
  },
] as const;

const FALLBACK_ROUTINES: RoutineCard[] = [
  {
    id: "routine-deep-cervical-decompression",
    slug: "deep-cervical-decompression",
    title: {
      en: "Deep Cervical Decompression",
      es: "Descompresion Cervical Profunda",
    },
    subtitle: { en: "Daily recommendation", es: "Sugerencia diaria" },
    description: {
      en: "Chair-based release for neck and shoulder tension.",
      es: "Liberacion en silla para cuello y hombros.",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1622131243631-1cf9ff4a8b9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB3ZWxsbmVzcyUyMGluc3RydWN0b3J8ZW58MXx8fHwxNzc2ODExMTMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    durationMinutes: 4,
    durationLabel: { en: "4 min", es: "4 min" },
    sizeMb: 12,
    sizeLabel: "12 MB",
    cta: { en: "Start Flow", es: "Iniciar Flujo" },
    locale: "EN",
    downloaded: true,
  },
  {
    id: "routine-lumbar-reset",
    slug: "lumbar-reset",
    title: { en: "Lumbar Reset", es: "Reseteo Lumbar" },
    subtitle: { en: "Desk decompression", es: "Descompresion de escritorio" },
    description: {
      en: "A seated sequence for pelvic tilt and lower back relief.",
      es: "Secuencia sentada para aliviar pelvis y espalda baja.",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9ufGVufDB8fHx8MTY5OTMwOTM1M3ww&ixlib=rb-4.0.3&q=80&w=400",
    durationMinutes: 5,
    durationLabel: { en: "5 min", es: "5 min" },
    sizeMb: 18,
    sizeLabel: "18 MB",
    cta: { en: "Start Flow", es: "Iniciar Flujo" },
    locale: "EN",
    downloaded: false,
  },
  {
    id: "routine-chest-opening",
    slug: "chest-opening",
    title: { en: "Chest Opening Reset", es: "Apertura de Pecho" },
    subtitle: { en: "Upper-back mobility", es: "Movilidad toracica" },
    description: {
      en: "Undo rounded shoulders with thoracic opening.",
      es: "Revierte hombros cerrados con apertura toracica.",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9ufGVufDB8fHx8MTY5OTMwOTM1M3ww&ixlib=rb-4.0.3&q=80&w=400",
    durationMinutes: 4,
    durationLabel: { en: "4 min", es: "4 min" },
    sizeMb: 15,
    sizeLabel: "15 MB",
    cta: { en: "Start Flow", es: "Iniciar Flujo" },
    locale: "EN",
    downloaded: false,
  },
  {
    id: "routine-flight-mode-calm",
    slug: "flight-mode-calm",
    title: { en: "Flight Mode Calm", es: "Modo Avion Calmante" },
    subtitle: { en: "Breath-led recovery", es: "Recuperacion con respiracion" },
    description: {
      en: "Breathwork for stress and mental reset while seated.",
      es: "Respiracion guiada para bajar estres y resetear la mente.",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9ufGVufDB8fHx8MTY5OTMwOTM1M3ww&ixlib=rb-4.0.3&q=80&w=400",
    durationMinutes: 3,
    durationLabel: { en: "3 min", es: "3 min" },
    sizeMb: 10,
    sizeLabel: "10 MB",
    cta: { en: "Start Flow", es: "Iniciar Flujo" },
    locale: "EN",
    downloaded: false,
  },
];

function localized(en: string, es: string): LocalizedText {
  return { en, es };
}

function getRoutineCategoryLabel(slug: string): LocalizedText {
  if (slug.includes("lumbar")) {
    return localized("Recovery", "Recuperacion");
  }

  if (slug.includes("chest")) {
    return localized("Preventive", "Preventivo");
  }

  if (slug.includes("flight")) {
    return localized("Reset", "Reset");
  }

  return localized("Focus", "Enfoque");
}

function scoreRoutine(routine: RoutineCard, painRegionIds: string[]) {
  let score = 1;

  if (painRegionIds.includes("neck") && routine.slug.includes("cervical")) {
    score += 6;
  }

  if (
    painRegionIds.some((region) => ["lower_back", "hips", "core", "legs"].includes(region)) &&
    routine.slug.includes("lumbar")
  ) {
    score += 6;
  }

  if (
    painRegionIds.some((region) => ["shoulders", "upper_back", "chest", "arms"].includes(region)) &&
    routine.slug.includes("chest")
  ) {
    score += 5;
  }

  if (routine.slug.includes("flight")) {
    score += Math.max(0, painRegionIds.length - 1);
  }

  return score;
}

function getRankedFallbackRoutines(painRegionIds: string[]) {
  return [...FALLBACK_ROUTINES].sort(
    (left, right) => scoreRoutine(right, painRegionIds) - scoreRoutine(left, painRegionIds),
  );
}

function toDashboardRoutine(
  routine: RoutineCard,
  locale: LocaleCode,
  previewImageUrls: string[],
  badge: LocalizedText,
): DashboardRoutineRecommendation {
  return {
    ...routine,
    locale: toBackendLocale(locale),
    badge,
    categoryLabel: getRoutineCategoryLabel(routine.slug),
    previewImageUrls,
  };
}

export function createFallbackPaywall(): PaywallResponse {
  return {
    brand: {
      en: "PostureFlow Teams",
      es: "PostureFlow Teams",
    },
    headline: {
      en: "Bring ergonomics to your entire team.",
      es: "Lleva la ergonomia a todo tu equipo.",
    },
    features: [
      {
        icon: "ShieldCheck",
        text: { en: "Managed team licenses", es: "Licencias administrables" },
      },
      {
        icon: "Zap",
        text: {
          en: "Slack and Teams integrations",
          es: "Integracion con Slack y Teams",
        },
      },
      {
        icon: "Check",
        text: { en: "Workplace health reports", es: "Reportes de salud laboral" },
      },
    ],
    pricing: {
      planName: { en: "Enterprise Plan", es: "Plan Enterprise" },
      pricePerSeat: 8,
      unit: { en: "/ user / month", es: "/ usuario / mes" },
      cta: { en: "Contact Sales", es: "Contactar Ventas" },
      secondaryCta: {
        en: "Enter company code (B2B)",
        es: "Ingresar codigo de empresa (B2B)",
      },
    },
  };
}

export function createFallbackBootstrap(locale: LocaleCode): BootstrapResponse {
  const user = createFallbackUser(locale);

  return createFallbackBootstrapForUser(locale, user);
}

export function createFallbackUser(
  locale: LocaleCode,
  overrides: Partial<UserSummary> = {},
): UserSummary {
  return {
    id: overrides.id ?? FALLBACK_USER_ID,
    firstName: overrides.firstName ?? "Alex",
    lastName: overrides.lastName ?? "Carter",
    email: overrides.email ?? "alex@postureflow.app",
    emailVerified: overrides.emailVerified ?? true,
    locale: overrides.locale ?? toBackendLocale(locale),
    onboardingCompleted: overrides.onboardingCompleted ?? false,
    streakCount: overrides.streakCount ?? 5,
    painRegionIds: overrides.painRegionIds ?? [],
    setupOptionIds: overrides.setupOptionIds ?? [],
  };
}

export function createFallbackBootstrapForUser(
  locale: LocaleCode,
  user: UserSummary,
): BootstrapResponse {
  return {
    locale: toBackendLocale(locale),
    user,
    onboarding: {
      totalSteps: 2,
      completed: user.onboardingCompleted,
      selectedPainRegionIds: user.painRegionIds,
      selectedSetupOptionIds: user.setupOptionIds,
      painRegions: [...FALLBACK_PAIN_REGIONS],
      setupOptions: [...FALLBACK_SETUP_OPTIONS],
    },
  };
}

export function createFallbackLibrary(locale: LocaleCode): LibraryResponse {
  const backendLocale = toBackendLocale(locale);
  const routines = FALLBACK_ROUTINES.map((routine) => ({
    ...routine,
    locale: backendLocale,
  }));

  const usedMb = routines.reduce(
    (total, routine) => (routine.downloaded ? total + routine.sizeMb : total),
    0,
  );

  return {
    storage: {
      usedMb,
      totalMb: 500,
    },
    routines,
  };
}

export function createFallbackDashboard(
  locale: LocaleCode,
  bootstrap: BootstrapResponse,
  paywall: PaywallResponse,
): DashboardResponse {
  const selectedPainRegionIds = bootstrap.user.painRegionIds.length
    ? bootstrap.user.painRegionIds
    : ["neck"];
  const rankedRoutines = getRankedFallbackRoutines(selectedPainRegionIds);
  const featuredRoutine = rankedRoutines[0] ?? FALLBACK_ROUTINES[0];
  const quickLibraryItems = rankedRoutines.slice(1, 3);
  const selectedRegions = FALLBACK_PAIN_REGIONS.filter((region) =>
    selectedPainRegionIds.includes(region.id),
  );
  const tensionValue = Math.min(
    96,
    18 + selectedPainRegionIds.length * 12 + (bootstrap.user.setupOptionIds.length > 0 ? 8 : 0),
  );
  const previewImageUrls = rankedRoutines
    .slice(0, 3)
    .map((routine) => routine.imageUrl);

  return {
    user: bootstrap.user,
    systemStatus: {
      label: {
        en: "SYSTEM_ACTIVE",
        es: "SISTEMA_ACTIVO",
      },
      operatorBadge: `${(bootstrap.user.firstName[0] ?? "A").toUpperCase()}${(
        bootstrap.user.lastName?.[0] ?? "L"
      ).toUpperCase()}`,
    },
    header: {
      greetingName: bootstrap.user.firstName,
      tagline: {
        en: "Adaptive recovery queue ready.",
        es: "Cola adaptativa de recuperacion lista.",
      },
      offlineReady: true,
    },
    featuredRoutine: toDashboardRoutine(
      featuredRoutine,
      locale,
      previewImageUrls,
      localized("Suggested Protocol", "Protocolo Sugerido"),
    ),
    tensionIndex: {
      label: {
        en: "Tension Index",
        es: "Indice de Tension",
      },
      value: tensionValue,
      progress: tensionValue / 100,
    },
    criticalZones: {
      label: {
        en: "Critical Zones",
        es: "Zonas Criticas",
      },
      count: selectedPainRegionIds.length,
      regionLabels: selectedRegions.map((region) => region.label),
    },
    quickLibrary: {
      label: {
        en: "Quick Library",
        es: "Libreria Rapida",
      },
      items: quickLibraryItems.map((routine) =>
        toDashboardRoutine(
          routine,
          locale,
          [routine.imageUrl],
          localized("Recommended", "Recomendada"),
        ),
      ),
    },
    streak: {
      days: bootstrap.user.streakCount,
      label: {
        en: "Your streak",
        es: "Tu racha",
      },
      caption: {
        en: "Consistent flow.",
        es: "Flujo constante.",
      },
    },
    muscleState: {
      title: {
        en: "Muscle State",
        es: "Estado Muscular",
      },
      highlightedPainRegionId: selectedPainRegionIds[0],
    },
    breakTimer: {
      label: {
        en: "Next break in",
        es: "Proxima pausa en",
      },
      remainingMinutes: 45,
      displayValue: "45:00",
      progress: 0.25,
    },
    teamUpsell: paywall,
  };
}
