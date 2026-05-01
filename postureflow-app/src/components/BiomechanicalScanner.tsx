import Body, {
  type ExtendedBodyPart,
  type Slug,
} from "react-native-body-highlighter";
import { useMemo, useState } from "react";
import { type DimensionValue, Pressable, Text, View } from "react-native";
import { messages } from "../i18n/messages";
import { onboardingDarkTheme } from "../theme/onboarding-pro-dark";
import type { LocaleCode, PainRegion } from "../types/app";
import { ff, hairline, rs } from "../utils/responsive";

type ScannerRegionId = string;
type ScannerView = "front" | "back";
type FigureMode = "both" | ScannerView;

type Hotspot = {
  id: ScannerRegionId;
  top: DimensionValue;
  left: DimensionValue;
  width: DimensionValue;
  height: DimensionValue;
};

type BiomechanicalScannerProps = {
  initialSelectedParts?: ScannerRegionId[];
  locale: LocaleCode;
  painRegions: PainRegion[];
  onConfirm: (selectedParts: ScannerRegionId[]) => void;
};

const SCANNER_THEME = {
  background: onboardingDarkTheme.background,
  surface: onboardingDarkTheme.porcelain,
  surfaceAlt: onboardingDarkTheme.backgroundRaised,
  panel: onboardingDarkTheme.card,
  border: onboardingDarkTheme.border,
  borderStrong: onboardingDarkTheme.borderStrong,
  accent: onboardingDarkTheme.accent,
  accentStroke: onboardingDarkTheme.accentStrong,
  primaryText: onboardingDarkTheme.textPrimary,
  secondaryText: onboardingDarkTheme.textSecondary,
  tertiaryText: onboardingDarkTheme.textTertiary,
  figureIdle: "#3A3337",
  figureStroke: "#76686F",
  selectedFill: onboardingDarkTheme.accent,
  selectedStroke: onboardingDarkTheme.accentStrong,
} as const;

const REGION_ORDER: ScannerRegionId[] = [
  "neck",
  "shoulders",
  "chest",
  "arms",
  "forearms",
  "hands",
  "core",
  "upper_back",
  "lower_back",
  "hips",
  "legs",
  "knees",
  "calves",
  "feet",
];

const BODY_LAYOUTS = {
  compact: {
    width: rs(134),
    height: rs(340),
    scale: 0.74,
  },
  focus: {
    width: rs(170),
    height: rs(400),
    scale: 0.94,
  },
} as const;

