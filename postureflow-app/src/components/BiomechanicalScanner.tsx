import Body, {
  type ExtendedBodyPart,
  type Slug,
} from "react-native-body-highlighter";
import { ArrowRight, Check, RotateCcw, User, Users } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  type DimensionValue,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
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
    width: rs(102),
    height: rs(250),
    scale: 0.54,
  },
  focus: {
    width: rs(138),
    height: rs(292),
    scale: 0.66,
  },
} as const;

const VIEW_SEQUENCE: FigureMode[] = ["front", "back", "both"];

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
    <View pointerEvents="box-none" style={StyleSheet.absoluteFillObject}>
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
    <View style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
      <View
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          borderRadius: rs(20),
          backgroundColor: onboardingDarkTheme.backgroundRaised,
          borderWidth: hairline,
          borderColor: onboardingDarkTheme.border,
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: rs(10),
            alignSelf: "center",
            borderRadius: rs(999),
            backgroundColor: onboardingDarkTheme.porcelain,
            borderWidth: hairline,
            borderColor: onboardingDarkTheme.border,
            paddingHorizontal: rs(10),
            paddingVertical: rs(5),
            zIndex: 2,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: onboardingDarkTheme.textSecondary,
              fontFamily: ff,
              fontSize: rs(10),
              fontWeight: "800",
              lineHeight: rs(13),
              textAlign: "center",
              includeFontPadding: false,
            }}
          >
            {label}
          </Text>
        </View>

        <View
          style={{
            width: size.width,
            height: size.height,
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            marginTop: rs(8),
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

function ViewModeIcon({
  active,
  mode,
}: {
  active: boolean;
  mode: FigureMode;
}) {
  const iconColor = active
    ? onboardingDarkTheme.background
    : onboardingDarkTheme.textSecondary;
  const iconSize = rs(18);
  const iconStroke = active ? 2.1 : 1.8;

  if (mode === "front") {
    return <User color={iconColor} size={iconSize} strokeWidth={iconStroke} />;
  }

  if (mode === "back") {
    return (
      <RotateCcw color={iconColor} size={iconSize} strokeWidth={iconStroke} />
    );
  }

  return <Users color={iconColor} size={iconSize} strokeWidth={iconStroke} />;
}

export function BiomechanicalScanner({
  initialSelectedParts = [],
  locale,
  painRegions,
  onConfirm,
}: BiomechanicalScannerProps) {
  const { height: screenH, width: screenW } = useWindowDimensions();
  const [selectedParts, setSelectedParts] =
    useState<ScannerRegionId[]>(initialSelectedParts);
  const [figureMode, setFigureMode] = useState<FigureMode>("both");
  const copy = messages[locale];
  const compactScreen = screenH < 720 || screenW < 380;
  const figurePanelHeight =
    figureMode === "both"
      ? compactScreen
        ? rs(288)
        : rs(306)
      : compactScreen
        ? rs(326)
        : rs(350);

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
  const hasSelection = selectedParts.length > 0;
  const selectedPreview = selectedZoneLabels.slice(0, 3).join(" / ");
  const selectedZoneText =
    selectedZoneLabels.length > 3
      ? `${selectedPreview} +${selectedZoneLabels.length - 3}`
      : selectedPreview;
  const viewOptions: Record<FigureMode, { label: string; hint: string }> =
    locale === "es"
      ? {
          front: { label: "Frontal", hint: "Vista" },
          back: { label: "Posterior", hint: "Vista" },
          both: { label: "Completo", hint: "2 vistas" },
        }
      : {
          front: { label: "Front", hint: "View" },
          back: { label: "Back", hint: "View" },
          both: { label: "Both", hint: "Views" },
        };

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
    <View style={{ width: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          gap: compactScreen ? rs(7) : rs(9),
          marginBottom: compactScreen ? rs(10) : rs(12),
        }}
      >
        {VIEW_SEQUENCE.map((mode) => {
          const active = figureMode === mode;
          const option = viewOptions[mode];

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={mode}
              onPress={() => setFigureMode(mode)}
              style={({ pressed }) => ({
                flex: 1,
                minWidth: 0,
                minHeight: compactScreen ? rs(62) : rs(68),
                borderRadius: rs(18),
                borderWidth: hairline,
                borderColor: active
                  ? onboardingDarkTheme.textPrimary
                  : onboardingDarkTheme.border,
                backgroundColor: active
                  ? onboardingDarkTheme.textPrimary
                  : onboardingDarkTheme.porcelain,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.9 : 1,
                paddingHorizontal: compactScreen ? rs(6) : rs(8),
                paddingVertical: compactScreen ? rs(8) : rs(10),
                transform: [{ scale: pressed ? 0.99 : 1 }],
              })}
            >
              <View
                style={{
                  width: compactScreen ? rs(28) : rs(32),
                  height: compactScreen ? rs(28) : rs(32),
                  borderRadius: compactScreen ? rs(10) : rs(12),
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: active
                    ? "rgba(237,234,228,0.14)"
                    : onboardingDarkTheme.backgroundRaised,
                  marginBottom: rs(5),
                }}
              >
                <ViewModeIcon active={active} mode={mode} />
              </View>
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.82}
                numberOfLines={1}
                style={{
                  color: active
                    ? onboardingDarkTheme.background
                    : onboardingDarkTheme.textPrimary,
                  fontFamily: ff,
                  fontSize: compactScreen ? rs(11) : rs(12),
                  fontWeight: "900",
                  includeFontPadding: false,
                  lineHeight: compactScreen ? rs(14) : rs(15),
                  textAlign: "center",
                }}
              >
                {option.label}
              </Text>
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.86}
                numberOfLines={1}
                style={{
                  color: active
                    ? "rgba(237,234,228,0.72)"
                    : onboardingDarkTheme.textTertiary,
                  fontFamily: ff,
                  fontSize: compactScreen ? rs(9) : rs(10),
                  fontWeight: "700",
                  includeFontPadding: false,
                  lineHeight: compactScreen ? rs(12) : rs(13),
                  marginTop: rs(2),
                  textAlign: "center",
                }}
              >
                {option.hint}
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
          borderRadius: rs(24),
          flexDirection: "row",
          gap: compactScreen ? rs(8) : rs(10),
          height: figurePanelHeight,
          alignItems: "stretch",
          paddingHorizontal: compactScreen ? rs(10) : rs(14),
          paddingVertical: compactScreen ? rs(12) : rs(16),
          marginBottom: compactScreen ? rs(8) : rs(10),
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
          gap: rs(10),
          marginBottom: compactScreen ? rs(10) : rs(12),
          borderRadius: rs(18),
          borderWidth: hairline,
          borderColor: hasSelection
            ? onboardingDarkTheme.accentStrong
            : onboardingDarkTheme.border,
          backgroundColor: hasSelection
            ? onboardingDarkTheme.accentSoft
            : onboardingDarkTheme.porcelain,
          paddingHorizontal: compactScreen ? rs(12) : rs(14),
          paddingVertical: compactScreen ? rs(11) : rs(13),
          minHeight: compactScreen ? rs(54) : rs(60),
        }}
      >
        <View
          style={{
            width: rs(30),
            height: rs(30),
            borderRadius: rs(11),
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: hasSelection
              ? onboardingDarkTheme.accentStrong
              : onboardingDarkTheme.backgroundRaised,
          }}
        >
          <Check
            color={
              hasSelection
                ? onboardingDarkTheme.background
                : onboardingDarkTheme.textTertiary
            }
            size={rs(16)}
            strokeWidth={2.2}
          />
        </View>

        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={2}
            style={{
              color: hasSelection
                ? onboardingDarkTheme.textPrimary
                : onboardingDarkTheme.textSecondary,
              fontFamily: ff,
              fontSize: rs(13),
              fontWeight: "800",
              lineHeight: rs(18),
            }}
          >
            {hasSelection ? selectedZoneText : copy.painMap.helper}
          </Text>
          {hasSelection ? (
            <Text
              style={{
                color: onboardingDarkTheme.textSecondary,
                fontFamily: ff,
                fontSize: rs(11),
                fontWeight: "700",
                lineHeight: rs(15),
                marginTop: rs(2),
              }}
            >
              {locale === "es"
                ? selectedParts.length === 1
                  ? "1 zona seleccionada"
                  : `${selectedParts.length} zonas seleccionadas`
                : selectedParts.length === 1
                  ? "1 zone selected"
                  : `${selectedParts.length} zones selected`}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={{ paddingBottom: compactScreen ? rs(4) : rs(10) }}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !hasSelection }}
          disabled={!hasSelection}
          onPress={() => onConfirm(selectedParts)}
          style={({ pressed }) => ({
            backgroundColor: hasSelection
              ? onboardingDarkTheme.textPrimary
              : onboardingDarkTheme.backgroundRaised,
            borderColor: hasSelection
              ? onboardingDarkTheme.textPrimary
              : onboardingDarkTheme.border,
            borderRadius: rs(22),
            borderWidth: hairline,
            minHeight: compactScreen ? rs(58) : rs(62),
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            opacity: pressed ? 0.9 : 1,
            paddingHorizontal: rs(16),
            paddingVertical: compactScreen ? rs(12) : rs(14),
            shadowColor: onboardingDarkTheme.textPrimary,
            shadowOffset: { width: 0, height: rs(10) },
            shadowOpacity: hasSelection ? 0.16 : 0,
            shadowRadius: rs(16),
            elevation: hasSelection ? 4 : 0,
            transform: [{ scale: pressed ? 0.99 : 1 }],
            width: "100%",
          })}
        >
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.84}
            numberOfLines={2}
            style={{
              color: hasSelection
                ? onboardingDarkTheme.background
                : onboardingDarkTheme.textTertiary,
              flex: 1,
              fontFamily: ff,
              fontSize: rs(15),
              fontWeight: "900",
              lineHeight: rs(19),
              paddingRight: rs(12),
            }}
          >
            {hasSelection ? copy.painMap.continueWithSelection : copy.painMap.empty}
          </Text>

          <View
            style={{
              width: rs(38),
              height: rs(38),
              borderRadius: rs(14),
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: hasSelection
                ? "rgba(237,234,228,0.14)"
                : onboardingDarkTheme.porcelain,
            }}
          >
            <ArrowRight
              color={
                hasSelection
                  ? onboardingDarkTheme.background
                  : onboardingDarkTheme.textTertiary
              }
              size={rs(19)}
              strokeWidth={2}
            />
          </View>
        </Pressable>

        <View
          style={{
            flexDirection: "row",
            gap: rs(6),
            marginTop: compactScreen ? rs(12) : rs(16),
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
      </View>
    </View>
  );
}
