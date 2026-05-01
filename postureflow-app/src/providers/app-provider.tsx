import NetInfo from "@react-native-community/netinfo";
import {
  PropsWithChildren,
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ApiError, api } from "../services/api";
import {
  configureGoogleSignIn,
  signInWithGoogle,
  signOutGoogle,
} from "../services/google-auth";
import {
  readJson,
  readString,
  removeItem,
  removeMany,
  STORAGE_KEYS,
  writeJson,
  writeString,
} from "../services/storage";
import {
  AuthResult,
  AuthSessionSnapshot,
  BootstrapResponse,
  CompletionSummary,
  DashboardResponse,
  LibraryResponse,
  LocaleCode,
  OnboardingDraft,
  PaywallResponse,
  PendingSyncEvent,
  PendingVerificationState,
  PlayerRoutine,
  RootStackParamList,
  RoutineCard,
  SyncEventType,
} from "../types/app";
import {
  createFallbackBootstrap,
  createFallbackBootstrapForUser,
  createFallbackDashboard,
  createFallbackLibrary,
  createFallbackPaywall,
  createFallbackUser,
} from "../data/fallback-data";
import { fromBackendLocale, toBackendLocale } from "../utils/localize";

type EntryRoute = Extract<
  keyof RootStackParamList,
  | "OnboardingProblem"
  | "VerifyEmail"
  | "Analyzing"
  | "Dashboard"
>;

type AppContextValue = {
  locale: LocaleCode;
  authSession: AuthSessionSnapshot | null;
  pendingVerification: PendingVerificationState | null;
  bootstrap: BootstrapResponse | null;
  dashboard: DashboardResponse | null;
  library: LibraryResponse | null;
  paywall: PaywallResponse | null;
  successSummary: CompletionSummary | null;
  onboardingDraft: OnboardingDraft;
  painSelection: string[];
  setupSelection: string[];
  isHydrated: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  entryRoute: EntryRoute;
  toggleLocale: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<AuthResult>;
  registerWithEmail: (
    firstName: string,
    email: string,
    password: string,
    lastName?: string,
  ) => Promise<AuthResult>;
  continueWithGoogle: () => Promise<AuthResult>;
  verifyPendingEmail: (code: string) => Promise<AuthResult>;
  resendVerification: () => Promise<AuthResult | null>;
  logout: () => Promise<void>;
  setOnboardingName: (value: string) => void;
  setScreenHours: (value: number) => void;
  clearOnboardingDraft: () => void;
  setPainSelection: (value: string[]) => void;
  setSetupSelection: (value: string[]) => void;
  submitOnboarding: () => Promise<void>;
  refreshRemoteState: () => Promise<void>;
  downloadRoutine: (routineId: string) => Promise<void>;
  startRoutine: (routineId: string) => Promise<PlayerRoutine | null>;
  updateActiveSessionProgress: (progress: number) => Promise<void>;
  completeActiveSession: (routineId: string) => Promise<CompletionSummary | null>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

function createEvent(type: SyncEventType, payload: Record<string, unknown>): PendingSyncEvent {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    payload,
  };
}

function createLocalPlayerRoutine(routine: RoutineCard): PlayerRoutine {
  const isNeckRoutine = routine.slug.includes("cervical");

  return {
    ...routine,
    repetitionsLabel: {
      en: "Rep 1 of 3",
      es: "Rep 1 de 3",
    },
    tipTitle: {
      en: "Position",
      es: "Posicion",
    },
    tipBody: isNeckRoutine
      ? {
          en: "Hold the lower edge of your chair and keep your chin neutral.",
          es: "Sujeta el borde inferior de tu silla y manten la barbilla neutra.",
        }
      : {
          en: "Move slowly and keep your shoulders heavy.",
          es: "Muevete lento y deja caer el peso de tus hombros.",
        },
    totalDurationSeconds: routine.durationMinutes * 60,
  };
}