const HOTSPOTS: Record<ScannerView, Hotspot[]> = {
  front: [
    { id: "neck", top: "10%", left: "39%", width: "22%", height: "10%" },
    { id: "shoulders", top: "18%", left: "20%", width: "60%", height: "12%" },
    { id: "chest", top: "24%", left: "30%", width: "40%", height: "13%" },
    { id: "arms", top: "24%", left: "15%", width: "14%", height: "20%" },
    { id: "arms", top: "24%", left: "71%", width: "14%", height: "20%" },
    { id: "forearms", top: "39%", left: "11%", width: "13%", height: "17%" },
    { id: "forearms", top: "39%", left: "76%", width: "13%", height: "17%" },
    { id: "hands", top: "53%", left: "7%", width: "13%", height: "10%" },
    { id: "hands", top: "53%", left: "80%", width: "13%", height: "10%" },
    { id: "core", top: "37%", left: "30%", width: "40%", height: "18%" },
    { id: "hips", top: "51%", left: "31%", width: "38%", height: "12%" },
    { id: "legs", top: "60%", left: "28%", width: "18%", height: "18%" },
    { id: "legs", top: "60%", left: "54%", width: "18%", height: "18%" },
    { id: "knees", top: "76%", left: "30%", width: "14%", height: "8%" },
    { id: "knees", top: "76%", left: "56%", width: "14%", height: "8%" },
    { id: "calves", top: "82%", left: "30%", width: "14%", height: "13%" },
    { id: "calves", top: "82%", left: "56%", width: "14%", height: "13%" },
    { id: "feet", top: "94%", left: "28%", width: "16%", height: "7%" },
    { id: "feet", top: "94%", left: "56%", width: "16%", height: "7%" },
  ],
  back: [
    { id: "neck", top: "10%", left: "39%", width: "22%", height: "10%" },
    { id: "shoulders", top: "18%", left: "20%", width: "60%", height: "12%" },
    { id: "upper_back", top: "27%", left: "29%", width: "42%", height: "14%" },
    { id: "arms", top: "24%", left: "15%", width: "14%", height: "20%" },
    { id: "arms", top: "24%", left: "71%", width: "14%", height: "20%" },
    { id: "forearms", top: "39%", left: "11%", width: "13%", height: "17%" },
    { id: "forearms", top: "39%", left: "76%", width: "13%", height: "17%" },
    { id: "hands", top: "53%", left: "7%", width: "13%", height: "10%" },
    { id: "hands", top: "53%", left: "80%", width: "13%", height: "10%" },
    { id: "lower_back", top: "42%", left: "33%", width: "34%", height: "12%" },
    { id: "hips", top: "54%", left: "28%", width: "44%", height: "15%" },
    { id: "legs", top: "66%", left: "28%", width: "18%", height: "16%" },
    { id: "legs", top: "66%", left: "54%", width: "18%", height: "16%" },
    { id: "knees", top: "79%", left: "30%", width: "14%", height: "8%" },
    { id: "knees", top: "79%", left: "56%", width: "14%", height: "8%" },
    { id: "calves", top: "85%", left: "30%", width: "14%", height: "12%" },
    { id: "calves", top: "85%", left: "56%", width: "14%", height: "12%" },
    { id: "feet", top: "95%", left: "29%", width: "15%", height: "6%" },
    { id: "feet", top: "95%", left: "56%", width: "15%", height: "6%" },
  ],
};

const REGION_TO_BODY_PARTS: Record<
  ScannerRegionId,
  Record<ScannerView, ExtendedBodyPart[]>
> = {
  neck: {
    front: [{ slug: "neck", styles: activeStyles() }],
    back: [{ slug: "neck", styles: activeStyles() }],
  },
  shoulders: {
    front: [{ slug: "deltoids", styles: activeStyles() }],
    back: [
      { slug: "deltoids", styles: activeStyles() },
      { slug: "trapezius", styles: activeStyles() },
    ],
  },
  chest: {
    front: [{ slug: "chest", styles: activeStyles() }],
    back: [],
  },
  arms: {
    front: [{ slug: "biceps", styles: activeStyles() }],
    back: [{ slug: "triceps", styles: activeStyles() }],
  },
  forearms: {
    front: [{ slug: "forearm", styles: activeStyles() }],
    back: [{ slug: "forearm", styles: activeStyles() }],
  },
  hands: {
    front: [{ slug: "hands", styles: activeStyles() }],
    back: [{ slug: "hands", styles: activeStyles() }],
  },
  core: {
    front: [
      { slug: "abs", styles: activeStyles() },
      { slug: "obliques", styles: activeStyles() },
    ],
    back: [],
  },
  upper_back: {
    front: [],
    back: [{ slug: "upper-back", styles: activeStyles() }],
  },
  lower_back: {
    front: [],
    back: [{ slug: "lower-back", styles: activeStyles() }],
  },
  hips: {
    front: [{ slug: "adductors", styles: activeStyles() }],
    back: [{ slug: "gluteal", styles: activeStyles() }],
  },
  legs: {
    front: [{ slug: "quadriceps", styles: activeStyles() }],
    back: [{ slug: "hamstring", styles: activeStyles() }],
  },
  knees: {
    front: [{ slug: "knees", styles: activeStyles() }],
    back: [{ slug: "knees", styles: activeStyles() }],
  },
  calves: {
    front: [{ slug: "tibialis", styles: activeStyles() }],
    back: [{ slug: "calves", styles: activeStyles() }],
  },
  feet: {
    front: [{ slug: "feet", styles: activeStyles() }],
    back: [{ slug: "feet", styles: activeStyles() }],
  },
};

