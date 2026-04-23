import Body, {
  type ExtendedBodyPart,
  type Slug,
} from "react-native-body-highlighter";
import { Activity, ChevronRight } from "lucide-react-native";
import { useMemo, useState } from "react";
import { type DimensionValue, Pressable, Text, View } from "react-native";
import { messages } from "../i18n/messages";
import {
  zenAmbientGlow,
  zenDarkTheme,
  zenGlassEffect,
} from "../theme/zen-dark";
import type { LocaleCode, PainRegion } from "../types/app";
import { getLocalizedText } from "../utils/localize";

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
  background: zenDarkTheme.canvas,
  surface: zenDarkTheme.surfaceGlass,
  surfaceAlt: zenDarkTheme.cardMuted,
  panel: zenDarkTheme.surfaceGlass,
  border: zenDarkTheme.border,
  borderStrong: zenDarkTheme.borderMuted,
  accent: zenDarkTheme.accent,
  accentStroke: zenDarkTheme.accentStrong,
  primaryText: zenDarkTheme.textPrimary,
  secondaryText: zenDarkTheme.textSecondary,
  tertiaryText: zenDarkTheme.textTertiary,
  figureIdle: "#475569",
  figureStroke: "#64748B",
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
    width: 144,
    height: 292,
    scale: 0.74,
  },
  focus: {
    width: 182,
    height: 346,
    scale: 0.88,
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
    fill: SCANNER_THEME.accent,
    stroke: SCANNER_THEME.accentStroke,
    strokeWidth: 1.1,
  };
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
              borderRadius: 999,
              backgroundColor: isSelected
                ? zenDarkTheme.accentSoft
                : pressed
                  ? "rgba(255,255,255,0.04)"
                  : "transparent",
              borderWidth: isSelected ? 1 : 0,
              borderColor: isSelected ? SCANNER_THEME.accent : "transparent",
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
  showLabel,
}: {
  data: ExtendedBodyPart[];
  label: string;
  side: ScannerView;
  selectedParts: ScannerRegionId[];
  onPress: (slug?: Slug) => void;
  onToggle: (part: ScannerRegionId) => void;
  layout: keyof typeof BODY_LAYOUTS;
  showLabel: boolean;
}) {
  const size = BODY_LAYOUTS[layout];

  return (
    <View style={{ alignItems: "center", width: size.width + 28 }}>
      {showLabel ? (
        <Text
          style={{
            color: SCANNER_THEME.tertiaryText,
            fontSize: 10,
            fontWeight: "500",
            letterSpacing: 1.6,
            marginBottom: 10,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Text>
      ) : null}

      <View
        style={{
          width: size.width + 18,
          height: size.height + 14,
          borderRadius: 30,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.05)",
          backgroundColor: "rgba(15,23,42,0.34)",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 18,
            width: size.width * 0.58,
            height: size.width * 0.58,
            borderRadius: 999,
            backgroundColor: selectedParts.length > 0
              ? zenDarkTheme.accentGlow
              : "rgba(148,163,184,0.10)",
            opacity: selectedParts.length > 0 ? 0.14 : 0.1,
          }}
        />

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
          defaultStrokeWidth={1}
          gender="male"
          scale={size.scale}
          side={side}
          onBodyPartPress={(part) => onPress(part.slug)}
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

  const regionOptions = useMemo(
    () =>
      REGION_ORDER.map((id) => {
        const region = painRegions.find((item) => item.id === id);

        return {
          id,
          label: region ? getLocalizedText(region.label, locale) : id,
        };
      }),
    [locale, painRegions],
  );

  const selectedLabels = useMemo(
    () => regionOptions.filter((region) => selectedParts.includes(region.id)),
    [regionOptions, selectedParts],
  );

  const selectedSummary = useMemo(
    () => selectedLabels.map((item) => item.label).join(" | "),
    [selectedLabels],
  );

  const frontData = useMemo(
    () => selectedParts.flatMap((part) => REGION_TO_BODY_PARTS[part]?.front ?? []),
    [selectedParts],
  );

  const backData = useMemo(
    () => selectedParts.flatMap((part) => REGION_TO_BODY_PARTS[part]?.back ?? []),
    [selectedParts],
  );

  const continueLabel =
    selectedParts.length > 0
      ? copy.painMap.continueWithSelection
      : copy.painMap.continueButton;

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
    <View className="flex-1">
      <View className="mb-4">
        <View
          style={{
            marginBottom: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View className="flex-row items-center">
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                backgroundColor: SCANNER_THEME.accent,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                color: SCANNER_THEME.accent,
                fontSize: 10,
                fontWeight: "500",
                letterSpacing: 1.8,
                textTransform: "uppercase",
              }}
            >
              {copy.painMap.scanner}
            </Text>
          </View>

          <View
            style={{
              minWidth: 62,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: SCANNER_THEME.border,
              backgroundColor: SCANNER_THEME.surface,
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              ...zenGlassEffect,
            }}
          >
            <Activity color={SCANNER_THEME.accent} size={12} />
            <Text
              style={{
                color: SCANNER_THEME.primaryText,
                fontSize: 12,
                fontWeight: "500",
                marginLeft: 6,
              }}
            >
              {selectedParts.length}
            </Text>
          </View>
        </View>

        <Text
          style={{
            color: SCANNER_THEME.primaryText,
            fontSize: 30,
            fontWeight: "400",
            lineHeight: 38,
            maxWidth: 320,
          }}
        >
          {copy.painMap.titleLead}{" "}
          <Text style={{ color: SCANNER_THEME.accent }}>
            {copy.painMap.titleAccent}
          </Text>
        </Text>

        <Text
          style={{
            marginTop: 10,
            maxWidth: 320,
            color: SCANNER_THEME.secondaryText,
            fontSize: 15,
            lineHeight: 22,
            fontWeight: "400",
          }}
        >
          {copy.painMap.subtitle}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          minHeight: 0,
          borderRadius: 32,
          borderWidth: 1,
          borderColor: SCANNER_THEME.borderStrong,
          backgroundColor: SCANNER_THEME.panel,
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 10,
          overflow: "hidden",
          ...zenGlassEffect,
        }}
      >
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: -42,
            right: -56,
            width: 150,
            height: 150,
            borderRadius: 999,
            backgroundColor: zenDarkTheme.accentGlow,
            opacity: 0.18,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            bottom: -70,
            left: -38,
            width: 160,
            height: 160,
            borderRadius: 999,
            backgroundColor: "rgba(148,163,184,0.08)",
          }}
        />

        <View
          style={{
            marginBottom: 18,
            flexDirection: "row",
            borderRadius: 28,
            borderWidth: 1,
            borderColor: SCANNER_THEME.border,
            backgroundColor: SCANNER_THEME.surfaceAlt,
            padding: 4,
            ...zenGlassEffect,
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
                style={{
                  flex: 1,
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: active
                    ? "rgba(94,234,212,0.45)"
                    : "transparent",
                  backgroundColor: active
                    ? zenDarkTheme.accentSoft
                    : "transparent",
                  paddingVertical: 10,
                }}
              >
                <Text
                  style={{
                    color: active
                      ? SCANNER_THEME.accent
                      : SCANNER_THEME.tertiaryText,
                    fontSize: 11,
                    fontWeight: "500",
                    letterSpacing: 1.1,
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
            flex: 1,
            minHeight: 0,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: figureMode === "both" ? "row" : "column",
            paddingBottom: 4,
          }}
        >
          {(figureMode === "both" || figureMode === "front") && (
            <BodyFigure
              data={frontData}
              label={copy.painMap.front}
              layout={figureMode === "both" ? "compact" : "focus"}
              showLabel={figureMode !== "both"}
              side="front"
              selectedParts={selectedParts}
              onPress={(slug) => handleBodyPartPress("front", slug)}
              onToggle={togglePart}
            />
          )}

          {figureMode === "both" ? (
            <View
              style={{
                width: 1,
                height: "72%",
                alignSelf: "center",
                marginHorizontal: 6,
                backgroundColor: SCANNER_THEME.border,
              }}
            />
          ) : null}

          {(figureMode === "both" || figureMode === "back") && (
            <BodyFigure
              data={backData}
              label={copy.painMap.back}
              layout={figureMode === "both" ? "compact" : "focus"}
              showLabel={figureMode !== "both"}
              side="back"
              selectedParts={selectedParts}
              onPress={(slug) => handleBodyPartPress("back", slug)}
              onToggle={togglePart}
            />
          )}
        </View>
      </View>

      <View
        style={{
          marginTop: 14,
          paddingTop: 6,
          paddingBottom: 4,
        }}
      >
        <View
          style={{
            marginBottom: 12,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: SCANNER_THEME.border,
            backgroundColor: SCANNER_THEME.surface,
            paddingHorizontal: 14,
            paddingVertical: 12,
            ...zenGlassEffect,
          }}
        >
          <Text
            style={{
              color: SCANNER_THEME.primaryText,
              fontSize: 13,
              fontWeight: "500",
              marginBottom: 4,
            }}
          >
            {copy.painMap.continueTitle}
          </Text>
          <Text
            style={{
              color: SCANNER_THEME.secondaryText,
              fontSize: 12,
              lineHeight: 18,
              fontWeight: "400",
            }}
          >
            {selectedParts.length > 0
              ? `${selectedSummary}. ${copy.painMap.continueHint}`
              : copy.painMap.empty}
          </Text>
        </View>

        <Pressable
          disabled={selectedParts.length === 0}
          onPress={() => onConfirm(selectedParts)}
          style={({ pressed }) => ({
            width: "100%",
            minHeight: 58,
            borderRadius: 30,
            borderWidth: 1,
            borderColor: selectedParts.length > 0
              ? SCANNER_THEME.accent
              : SCANNER_THEME.border,
            backgroundColor: selectedParts.length > 0
              ? "rgba(94,234,212,0.16)"
              : "rgba(255,255,255,0.035)",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed && selectedParts.length > 0 ? 0.92 : 1,
            paddingHorizontal: 16,
            ...zenAmbientGlow(selectedParts.length > 0 ? 0.16 : 0.04, 22),
            ...zenGlassEffect,
          })}
        >
          <Text
            style={{
              color: selectedParts.length > 0
                ? SCANNER_THEME.primaryText
                : SCANNER_THEME.secondaryText,
              fontSize: 16,
              fontWeight: "500",
              marginRight: 12,
              letterSpacing: 0.3,
            }}
          >
            {continueLabel}
          </Text>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: selectedParts.length > 0
                ? zenDarkTheme.whiteSoft
                : "rgba(255,255,255,0.06)",
            }}
          >
            <ChevronRight
              color={selectedParts.length > 0
                ? SCANNER_THEME.primaryText
                : SCANNER_THEME.secondaryText}
              size={17}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
