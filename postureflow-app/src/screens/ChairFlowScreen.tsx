import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Clock3,
  Play,
  RefreshCcw,
  SlidersHorizontal,
} from "lucide-react-native";
import { ChairFlowVideo } from "../components/chair-flow/ChairFlowVideo";
import {
  ChairFlowFilter,
  useChairFlowExercises,
} from "../hooks/useChairFlowExercises";
import type { AppScreenProps, ChairFlowExercise } from "../types/app";

type Props = AppScreenProps<"ChairFlow">;

const CHAIR_FLOW_THEME = {
  warmSlate: "#2F353B",
  warmSlateDeep: "#272D33",
  surface: "#394149",
  surfaceRaised: "#424B54",
  border: "rgba(247, 239, 230, 0.16)",
  terracotta: "#E2725B",
  terracottaOverlay: "rgba(226, 114, 91, 0.58)",
  cinnamon: "#D2691E",
  cinnamonSoft: "rgba(210, 105, 30, 0.18)",
  cinnamonMid: "rgba(210, 105, 30, 0.34)",
  textPrimary: "#F7EFE6",
  textSecondary: "#D2C6BB",
  textMuted: "#A99F96",
  shadow: "#171B1F",
} as const;

const categoryLabels: Record<ChairFlowFilter, string> = {
  All: "All",
  "Upper Body": "Upper Body",
  "Lower Body": "Lower Body",
  "Full Flow": "Full Flow",
};