const SLUG_TO_REGION: Record<ScannerView, Partial<Record<Slug, ScannerRegionId>>> = {
  front: {
    neck: "neck",
    deltoids: "shoulders",
    chest: "chest",
    biceps: "arms",
    forearm: "forearms",
    hands: "hands",
    abs: "core",
    obliques: "core",
    adductors: "hips",
    quadriceps: "legs",
    knees: "knees",
    tibialis: "calves",
    feet: "feet",
  },
  back: {
    neck: "neck",
    deltoids: "shoulders",
    trapezius: "shoulders",
    "upper-back": "upper_back",
    "lower-back": "lower_back",
    triceps: "arms",
    forearm: "forearms",
    hands: "hands",
    gluteal: "hips",
    hamstring: "legs",
    knees: "knees",
    calves: "calves",
    feet: "feet",
  },
};

function activeStyles() {
  return {
    fill: SCANNER_THEME.selectedFill,
    stroke: SCANNER_THEME.selectedStroke,
    strokeWidth: 0.9,
  };
}

function percentToPx(value: DimensionValue, total: number) {
  if (typeof value === "string" && value.endsWith("%")) {
    return (Number.parseFloat(value) / 100) * total;
  }

  if (typeof value === "number") {
    return value;
  }

  return 0;
}

function BodySelectionDots({
  side,
  selectedParts,
  width,
  height,
}: {
  side: ScannerView;
  selectedParts: ScannerRegionId[];
  width: number;
  height: number;
}) {
  const activeHotspots = HOTSPOTS[side].filter((hotspot) =>
    selectedParts.includes(hotspot.id),
  );

  if (activeHotspots.length === 0) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", top: 0, left: 0, width, height }}
    >
      {activeHotspots.map((hotspot, index) => {
        const left = percentToPx(hotspot.left, width);
        const top = percentToPx(hotspot.top, height);
        const hotspotWidth = percentToPx(hotspot.width, width);
        const hotspotHeight = percentToPx(hotspot.height, height);
        const centerX = left + hotspotWidth / 2;
        const centerY = top + hotspotHeight / 2;

        return (
          <View
            key={`tension-dot-${side}-${hotspot.id}-${index}`}
            style={{
              position: "absolute",
              top: centerY - rs(9),
              left: centerX - rs(9),
              width: rs(18),
              height: rs(18),
              borderRadius: rs(9),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                position: "absolute",
                width: rs(18),
                height: rs(18),
                borderRadius: rs(9),
                backgroundColor: onboardingDarkTheme.accentStrong,
                opacity: 0.2,
              }}
            />
            <View
              style={{
                width: rs(9),
                height: rs(9),
                borderRadius: rs(5),
                backgroundColor: onboardingDarkTheme.accentStrong,
              }}
            />
          </View>
        );
      })}
    </View>
  );
}

function BodyHotspots({
  selectedParts,
  side,
  onToggle,
}: {
  selectedParts: ScannerRegionId[];
  side: ScannerView;
  onToggle: (part: ScannerRegionId) => void;
}) {
  return (
    <View pointerEvents="box-none" style={{ position: "absolute", inset: 0 }}>
      {HOTSPOTS[side].map((hotspot, index) => {
        const isSelected = selectedParts.includes(hotspot.id);

        return (
          <Pressable
            key={`${side}-${hotspot.id}-${index}`}
            hitSlop={10}
            onPress={() => onToggle(hotspot.id)}
            style={({ pressed }) => ({
              position: "absolute",
              top: hotspot.top,
              left: hotspot.left,
              width: hotspot.width,
              height: hotspot.height,
              borderRadius: rs(999),
              backgroundColor: isSelected
                ? onboardingDarkTheme.accentSoft
                : pressed
                  ? onboardingDarkTheme.accentSoft
                  : "transparent",
              borderWidth: 0,
            })}
          />
        );
      })}
    </View>
  );
}

