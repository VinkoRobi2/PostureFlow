import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { AnalyzingScreen } from "../screens/AnalyzingScreen";
import { AuthScreen } from "../screens/AuthScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { LibraryScreen } from "../screens/LibraryScreen";
import { OnboardingAhaScreen } from "../screens/onboarding/OnboardingAhaScreen";
import { OnboardingHoursScreen } from "../screens/onboarding/OnboardingHoursScreen";
import { OnboardingNameScreen } from "../screens/onboarding/OnboardingNameScreen";
import { OnboardingProblemScreen } from "../screens/onboarding/OnboardingProblemScreen";
import { OnboardingScannerScreen } from "../screens/onboarding/OnboardingScannerScreen";
import { OnboardingSolutionScreen } from "../screens/onboarding/OnboardingSolutionScreen";
import { OnboardingTrustScreen } from "../screens/onboarding/OnboardingTrustScreen";
import { PainMapScreen } from "../screens/PainMapScreen";
import { PaywallScreen } from "../screens/PaywallScreen";
import { PlayerScreen } from "../screens/PlayerScreen";
import { SetupScreen } from "../screens/SetupScreen";
import { SplashScreen } from "../screens/SplashScreen";
import { SuccessScreen } from "../screens/SuccessScreen";
import { VerifyEmailScreen } from "../screens/VerifyEmailScreen";
import { zenDarkTheme } from "../theme/zen-dark";
import {
  AppNavigation,
  AppRoute,
  RootStackParamList,
} from "../types/app";

type RouteEntry<Name extends keyof RootStackParamList = keyof RootStackParamList> =
  AppRoute<Name>;

function createRoute<Name extends keyof RootStackParamList>(
  name: Name,
  params?: RootStackParamList[Name],
): RouteEntry<Name> {
  return {
    key: `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    params: (params ?? undefined) as RootStackParamList[Name],
  };
}

export function RootNavigator() {
  const [stack, setStack] = useState<RouteEntry[]>([createRoute("Splash")]);

  const navigate = useCallback<AppNavigation["navigate"]>((name, params) => {
    setStack((current) => [...current, createRoute(name, params)]);
  }, []);

  const replace = useCallback<AppNavigation["replace"]>((name, params) => {
    setStack((current) => [
      ...current.slice(0, Math.max(current.length - 1, 0)),
      createRoute(name, params),
    ]);
  }, []);

  const goBack = useCallback(() => {
    setStack((current) => (current.length > 1 ? current.slice(0, -1) : current));
  }, []);

  const navigation = useMemo<AppNavigation>(
    () => ({
      navigate,
      replace,
      goBack,
    }),
    [goBack, navigate, replace],
  );

  const currentRoute = stack[stack.length - 1];

  return (
    <View style={{ flex: 1, backgroundColor: zenDarkTheme.canvas }}>
      {renderCurrentRoute(currentRoute, navigation)}
    </View>
  );
}

function renderCurrentRoute(route: RouteEntry, navigation: AppNavigation) {
  switch (route.name) {
    case "Splash":
      return (
        <SplashScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"Splash">}
          isFocused
        />
      );
    case "Auth":
      return (
        <AuthScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"Auth">}
          isFocused
        />
      );
    case "OnboardingProblem":
      return (
        <OnboardingProblemScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"OnboardingProblem">}
          isFocused
        />
      );
    case "OnboardingSolution":
      return (
        <OnboardingSolutionScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"OnboardingSolution">}
          isFocused
        />
      );
    case "OnboardingName":
      return (
        <OnboardingNameScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"OnboardingName">}
          isFocused
        />
      );
    case "OnboardingHours":
      return (
        <OnboardingHoursScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"OnboardingHours">}
          isFocused
        />
      );
    case "OnboardingScanner":
      return (
        <OnboardingScannerScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"OnboardingScanner">}
          isFocused
        />
      );
    case "OnboardingAha":
      return (
        <OnboardingAhaScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"OnboardingAha">}
          isFocused
        />
      );
    case "OnboardingTrust":
      return (
        <OnboardingTrustScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"OnboardingTrust">}
          isFocused
        />
      );
    case "VerifyEmail":
      return (
        <VerifyEmailScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"VerifyEmail">}
          isFocused
        />
      );
    case "PainMap":
      return (
        <PainMapScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"PainMap">}
          isFocused
        />
      );
    case "Setup":
      return (
        <SetupScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"Setup">}
          isFocused
        />
      );
    case "Analyzing":
      return (
        <AnalyzingScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"Analyzing">}
          isFocused
        />
      );
    case "Dashboard":
      return (
        <DashboardScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"Dashboard">}
          isFocused
        />
      );
    case "Library":
      return (
        <LibraryScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"Library">}
          isFocused
        />
      );
    case "Paywall":
      return (
        <PaywallScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"Paywall">}
          isFocused
        />
      );
    case "Player":
      return (
        <PlayerScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"Player">}
          isFocused
        />
      );
    case "Success":
      return (
        <SuccessScreen
          key={route.key}
          navigation={navigation}
          route={route as AppRoute<"Success">}
          isFocused
        />
      );
    default:
      return null;
  }
}
