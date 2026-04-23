export type LocaleCode = "en" | "es";
export type BackendLocale = "EN" | "ES";
export type SessionProvider = "email" | "google";
export type AuthFormMode = "login" | "register";

export type LocalizedText = {
  en: string;
  es: string;
};

export type UserSummary = {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  emailVerified: boolean;
  locale: BackendLocale;
  onboardingCompleted: boolean;
  streakCount: number;
  painRegionIds: string[];
  setupOptionIds: string[];
};

export type AuthSessionSnapshot = {
  token: string;
  provider: SessionProvider;
  expiresAt: string;
  emailVerified: boolean;
  user: UserSummary;
};

export type AuthSuccessResponse = {
  ok: boolean;
  authenticated: true;
  session: AuthSessionSnapshot;
  bootstrap: BootstrapResponse;
  dashboard: DashboardResponse;
  library: LibraryResponse;
  paywall: PaywallResponse;
};

export type PendingVerificationResponse = {
  ok: boolean;
  authenticated: false;
  requiresEmailVerification?: boolean;
  alreadyVerified?: boolean;
  email: string;
  devVerificationCode?: string;
};

export type AuthResult = AuthSuccessResponse | PendingVerificationResponse;

export type PendingVerificationState = {
  email: string;
  devVerificationCode?: string | null;
};

export type OnboardingDraft = {
  firstName: string;
  screenHours: number | null;
};

export type PainRegion = {
  id: string;
  label: LocalizedText;
  shape: "circle" | "ellipse" | string;
  cx: number;
  cy: number;
  radius?: number | null;
  radiusX?: number | null;
  radiusY?: number | null;
};

export type SetupOption = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
};

export type RoutineCard = {
  id: string;
  slug: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  imageUrl: string;
  durationMinutes: number;
  durationLabel: LocalizedText;
  sizeMb: number;
  sizeLabel: string;
  cta: LocalizedText;
  locale: BackendLocale;
  downloaded?: boolean;
};

export type DashboardRoutineRecommendation = RoutineCard & {
  badge: LocalizedText;
  categoryLabel: LocalizedText;
  previewImageUrls: string[];
};

export type PlayerRoutine = RoutineCard & {
  repetitionsLabel: LocalizedText;
  tipTitle: LocalizedText;
  tipBody: LocalizedText;
  totalDurationSeconds: number;
};

export type CompletionSummary = {
  title: string;
  benefits: LocalizedText[];
  cta: LocalizedText;
};

export type BootstrapResponse = {
  locale: BackendLocale;
  user: UserSummary;
  onboarding: {
    totalSteps: number;
    completed: boolean;
    selectedPainRegionIds: string[];
    selectedSetupOptionIds: string[];
    painRegions: PainRegion[];
    setupOptions: SetupOption[];
  };
};

export type DashboardResponse = {
  user: UserSummary;
  systemStatus: {
    label: LocalizedText;
    operatorBadge: string;
  };
  header: {
    greetingName: string;
    tagline: LocalizedText;
    offlineReady: boolean;
  };
  featuredRoutine: DashboardRoutineRecommendation;
  tensionIndex: {
    label: LocalizedText;
    value: number;
    progress: number;
  };
  criticalZones: {
    label: LocalizedText;
    count: number;
    regionLabels: LocalizedText[];
  };
  quickLibrary: {
    label: LocalizedText;
    items: DashboardRoutineRecommendation[];
  };
  streak: {
    days: number;
    label: LocalizedText;
    caption: LocalizedText;
  };
  muscleState: {
    title: LocalizedText;
    highlightedPainRegionId: string;
  };
  breakTimer: {
    label: LocalizedText;
    remainingMinutes: number;
    displayValue: string;
    progress: number;
  };
  teamUpsell: PaywallResponse;
};

export type LibraryResponse = {
  storage: {
    usedMb: number;
    totalMb: number;
  };
  routines: RoutineCard[];
};

export type PaywallResponse = {
  brand: LocalizedText;
  headline: LocalizedText;
  features: Array<{
    icon: string;
    text: LocalizedText;
  }>;
  pricing: {
    planName: LocalizedText;
    pricePerSeat: number;
    unit: LocalizedText;
    cta: LocalizedText;
    secondaryCta: LocalizedText;
  };
};

export type StartSessionResponse = {
  sessionId: string;
  routine: PlayerRoutine;
};

export type CompleteSessionResponse = {
  ok: boolean;
  summary: CompletionSummary;
};

export type SyncEventType =
  | "SET_LOCALE"
  | "COMPLETE_ONBOARDING"
  | "DOWNLOAD_ROUTINE"
  | "COMPLETE_SESSION";

export type PendingSyncEvent = {
  id: string;
  type: SyncEventType;
  payload: Record<string, unknown>;
};

export type RootStackParamList = {
  Splash: undefined;
  OnboardingProblem: undefined;
  OnboardingSolution: undefined;
  OnboardingName: undefined;
  OnboardingHours: undefined;
  OnboardingScanner: undefined;
  OnboardingAha: undefined;
  OnboardingTrust: undefined;
  Auth: { mode?: AuthFormMode } | undefined;
  VerifyEmail: undefined;
  PainMap: undefined;
  Setup: undefined;
  Analyzing: undefined;
  Dashboard: undefined;
  Library: undefined;
  Paywall: undefined;
  Player: { routineId: string };
  Success: undefined;
};

export type AppRoute<Name extends keyof RootStackParamList = keyof RootStackParamList> = {
  key: string;
  name: Name;
  params: RootStackParamList[Name];
};

export type AppNavigation = {
  navigate<Name extends keyof RootStackParamList>(
    name: Name,
    params?: RootStackParamList[Name],
  ): void;
  replace<Name extends keyof RootStackParamList>(
    name: Name,
    params?: RootStackParamList[Name],
  ): void;
  goBack(): void;
};

export type AppScreenProps<Name extends keyof RootStackParamList> = {
  navigation: AppNavigation;
  route: AppRoute<Name>;
  isFocused: boolean;
};