function BodyFigure({
  data,
  label,
  side,
  selectedParts,
  onPress,
  onToggle,
  layout,
}: {
  data: ExtendedBodyPart[];
  label: string;
  side: ScannerView;
  selectedParts: ScannerRegionId[];
  onPress: (slug?: Slug) => void;
  onToggle: (part: ScannerRegionId) => void;
  layout: keyof typeof BODY_LAYOUTS;
}) {
  const size = BODY_LAYOUTS[layout];

  return (
    <View style={{ alignItems: "center", flex: 1, minHeight: 0 }}>
      <Text
        style={{
          color: onboardingDarkTheme.textTertiary,
          fontFamily: ff,
          fontSize: rs(9),
          fontWeight: "800",
          letterSpacing: 1.5,
          marginBottom: rs(10),
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>

      <View
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          borderRadius: rs(16),
          backgroundColor: onboardingDarkTheme.backgroundRaised,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <View
          style={{
            width: size.width,
            height: size.height,
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Body
            border="none"
            data={data}
            defaultFill={SCANNER_THEME.figureIdle}
            defaultStroke={SCANNER_THEME.figureStroke}
            defaultStrokeWidth={0.9}
            gender="male"
            scale={size.scale}
            side={side}
            onBodyPartPress={(part) => onPress(part.slug)}
          />

          <BodySelectionDots
            side={side}
            selectedParts={selectedParts}
            width={size.width}
            height={size.height}
          />

          <BodyHotspots
            selectedParts={selectedParts}
            side={side}
            onToggle={onToggle}
          />
        </View>
      </View>
    </View>
  );
}

export function BiomechanicalScanner({
  initialSelectedParts = [],
  locale,
  painRegions,
  onConfirm,
}: BiomechanicalScannerProps) {
  const [selectedParts, setSelectedParts] =
    useState<ScannerRegionId[]>(initialSelectedParts);
  const [figureMode, setFigureMode] = useState<FigureMode>("both");
  const copy = messages[locale];

  const frontData = useMemo(
    () => selectedParts.flatMap((part) => REGION_TO_BODY_PARTS[part]?.front ?? []),
    [selectedParts],
  );

  const backData = useMemo(
    () => selectedParts.flatMap((part) => REGION_TO_BODY_PARTS[part]?.back ?? []),
    [selectedParts],
  );

  const selectedZoneLabels = REGION_ORDER.filter((regionId) =>
    selectedParts.includes(regionId),
  ).map((regionId) => {
    const match = painRegions.find((region) => region.id === regionId);
    return match?.label[locale] ?? regionId.replace(/_/g, " ");
  });

  const togglePart = (part: ScannerRegionId) => {
    setSelectedParts((current) =>
      current.includes(part)
        ? current.filter((item) => item !== part)
        : [...current, part],
    );
  };

  const handleBodyPartPress = (view: ScannerView, slug?: Slug) => {
    if (!slug) {
      return;
    }

    const mappedRegion = SLUG_TO_REGION[view][slug];
    if (!mappedRegion) {
      return;
    }

    togglePart(mappedRegion);
  };

  return (
    <View style={{ width: "100%", flex: 1, height: "100%", minHeight: 0 }}>
      <View
        style={{
          backgroundColor: onboardingDarkTheme.backgroundRaised,
          borderRadius: rs(999),
          padding: rs(4),
          flexDirection: "row",
          marginBottom: rs(14),
        }}
      >
        {([
          { id: "both", label: copy.painMap.both },
          { id: "front", label: copy.painMap.front },
          { id: "back", label: copy.painMap.back },
        ] as const).map((option) => {
          const active = figureMode === option.id;

          return (
            <Pressable
              key={option.id}
              onPress={() => setFigureMode(option.id)}
              style={({ pressed }) => ({
                flex: 1,
                borderRadius: rs(999),
                backgroundColor: active
                  ? onboardingDarkTheme.textPrimary
                  : "transparent",
                opacity: pressed ? 0.85 : 1,
                paddingVertical: rs(9),
              })}
            >
              <Text
                style={{
                  color: active
                    ? onboardingDarkTheme.background
                    : onboardingDarkTheme.textTertiary,
                  fontFamily: ff,
                  fontSize: rs(11),
                  fontWeight: active ? "800" : "700",
                  letterSpacing: 0.5,
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View
        style={{
          backgroundColor: onboardingDarkTheme.porcelain,
          borderWidth: hairline,
          borderColor: onboardingDarkTheme.border,
          borderRadius: rs(28),
          flex: 1,
          minHeight: 0,
          flexDirection: "row",
          gap: rs(12),
          alignItems: "stretch",
          paddingHorizontal: rs(20),
          paddingVertical: rs(24),
          marginBottom: rs(8),
          justifyContent: "center",
        }}
      >
        {(figureMode === "both" || figureMode === "front") && (
          <BodyFigure
            data={frontData}
            label={copy.painMap.front}
            layout={figureMode === "both" ? "compact" : "focus"}
            side="front"
            selectedParts={selectedParts}
            onPress={(slug) => handleBodyPartPress("front", slug)}
            onToggle={togglePart}
          />
        )}

        {(figureMode === "both" || figureMode === "back") && (
          <BodyFigure
            data={backData}
            label={copy.painMap.back}
            layout={figureMode === "both" ? "compact" : "focus"}
            side="back"
            selectedParts={selectedParts}
            onPress={(slug) => handleBodyPartPress("back", slug)}
            onToggle={togglePart}
          />
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: rs(8),
          marginBottom: rs(8),
          paddingHorizontal: rs(4),
          paddingVertical: rs(12),
        }}
      >
        {selectedParts.length > 0 ? (
          <>
            <View
              style={{
                alignItems: "center",
                flex: 1,
                flexDirection: "row",
                gap: rs(8),
              }}
            >
            <View
              style={{
                width: rs(7),
                height: rs(7),
                borderRadius: rs(4),
                backgroundColor: onboardingDarkTheme.accentStrong,
              }}
            />
            <Text
              numberOfLines={1}
              style={{
                color: onboardingDarkTheme.textPrimary,
                flex: 1,
                fontFamily: ff,
                fontSize: rs(13),
                fontWeight: "700",
              }}
            >
              {selectedZoneLabels.join(" · ")}
            </Text>
            </View>
            <Text
              style={{
                color: onboardingDarkTheme.border,
                fontFamily: ff,
                fontSize: rs(13),
                fontWeight: "400",
                marginLeft: "auto",
              }}
            >
              {locale === "es"
                ? `${selectedParts.length} zonas`
                : `${selectedParts.length} zones`}
            </Text>
          </>
        ) : (
          <Text
            style={{
              color: onboardingDarkTheme.textTertiary,
              fontFamily: ff,
              fontSize: rs(13),
              fontWeight: "600",
            }}
          >
            {locale === "es" ? "Toca para seleccionar" : "Tap to select"}
          </Text>
        )}
      </View>

      <View style={{ paddingBottom: rs(12) }}>
        <View
          style={{
            flexDirection: "row",
            gap: rs(6),
            marginBottom: rs(20),
          }}
        >
          {[0, 1, 2].map((item) => (
            <View
              key={item}
              style={{
                width: item === 2 ? rs(24) : rs(8),
                height: rs(4),
                borderRadius: rs(2),
                backgroundColor:
                  item === 2
                    ? onboardingDarkTheme.accentStrong
                    : onboardingDarkTheme.border,
              }}
            />
          ))}
        </View>

        <Pressable
          disabled={selectedParts.length === 0}
          onPress={() => onConfirm(selectedParts)}
          style={({ pressed }) => ({
            backgroundColor: onboardingDarkTheme.textPrimary,
            borderRadius: rs(18),
            opacity: selectedParts.length === 0 ? 0.4 : pressed ? 0.86 : 1,
            paddingVertical: rs(18),
          })}
        >
          <Text
            style={{
              color: onboardingDarkTheme.background,
              fontFamily: ff,
              fontSize: rs(16),
              fontWeight: "800",
              textAlign: "center",
            }}
          >
            {locale === "es" ? "Crear mi flujo" : "Create my flow"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