export function ChairFlowScreen({ navigation }: Props) {
  const { categories, exercises, isFallback, isLoading, refresh } =
    useChairFlowExercises();
  const [activeFilter, setActiveFilter] = useState<ChairFlowFilter>("All");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 460) - 40;
  const mediaHeight = Math.max(202, Math.round((contentWidth * 9) / 16));

  const filteredExercises = useMemo(
    () =>
      activeFilter === "All"
        ? exercises
        : exercises.filter((exercise) => exercise.category === activeFilter),
    [activeFilter, exercises],
  );

  useEffect(() => {
    if (!playingId) {
      return;
    }

    const selectedStillVisible = filteredExercises.some(
      (exercise) => exercise.id === playingId,
    );

    if (!selectedStillVisible) {
      setPlayingId(null);
    }
  }, [filteredExercises, playingId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        decelerationRate="fast"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            hitSlop={8}
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.headerAction,
              pressed ? styles.pressed : null,
            ]}
          >
            <ChevronLeft color={CHAIR_FLOW_THEME.textPrimary} size={20} />
          </Pressable>

          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>PostureFlow</Text>
            <Text style={styles.title}>Chair Flow</Text>
          </View>

          <Pressable
            hitSlop={8}
            onPress={() => void refresh()}
            style={({ pressed }) => [
              styles.headerAction,
              pressed ? styles.pressed : null,
            ]}
          >
            <RefreshCcw color={CHAIR_FLOW_THEME.textPrimary} size={18} />
          </Pressable>
        </View>

        <View style={styles.intentBar}>
          <SlidersHorizontal color={CHAIR_FLOW_THEME.terracotta} size={15} />
          <Text style={styles.intentText}>
            {isFallback ? "Local catalog" : "Curated chair routines"}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.filters}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {categories.map((category) => {
            const isActive = activeFilter === category;

            return (
              <Pressable
                key={category}
                onPress={() => setActiveFilter(category)}
                style={({ pressed }) => [
                  styles.filterChip,
                  isActive ? styles.filterChipActive : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive ? styles.filterTextActive : null,
                  ]}
                >
                  {categoryLabels[category]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {isLoading ? (
          <ChairFlowSkeleton />
        ) : (
          <View style={styles.list}>
            {filteredExercises.map((exercise) => (
              <ChairExerciseCard
                key={exercise.id}
                exercise={exercise}
                mediaHeight={mediaHeight}
                mediaWidth={contentWidth - 2}
                isPlaying={playingId === exercise.id}
                onToggle={() =>
                  setPlayingId((current) =>
                    current === exercise.id ? null : exercise.id,
                  )
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ChairExerciseCard({
  exercise,
  mediaHeight,
  mediaWidth,
  isPlaying,
  onToggle,
}: {
  exercise: ChairFlowExercise;
  mediaHeight: number;
  mediaWidth: number;
  isPlaying: boolean;
  onToggle: () => void;
}) {
  const thumbnailUrl = `https://i.ytimg.com/vi/${exercise.youtubeId}/hqdefault.jpg`;

  return (
    <View style={styles.card}>
      <Pressable onPress={onToggle} style={styles.mediaShell}>
        {isPlaying ? (
          <ChairFlowVideo
            height={mediaHeight}
            width={mediaWidth}
            videoId={exercise.youtubeId}
            startTime={exercise.startTime}
            endTime={exercise.endTime}
            isPlaying={isPlaying}
            webViewStyle={styles.youtubeWebView}
            viewContainerStyle={styles.youtubeContainer}
          />
        ) : (
          <>
            <Image
              resizeMode="cover"
              source={{ uri: thumbnailUrl }}
              style={[styles.thumbnail, { height: mediaHeight }]}
            />
            <View style={styles.thumbnailOverlay} />
            <View style={styles.playPlate}>
              <Play
                color={CHAIR_FLOW_THEME.textPrimary}
                fill={CHAIR_FLOW_THEME.textPrimary}
                size={18}
              />
              <Text style={styles.playLabel}>Play</Text>
            </View>
          </>
        )}
      </Pressable>

      <View style={styles.cardBody}>
        <View style={styles.metaRow}>
          <View style={styles.metaBadge}>
            <Text style={styles.metaText}>{exercise.category}</Text>
          </View>
          <View style={styles.durationBadge}>
            <Clock3 color={CHAIR_FLOW_THEME.textSecondary} size={13} />
            <Text style={styles.durationText}>{exercise.duration}</Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{exercise.title}</Text>
        <Text style={styles.cardSubtitle}>{exercise.difficulty}</Text>
      </View>
    </View>
  );
}

function ChairFlowSkeleton() {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          duration: 720,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          duration: 720,
          toValue: 0.45,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={styles.skeletonList}>
      {[0, 1, 2].map((item) => (
        <Animated.View key={item} style={[styles.skeletonCard, { opacity }]}>
          <View style={styles.skeletonMedia} />
          <View style={styles.skeletonLineWide} />
          <View style={styles.skeletonLineShort} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: CHAIR_FLOW_THEME.warmSlate,
    flex: 1,
  },
  content: {
    alignSelf: "center",
    maxWidth: 460,
    paddingBottom: 36,
    paddingHorizontal: 20,
    paddingTop: 18,
    width: "100%",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 16,
  },
  headerAction: {
    alignItems: "center",
    backgroundColor: CHAIR_FLOW_THEME.surface,
    borderColor: CHAIR_FLOW_THEME.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  headerCopy: {
    flex: 1,
    paddingHorizontal: 14,
  },
  eyebrow: {
    color: CHAIR_FLOW_THEME.textMuted,
    fontFamily: "System",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: {
    color: CHAIR_FLOW_THEME.textPrimary,
    fontFamily: "System",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
    marginTop: 3,
  },
  intentBar: {
    alignItems: "center",
    backgroundColor: CHAIR_FLOW_THEME.surface,
    borderColor: CHAIR_FLOW_THEME.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 14,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  intentText: {
    color: CHAIR_FLOW_THEME.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.9,
    marginLeft: 8,
    textTransform: "uppercase",
  },
  filters: {
    gap: 10,
    paddingBottom: 18,
  },
  filterChip: {
    backgroundColor: CHAIR_FLOW_THEME.surface,
    borderColor: CHAIR_FLOW_THEME.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  filterChipActive: {
    backgroundColor: CHAIR_FLOW_THEME.terracotta,
    borderColor: CHAIR_FLOW_THEME.terracotta,
  },
  filterText: {
    color: CHAIR_FLOW_THEME.textSecondary,
    fontSize: 13,
    fontWeight: "800",
  },
  filterTextActive: {
    color: CHAIR_FLOW_THEME.textPrimary,
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: CHAIR_FLOW_THEME.surface,
    borderColor: CHAIR_FLOW_THEME.border,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: CHAIR_FLOW_THEME.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 22,
    elevation: 6,
  },
  mediaShell: {
    backgroundColor: CHAIR_FLOW_THEME.warmSlateDeep,
    minHeight: 202,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: CHAIR_FLOW_THEME.terracottaOverlay,
  },
  playPlate: {
    alignItems: "center",
    backgroundColor: "rgba(39, 45, 51, 0.72)",
    borderColor: "rgba(247, 239, 230, 0.18)",
    borderRadius: 12,
    borderWidth: 1,
    bottom: 14,
    flexDirection: "row",
    paddingHorizontal: 13,
    paddingVertical: 10,
    position: "absolute",
    right: 14,
  },
  playLabel: {
    color: CHAIR_FLOW_THEME.textPrimary,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginLeft: 8,
    textTransform: "uppercase",
  },
  youtubeContainer: {
    backgroundColor: CHAIR_FLOW_THEME.warmSlateDeep,
  },
  youtubeWebView: {
    backgroundColor: CHAIR_FLOW_THEME.warmSlateDeep,
    opacity: 0.98,
  },
  cardBody: {
    padding: 16,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  metaBadge: {
    backgroundColor: CHAIR_FLOW_THEME.cinnamon,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  metaText: {
    color: CHAIR_FLOW_THEME.textPrimary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.9,
    textTransform: "uppercase",
  },
  durationBadge: {
    alignItems: "center",
    backgroundColor: CHAIR_FLOW_THEME.warmSlateDeep,
    borderColor: CHAIR_FLOW_THEME.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  durationText: {
    color: CHAIR_FLOW_THEME.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 6,
  },
  cardTitle: {
    color: CHAIR_FLOW_THEME.textPrimary,
    fontSize: 21,
    fontWeight: "900",
    lineHeight: 26,
  },
  cardSubtitle: {
    color: CHAIR_FLOW_THEME.textMuted,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 7,
    textTransform: "uppercase",
  },
  skeletonList: {
    gap: 16,
  },
  skeletonCard: {
    backgroundColor: CHAIR_FLOW_THEME.surface,
    borderColor: CHAIR_FLOW_THEME.border,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    padding: 14,
  },
  skeletonMedia: {
    backgroundColor: CHAIR_FLOW_THEME.cinnamonSoft,
    borderRadius: 12,
    height: 206,
    marginBottom: 16,
  },
  skeletonLineWide: {
    backgroundColor: CHAIR_FLOW_THEME.cinnamonMid,
    borderRadius: 12,
    height: 18,
    marginBottom: 10,
    width: "78%",
  },
  skeletonLineShort: {
    backgroundColor: CHAIR_FLOW_THEME.cinnamonSoft,
    borderRadius: 12,
    height: 14,
    width: "44%",
  },
  pressed: {
    opacity: 0.78,
  },
});