function createLocalSummary(routine: RoutineCard, locale: LocaleCode): CompletionSummary {
  const isLumbar = routine.slug.includes("lumbar");

  return {
    title: locale === "es" ? "Flujo Completado" : "Flow Completed",
    benefits: isLumbar
      ? [
          {
            en: "Lower back is unloading with more ease.",
            es: "Espalda baja descargada con mas soltura.",
          },
          {
            en: "Pelvis and hips feel more mobile.",
            es: "Pelvis y caderas con mas movilidad.",
          },
        ]
      : [
          {
            en: "Back is 20% more aligned.",
            es: "Espalda 20% mas alineada.",
          },
          {
            en: "Joints feel lubricated and lighter.",
            es: "Articulaciones lubricadas y mas ligeras.",
          },
        ],
    cta: {
      en: "Back to Dashboard",
      es: "Volver al Dashboard",
    },
  };
}

function getSetupOptionIdForScreenHours(hours: number) {
  if (hours >= 10) {
    return "burnout";
  }

  if (hours >= 6) {
    return "digital_fatigue";
  }

  return "deep_focus";
}

export function AppProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = useState<LocaleCode>("en");
  const [authSession, setAuthSession] = useState<AuthSessionSnapshot | null>(null);
  const [pendingVerification, setPendingVerification] =
    useState<PendingVerificationState | null>(null);
  const [bootstrap, setBootstrap] = useState<BootstrapResponse | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [library, setLibrary] = useState<LibraryResponse | null>(null);
  const [paywall, setPaywall] = useState<PaywallResponse | null>(null);
  const [successSummary, setSuccessSummary] = useState<CompletionSummary | null>(null);
  const [onboardingDraft, setOnboardingDraft] = useState<OnboardingDraft>({
    firstName: "",
    screenHours: null,
  });
  const [painSelection, setPainSelection] = useState<string[]>([]);
  const [setupSelection, setSetupSelection] = useState<string[]>([]);
  const [isHydrated, setHydrated] = useState(false);
  const [isOnline, setOnline] = useState(true);
  const [isSyncing, setSyncing] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeRoutine, setActiveRoutine] = useState<PlayerRoutine | null>(null);
  const queueRef = useRef<PendingSyncEvent[]>([]);
  const lastProgressSentRef = useRef(0);

  const currentUserId = authSession?.user.id ?? bootstrap?.user.id ?? null;

  const updateQueue = useCallback(async (nextQueue: PendingSyncEvent[]) => {
    queueRef.current = nextQueue;
    await writeJson(STORAGE_KEYS.syncQueue, nextQueue);
  }, []);

  const enqueue = useCallback(
    async (type: SyncEventType, payload: Record<string, unknown>) => {
      await updateQueue([...queueRef.current, createEvent(type, payload)]);
    },
    [updateQueue],
  );

  const applyBootstrap = useCallback(
    async (nextBootstrap: BootstrapResponse) => {
      startTransition(() => {
        setBootstrap(nextBootstrap);
      });

      await writeJson(STORAGE_KEYS.bootstrap, nextBootstrap);

      const hasQueuedOnboarding = queueRef.current.some(
        (event) => event.type === "COMPLETE_ONBOARDING",
      );

      if (!hasQueuedOnboarding) {
        setPainSelection(nextBootstrap.onboarding.selectedPainRegionIds);
        setSetupSelection(nextBootstrap.onboarding.selectedSetupOptionIds);
      }
    },
    [],
  );

  const clearPendingVerificationState = useCallback(async () => {
    setPendingVerification(null);
    await removeItem(STORAGE_KEYS.pendingVerification);
  }, []);

  const applyPendingVerificationState = useCallback(
    async (email: string, devVerificationCode?: string) => {
      const nextPending = {
        email,
        devVerificationCode: devVerificationCode ?? null,
      };

      startTransition(() => {
        setPendingVerification(nextPending);
        setAuthSession(null);
        setBootstrap(null);
        setDashboard(null);
        setLibrary(null);
        setPaywall(null);
        setSuccessSummary(null);
        setOnboardingDraft((current) => ({
          ...current,
          firstName: current.firstName,
          screenHours: current.screenHours,
        }));
        setPainSelection([]);
        setSetupSelection([]);
      });

      queueRef.current = [];

      await Promise.all([
        writeJson(STORAGE_KEYS.pendingVerification, nextPending),
        removeMany([
          STORAGE_KEYS.authSession,
          STORAGE_KEYS.bootstrap,
          STORAGE_KEYS.dashboard,
          STORAGE_KEYS.library,
          STORAGE_KEYS.paywall,
          STORAGE_KEYS.syncQueue,
          STORAGE_KEYS.successSummary,
        ]),
      ]);
    },
    [],
  );

  const applyAuthenticatedResult = useCallback(
    async (result: AuthResult) => {
      if (!result.authenticated) {
        await applyPendingVerificationState(
          result.email,
          result.devVerificationCode,
        );
        return;
      }

      const nextLocale = fromBackendLocale(result.bootstrap.locale);

      startTransition(() => {
        setLocale(nextLocale);
        setAuthSession(result.session);
        setPendingVerification(null);
        setBootstrap(result.bootstrap);
        setDashboard(result.dashboard);
        setLibrary(result.library);
        setPaywall(result.paywall);
      });

      setPainSelection(result.bootstrap.onboarding.selectedPainRegionIds);
      setSetupSelection(result.bootstrap.onboarding.selectedSetupOptionIds);
      setOnboardingDraft((current) => ({
        firstName: current.firstName || result.session.user.firstName,
        screenHours: current.screenHours,
      }));

      await Promise.all([
        writeString(STORAGE_KEYS.locale, nextLocale),
        writeJson(STORAGE_KEYS.authSession, result.session),
        writeJson(STORAGE_KEYS.bootstrap, result.bootstrap),
        writeJson(STORAGE_KEYS.dashboard, result.dashboard),
        writeJson(STORAGE_KEYS.library, result.library),
        writeJson(STORAGE_KEYS.paywall, result.paywall),
        removeItem(STORAGE_KEYS.pendingVerification),
      ]);
    },
    [applyPendingVerificationState],
  );

  const clearSessionState = useCallback(async () => {
    startTransition(() => {
      setAuthSession(null);
      setPendingVerification(null);
      setBootstrap(null);
      setDashboard(null);
      setLibrary(null);
      setPaywall(null);
      setSuccessSummary(null);
      setOnboardingDraft({
        firstName: "",
        screenHours: null,
      });
    });

    setPainSelection([]);
    setSetupSelection([]);
    setActiveRoutine(null);
    setActiveSessionId(null);
    queueRef.current = [];

    await removeMany([
      STORAGE_KEYS.authSession,
      STORAGE_KEYS.pendingVerification,
      STORAGE_KEYS.bootstrap,
      STORAGE_KEYS.dashboard,
      STORAGE_KEYS.library,
      STORAGE_KEYS.paywall,
      STORAGE_KEYS.syncQueue,
      STORAGE_KEYS.successSummary,
    ]);
  }, []);

  const fetchCollections = useCallback(
    async (userId: string) => {
      const [nextDashboard, nextLibrary, nextPaywall] = await Promise.all([
        api.getDashboard(userId),
        api.getLibrary(userId),
        api.getPaywall(),
      ]);

      startTransition(() => {
        setDashboard(nextDashboard);
        setLibrary(nextLibrary);
        setPaywall(nextPaywall);
      });

      await Promise.all([
        writeJson(STORAGE_KEYS.dashboard, nextDashboard),
        writeJson(STORAGE_KEYS.library, nextLibrary),
        writeJson(STORAGE_KEYS.paywall, nextPaywall),
      ]);
    },
    [],
  );

  const flushSyncQueue = useCallback(async () => {
    if (!isOnline || !currentUserId || queueRef.current.length === 0) {
      return;
    }

    setSyncing(true);

    try {
      await api.sync(currentUserId, queueRef.current);
      await updateQueue([]);
      await fetchCollections(currentUserId);
    } finally {
      setSyncing(false);
    }
  }, [currentUserId, fetchCollections, isOnline, updateQueue]);

  const refreshRemoteState = useCallback(async () => {
    if (!isOnline || !authSession) {
      return;
    }

    try {
      const result = await api.restoreSession(
        authSession.token,
        toBackendLocale(locale),
      );

      await applyAuthenticatedResult(result);
      await flushSyncQueue();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        await clearSessionState();
      }
    }
  }, [applyAuthenticatedResult, authSession, clearSessionState, flushSyncQueue, isOnline, locale]);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  useEffect(() => {
    const loadCachedState = async () => {
      try {
        const [
          storedLocale,
          storedAuthSession,
          storedPendingVerification,
          storedBootstrap,
          storedDashboard,
          storedLibrary,
          storedPaywall,
          storedQueue,
          storedSummary,
        ] = await Promise.all([
          readString(STORAGE_KEYS.locale, "en"),
          readJson<AuthSessionSnapshot | null>(STORAGE_KEYS.authSession, null),
          readJson<PendingVerificationState | null>(
            STORAGE_KEYS.pendingVerification,
            null,
          ),
          readJson<BootstrapResponse | null>(STORAGE_KEYS.bootstrap, null),
          readJson<DashboardResponse | null>(STORAGE_KEYS.dashboard, null),
          readJson<LibraryResponse | null>(STORAGE_KEYS.library, null),
          readJson<PaywallResponse | null>(STORAGE_KEYS.paywall, null),
          readJson<PendingSyncEvent[]>(STORAGE_KEYS.syncQueue, []),
          readJson<CompletionSummary | null>(STORAGE_KEYS.successSummary, null),
        ]);

        const nextLocale =
          storedLocale === "es" || storedLocale === "en"
            ? storedLocale
            : fromBackendLocale(storedAuthSession?.user.locale ?? storedBootstrap?.locale);

        const nextPaywall = storedPaywall ?? createFallbackPaywall();

        setLocale(nextLocale);
        setAuthSession(storedAuthSession);
        setPendingVerification(storedPendingVerification);
        setSuccessSummary(storedSummary);
        queueRef.current = storedQueue;
        setOnboardingDraft({
          firstName: storedAuthSession?.user.firstName ?? "",
          screenHours: null,
        });

        if (storedAuthSession) {
          const baseUser = createFallbackUser(nextLocale, storedAuthSession.user);
          const nextBootstrap =
            storedBootstrap ?? createFallbackBootstrapForUser(nextLocale, baseUser);
          const nextDashboard =
            storedDashboard ??
            createFallbackDashboard(nextLocale, nextBootstrap, nextPaywall);
          const nextLibrary = storedLibrary ?? createFallbackLibrary(nextLocale);

          setBootstrap(nextBootstrap);
          setDashboard(nextDashboard);
          setLibrary(nextLibrary);
          setPaywall(nextPaywall);
          setPainSelection(nextBootstrap.onboarding.selectedPainRegionIds);
          setSetupSelection(nextBootstrap.onboarding.selectedSetupOptionIds);
        } else {
          setBootstrap(null);
          setDashboard(null);
          setLibrary(null);
          setPaywall(null);
          setPainSelection([]);
          setSetupSelection([]);
        }
      } catch {
        const nextLocale: LocaleCode = "en";
        const nextBootstrap = createFallbackBootstrap(nextLocale);
        const nextPaywall = createFallbackPaywall();

        setLocale(nextLocale);
        setAuthSession(null);
        setPendingVerification(null);
        setBootstrap(null);
        setDashboard(createFallbackDashboard(nextLocale, nextBootstrap, nextPaywall));
        setLibrary(createFallbackLibrary(nextLocale));
        setPaywall(nextPaywall);
        setSuccessSummary(null);
        setOnboardingDraft({
          firstName: "",
          screenHours: null,
        });
        queueRef.current = [];
        setPainSelection([]);
        setSetupSelection([]);
      } finally {
        setHydrated(true);
      }
    };

    void loadCachedState();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = Boolean(
        state.isConnected && state.isInternetReachable !== false,
      );
      setOnline(connected);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isHydrated || !authSession || !isOnline) {
      return;
    }

    void refreshRemoteState();
  }, [authSession, isHydrated, isOnline, refreshRemoteState]);

  useEffect(() => {
    if (isOnline && currentUserId && queueRef.current.length > 0) {
      void flushSyncQueue();
    }
  }, [currentUserId, flushSyncQueue, isOnline]);

  const toggleLocale = useCallback(async () => {
    const nextLocale: LocaleCode = locale === "en" ? "es" : "en";
    setLocale(nextLocale);
    await writeString(STORAGE_KEYS.locale, nextLocale);

    if (bootstrap) {
      const nextBootstrap = {
        ...bootstrap,
        locale: toBackendLocale(nextLocale),
        user: {
          ...bootstrap.user,
          locale: toBackendLocale(nextLocale),
        },
      };
      await applyBootstrap(nextBootstrap);
    }

    if (authSession) {
      const nextSession = {
        ...authSession,
        user: {
          ...authSession.user,
          locale: toBackendLocale(nextLocale),
        },
      };
      setAuthSession(nextSession);
      await writeJson(STORAGE_KEYS.authSession, nextSession);
    }

    if (authSession && currentUserId) {
      if (isOnline) {
        try {
          await api.updateLocale(currentUserId, toBackendLocale(nextLocale));
        } catch {
          await enqueue("SET_LOCALE", { locale: toBackendLocale(nextLocale) });
        }
      } else {
        await enqueue("SET_LOCALE", { locale: toBackendLocale(nextLocale) });
      }
    }
  }, [applyBootstrap, authSession, bootstrap, currentUserId, enqueue, isOnline, locale]);

  const registerWithEmail = useCallback(
    async (
      firstName: string,
      email: string,
      password: string,
      lastName?: string,
    ) => {
      const result = await api.registerWithEmail(
        firstName,
        email,
        password,
        toBackendLocale(locale),
        lastName,
      );
      await applyAuthenticatedResult(result);
      return result;
    },
    [applyAuthenticatedResult, locale],
  );

  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      const result = await api.loginWithEmail(email, password, toBackendLocale(locale));
      await applyAuthenticatedResult(result);
      return result;
    },
    [applyAuthenticatedResult, locale],
  );

  const continueWithGoogle = useCallback(
    async () => {
      const googleResult = await signInWithGoogle(locale);
      const result = await api.loginWithGoogle({
        idToken: googleResult.idToken,
        serverAuthCode: googleResult.serverAuthCode,
        locale: toBackendLocale(locale),
        profile: googleResult.profile,
      });

      await applyAuthenticatedResult(result);
      return result;
    },
    [applyAuthenticatedResult, locale],
  );

  const verifyPendingEmail = useCallback(
    async (code: string) => {
      if (!pendingVerification?.email) {
        throw new Error(
          locale === "es"
            ? "No hay un correo pendiente por verificar."
            : "There is no pending email to verify.",
        );
      }

      const result = await api.verifyEmail(
        pendingVerification.email,
        code,
        toBackendLocale(locale),
      );
      await applyAuthenticatedResult(result);
      return result;
    },
    [applyAuthenticatedResult, locale, pendingVerification?.email],
  );

  const resendVerification = useCallback(async () => {
    if (!pendingVerification?.email) {
      return null;
    }

    const result = await api.resendVerification(pendingVerification.email);

    if (!result.authenticated) {
      await applyPendingVerificationState(result.email, result.devVerificationCode);
    }

    return result;
  }, [applyPendingVerificationState, pendingVerification?.email]);

  const logout = useCallback(async () => {
    if (authSession?.token && isOnline) {
      try {
        await api.logout(authSession.token);
      } catch {
        // Keep logout local-first even if the server cannot be reached.
      }
    }

    if (authSession?.provider === "google") {
      await signOutGoogle();
    }

    await clearSessionState();
  }, [authSession?.provider, authSession?.token, clearSessionState, isOnline]);

  const setOnboardingName = useCallback((value: string) => {
    setOnboardingDraft((current) => ({
      ...current,
      firstName: value,
    }));
  }, []);

  const setScreenHours = useCallback((value: number) => {
    setOnboardingDraft((current) => ({
      ...current,
      screenHours: value,
    }));
    setSetupSelection([getSetupOptionIdForScreenHours(value)]);
  }, []);

  const clearOnboardingDraft = useCallback(() => {
    setOnboardingDraft({
      firstName: "",
      screenHours: null,
    });
  }, []);

  const submitOnboarding = useCallback(async () => {
    if (!bootstrap || !currentUserId) {
      return;
    }

    const optimisticBootstrap: BootstrapResponse = {
      ...bootstrap,
      onboarding: {
        ...bootstrap.onboarding,
        completed: true,
        selectedPainRegionIds: painSelection,
        selectedSetupOptionIds: setupSelection,
      },
      user: {
        ...bootstrap.user,
        onboardingCompleted: true,
        painRegionIds: painSelection,
        setupOptionIds: setupSelection,
      },
    };

    await applyBootstrap(optimisticBootstrap);

    if (authSession) {
      const nextSession = {
        ...authSession,
        user: {
          ...authSession.user,
          onboardingCompleted: true,
          painRegionIds: painSelection,
          setupOptionIds: setupSelection,
        },
      };
      setAuthSession(nextSession);
      await writeJson(STORAGE_KEYS.authSession, nextSession);
    }

    clearOnboardingDraft();

    if (isOnline) {
      try {
        await api.completeOnboarding(
          currentUserId,
          toBackendLocale(locale),
          painSelection,
          setupSelection,
        );
        await fetchCollections(currentUserId);
        return;
      } catch {
        await enqueue("COMPLETE_ONBOARDING", {
          locale: toBackendLocale(locale),
          painRegionIds: painSelection,
          setupOptionIds: setupSelection,
        });
        return;
      }
    }

    await enqueue("COMPLETE_ONBOARDING", {
      locale: toBackendLocale(locale),
      painRegionIds: painSelection,
      setupOptionIds: setupSelection,
    });
  }, [
    applyBootstrap,
    authSession,
    bootstrap,
    currentUserId,
    enqueue,
    fetchCollections,
    isOnline,
    locale,
    painSelection,
    setupSelection,
    clearOnboardingDraft,
  ]);

  const downloadRoutine = useCallback(
    async (routineId: string) => {
      if (!currentUserId || !library) {
        return;
      }

      const targetRoutine = library.routines.find((routine) => routine.id === routineId);
      if (!targetRoutine || targetRoutine.downloaded) {
        return;
      }

      const optimisticLibrary: LibraryResponse = {
        storage: {
          ...library.storage,
          usedMb: library.storage.usedMb + targetRoutine.sizeMb,
        },
        routines: library.routines.map((routine) =>
          routine.id === routineId ? { ...routine, downloaded: true } : routine,
        ),
      };

      setLibrary(optimisticLibrary);
      await writeJson(STORAGE_KEYS.library, optimisticLibrary);

      if (isOnline) {
        try {
          const nextLibrary = await api.downloadRoutine(currentUserId, routineId);
          setLibrary(nextLibrary);
          await writeJson(STORAGE_KEYS.library, nextLibrary);
          return;
        } catch {
          await enqueue("DOWNLOAD_ROUTINE", { routineId });
          return;
        }
      }

      await enqueue("DOWNLOAD_ROUTINE", { routineId });
    },
    [currentUserId, enqueue, isOnline, library],
  );

  const startRoutine = useCallback(
    async (routineId: string) => {
      if (!currentUserId) {
        return null;
      }

      const sourceRoutine =
        library?.routines.find((routine) => routine.id === routineId) ??
        (dashboard?.featuredRoutine.id === routineId
          ? dashboard.featuredRoutine
          : undefined);

      if (!sourceRoutine) {
        return null;
      }

      lastProgressSentRef.current = 0;

      if (isOnline) {
        try {
          const response = await api.startSession(
            currentUserId,
            routineId,
            toBackendLocale(locale),
          );
          setActiveSessionId(response.sessionId);
          setActiveRoutine(response.routine);
          return response.routine;
        } catch {
          const offlineRoutine = createLocalPlayerRoutine(sourceRoutine);
          setActiveSessionId(null);
          setActiveRoutine(offlineRoutine);
          return offlineRoutine;
        }
      }

      const offlineRoutine = createLocalPlayerRoutine(sourceRoutine);
      setActiveSessionId(null);
      setActiveRoutine(offlineRoutine);
      return offlineRoutine;
    },
    [currentUserId, dashboard?.featuredRoutine, isOnline, library?.routines, locale],
  );

  const updateActiveSessionProgress = useCallback(
    async (progress: number) => {
      if (!isOnline || !activeSessionId) {
        return;
      }

      const rounded = Math.round(progress);
      if (rounded < lastProgressSentRef.current + 15 && rounded < 100) {
        return;
      }

      lastProgressSentRef.current = rounded;

      try {
        await api.updateSessionProgress(activeSessionId, rounded);
      } catch {
        // Keep the player smooth even if the network call fails.
      }
    },
    [activeSessionId, isOnline],
  );

  const completeActiveSession = useCallback(
    async (routineId: string) => {
      if (!currentUserId) {
        return null;
      }

      const routine =
        activeRoutine ??
        library?.routines.find((item) => item.id === routineId) ??
        dashboard?.featuredRoutine ??
        null;

      if (!routine) {
        return null;
      }

      const fallbackSummary = createLocalSummary(routine, locale);
      setActiveRoutine(null);
      setActiveSessionId(null);

      if (isOnline && activeSessionId) {
        try {
          const response = await api.completeSession(
            activeSessionId,
            currentUserId,
            toBackendLocale(locale),
            routineId,
          );
          setSuccessSummary(response.summary);
          await writeJson(STORAGE_KEYS.successSummary, response.summary);
          await fetchCollections(currentUserId);
          return response.summary;
        } catch {
          // Fall back to local completion and queue.
        }
      }

      const completedAt = new Date().toISOString();
      setSuccessSummary(fallbackSummary);
      await writeJson(STORAGE_KEYS.successSummary, fallbackSummary);
      await enqueue("COMPLETE_SESSION", {
        routineId,
        locale: toBackendLocale(locale),
        completedAt,
      });

      if (dashboard) {
        const nextDashboard: DashboardResponse = {
          ...dashboard,
          streak: {
            ...dashboard.streak,
            days: Math.max(dashboard.streak.days, 0) + 1,
          },
        };
        setDashboard(nextDashboard);
        await writeJson(STORAGE_KEYS.dashboard, nextDashboard);
      }

      return fallbackSummary;
    },
    [
      activeRoutine,
      activeSessionId,
      currentUserId,
      dashboard,
      enqueue,
      fetchCollections,
      isOnline,
      library?.routines,
      locale,
    ],
  );

  const entryRoute = useMemo<EntryRoute>(() => {
    if (authSession) {
      const onboardingCompleted =
        bootstrap?.user.onboardingCompleted ?? authSession.user.onboardingCompleted;
      if (onboardingCompleted) {
        return "Dashboard";
      }

      if (painSelection.length > 0 && setupSelection.length > 0) {
        return "Analyzing";
      }

      return "OnboardingProblem";
    }

    if (pendingVerification?.email) {
      return "VerifyEmail";
    }

    return "OnboardingProblem";
  }, [
    authSession,
    bootstrap?.user.onboardingCompleted,
    painSelection.length,
    pendingVerification?.email,
    setupSelection.length,
  ]);

  const value = useMemo<AppContextValue>(
    () => ({
      locale,
      authSession,
      pendingVerification,
      bootstrap,
      dashboard,
      library,
      paywall,
      successSummary,
      onboardingDraft,
      painSelection,
      setupSelection,
      isHydrated,
      isOnline,
      isSyncing,
      entryRoute,
      toggleLocale,
      loginWithEmail,
      registerWithEmail,
      continueWithGoogle,
      verifyPendingEmail,
      resendVerification,
      logout,
      setOnboardingName,
      setScreenHours,
      clearOnboardingDraft,
      setPainSelection,
      setSetupSelection,
      submitOnboarding,
      refreshRemoteState,
      downloadRoutine,
      startRoutine,
      updateActiveSessionProgress,
      completeActiveSession,
    }),
    [
      authSession,
      bootstrap,
      completeActiveSession,
      continueWithGoogle,
      dashboard,
      downloadRoutine,
      entryRoute,
      isHydrated,
      isOnline,
      isSyncing,
      library,
      locale,
      loginWithEmail,
      logout,
      onboardingDraft,
      painSelection,
      paywall,
      pendingVerification,
      refreshRemoteState,
      registerWithEmail,
      resendVerification,
      setOnboardingName,
      setScreenHours,
      clearOnboardingDraft,
      setupSelection,
      startRoutine,
      submitOnboarding,
      successSummary,
      toggleLocale,
      updateActiveSessionProgress,
      verifyPendingEmail,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppModel() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppModel must be used inside AppProvider.");
  }

  return context;
}
