import {
  Info,
  Pause,
  Play,
  RotateCcw,
  X,
} from "lucide-react-native";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useMemo, useState } from "react";
import { ScreenAtmosphere } from "../components/ScreenAtmosphere";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import { zenAmbientGlow, zenDarkTheme, zenGlassEffect } from "../theme/zen-dark";
import type { AppScreenProps } from "../types/app";
import { formatSeconds, getLocalizedText } from "../utils/localize";

type Props = AppScreenProps<"Player">;

export function PlayerScreen({ navigation, route }: Props) {
  const {
    locale,
    startRoutine,
    updateActiveSessionProgress,
    completeActiveSession,
  } = useAppModel();
  const [routine, setRoutine] = useState<Awaited<ReturnType<typeof startRoutine>>>(null);
  const [isPlaying, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const copy = messages[locale];

  useEffect(() => {
    let active = true;

    void startRoutine(route.params.routineId).then((value) => {
      if (active) {
        setRoutine(value);
      }
    });

    return () => {
      active = false;
    };
  }, [route.params.routineId, startRoutine]);

  const totalDurationSeconds = routine?.totalDurationSeconds ?? 1;

  useEffect(() => {
    if (!routine || !isPlaying) {
      return;
    }

    const step = 100 / (totalDurationSeconds * 10);
    const interval = setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + step, 100);
        void updateActiveSessionProgress(next);
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, routine, totalDurationSeconds, updateActiveSessionProgress]);

  useEffect(() => {
    if (progress < 100 || !routine) {
      return;
    }

    void completeActiveSession(route.params.routineId).then(() => {
      navigation.replace("Success");
    });
  }, [completeActiveSession, navigation, progress, route.params.routineId, routine]);

  const currentSeconds = useMemo(
    () => Math.round((progress / 100) * totalDurationSeconds),
    [progress, totalDurationSeconds],
  );

  if (!routine) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: zenDarkTheme.canvas,
        }}
      >
        <ActivityIndicator color={zenDarkTheme.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: zenDarkTheme.canvas }}>
      <ScreenAtmosphere />
      <View style={{ flex: 1, padding: 18 }}>
        <View
          style={{
            position: "absolute",
            left: 24,
            right: 24,
            top: 24,
            zIndex: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              height: 40,
              width: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              borderWidth: 1,
              borderColor: zenDarkTheme.border,
              backgroundColor: zenDarkTheme.surfaceGlass,
              ...zenAmbientGlow(0.05, 14),
              ...zenGlassEffect,
            }}
          >
            <X color={zenDarkTheme.textSecondary} size={18} />
          </Pressable>

          <View
            style={{
              borderRadius: 999,
              backgroundColor: zenDarkTheme.surfaceOverlay,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: zenDarkTheme.border,
              ...zenGlassEffect,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "500", letterSpacing: 1, textTransform: "uppercase", color: zenDarkTheme.textSecondary }}>
              {`${formatSeconds(currentSeconds)} / ${formatSeconds(totalDurationSeconds)}`}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 64,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              marginBottom: 24,
              height: 434,
              width: "100%",
              overflow: "hidden",
              borderRadius: 38,
              backgroundColor: zenDarkTheme.surface,
              borderWidth: 1,
              borderColor: zenDarkTheme.border,
              ...zenAmbientGlow(0.1, 28),
            }}
          >
            <Image
              source={{ uri: routine.imageUrl }}
              style={{ height: "100%", width: "100%" }}
              resizeMode="cover"
            />

            {!isPlaying ? (
              <View
                style={{
                  position: "absolute",
                  inset: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(20,18,16,0.28)",
                }}
              >
                <Pressable
                  onPress={() => setPlaying(true)}
                  style={{
                    height: 80,
                    width: 80,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 999,
                    backgroundColor: zenDarkTheme.sandSoft,
                  }}
                >
                  <Play
                    color={zenDarkTheme.textPrimary}
                    fill={zenDarkTheme.textPrimary}
                    size={28}
                  />
                </Pressable>
              </View>
            ) : null}
          </View>

          <View
            style={{
              position: "absolute",
              bottom: 150,
              left: 18,
              right: 18,
              borderRadius: 30,
              borderWidth: 1,
              borderColor: zenDarkTheme.border,
              backgroundColor: zenDarkTheme.surfaceOverlay,
              padding: 18,
              ...zenAmbientGlow(0.06, 18),
              ...zenGlassEffect,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <View
                style={{
                  marginRight: 12,
                  marginTop: 4,
                  borderRadius: 999,
                  backgroundColor: zenDarkTheme.accentSoft,
                  padding: 8,
                }}
              >
                <Info color={zenDarkTheme.accent} size={16} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase", color: zenDarkTheme.textPrimary }}>
                  {copy.player.position}
                </Text>
                <Text style={{ marginTop: 4, fontSize: 14, fontWeight: "600", lineHeight: 20, color: zenDarkTheme.textSecondary }}>
                  {getLocalizedText(routine.tipBody, locale)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            borderRadius: 34,
            borderWidth: 1,
            borderColor: zenDarkTheme.border,
            backgroundColor: zenDarkTheme.surfaceGlass,
            padding: 24,
            ...zenAmbientGlow(0.1, 24),
            ...zenGlassEffect,
          }}
        >
          <View
            style={{
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ flex: 1, paddingRight: 12, fontSize: 21, fontWeight: "900", letterSpacing: -0.5, color: zenDarkTheme.textPrimary }}>
              {getLocalizedText(routine.title, locale)}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: zenDarkTheme.textTertiary }}>
              {getLocalizedText(routine.repetitionsLabel, locale)}
            </Text>
          </View>

          <View
            style={{
              marginBottom: 24,
              height: 10,
              overflow: "hidden",
              borderRadius: 999,
              backgroundColor: zenDarkTheme.surfaceMuted,
            }}
          >
            <View
              style={{
                height: "100%",
                borderRadius: 999,
                backgroundColor: zenDarkTheme.accent,
                width: `${progress}%`,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pressable style={{ marginRight: 48 }}>
              <RotateCcw color={zenDarkTheme.textSecondary} size={22} />
            </Pressable>

            <Pressable
              onPress={() => setPlaying((current) => !current)}
              style={{
                height: 64,
                width: 64,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                backgroundColor: zenDarkTheme.buttonPrimary,
                borderWidth: 1,
                borderColor: zenDarkTheme.borderMuted,
                ...zenGlassEffect,
              }}
            >
              {isPlaying ? (
                <Pause color={zenDarkTheme.textInverse} fill={zenDarkTheme.textInverse} size={24} />
              ) : (
                <Play color={zenDarkTheme.textInverse} fill={zenDarkTheme.textInverse} size={24} />
              )}
            </Pressable>

            <Pressable
              onPress={() => {
                void completeActiveSession(route.params.routineId).then(() => {
                  navigation.replace("Success");
                });
              }}
              style={{ marginLeft: 48 }}
            >
              <Text style={{ fontSize: 14, fontWeight: "500", letterSpacing: 1, textTransform: "uppercase", color: zenDarkTheme.textTertiary }}>
                {copy.common.skip}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
