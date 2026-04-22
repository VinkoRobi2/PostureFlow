import Body, {
  type ExtendedBodyPart,
  type Slug,
} from "react-native-body-highlighter";
import { Activity, ChevronRight } from "lucide-react-native";
import { useMemo, useState } from "react";
import { type DimensionValue, Pressable, Text, View } from "react-native";
import { messages } from "../i18n/messages";
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
  background: "#000000",
  surface: "#14161B",
  surfaceAlt: "#0C0F13",
  panel: "#11151B",
  border: "#242A33",
  borderStrong: "#303744",
  accent: "#10B981",
  accentStroke: "#34D399",
  primaryText: "#FFFFFF",
  secondaryText: "#A1A1AA",
  tertiaryText: "#6B7280",
  figureIdle: "#262B33",
  figureStroke: "#343A45",
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

const BODY_SIZE = {
  width: 156,
  height: 300,
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
                ? "rgba(16,185,129,0.18)"
                : pressed
                  ? "rgba(36,42,51,0.55)"
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
}: {
  data: ExtendedBodyPart[];
  label: string;
  side: ScannerView;
  selectedParts: ScannerRegionId[];
  onPress: (slug?: Slug) => void;
  onToggle: (part: ScannerRegionId) => void;
}) {
  return (
    <View style={{ alignItems: "center", width: BODY_SIZE.width + 6 }}>
      <Text
        style={{
          color: SCANNER_THEME.tertiaryText,
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 1.6,
          marginBottom: 10,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>

      <View
        style={{
          width: BODY_SIZE.width,
          height: BODY_SIZE.height,
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
          scale={0.72}
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
    () => selectedLabels.map((item) => item.label).join(" • "),
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
      <View className="mb-3">
        <View
          style={{
            marginBottom: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View className="flex-row items-center">
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                backgroundColor: SCANNER_THEME.accent,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                color: SCANNER_THEME.accent,
                fontSize: 10,
                fontWeight: "700",
                letterSpacing: 2,
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
            }}
          >
            <Activity color={SCANNER_THEME.accent} size={12} />
            <Text
              style={{
                color: SCANNER_THEME.primaryText,
                fontSize: 12,
                fontWeight: "700",
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
            fontSize: 24,
            fontWeight: "800",
            lineHeight: 30,
            maxWidth: 280,
          }}
        >
          {copy.painMap.titleLead}{" "}
          <Text style={{ color: SCANNER_THEME.accent }}>
            {copy.painMap.titleAccent}
          </Text>
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          minHeight: 0,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: SCANNER_THEME.borderStrong,
          backgroundColor: SCANNER_THEME.panel,
          paddingHorizontal: 14,
          paddingTop: 12,
          paddingBottom: 8,
        }}
      >
        <View
          style={{
            marginBottom: 14,
            flexDirection: "row",
            borderRadius: 14,
            borderWidth: 1,
            borderColor: SCANNER_THEME.border,
            backgroundColor: SCANNER_THEME.surfaceAlt,
            padding: 4,
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
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: active
                    ? "rgba(16,185,129,0.55)"
                    : "transparent",
                  backgroundColor: active
                    ? "rgba(16,185,129,0.16)"
                    : "transparent",
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    color: active
                      ? SCANNER_THEME.accent
                      : SCANNER_THEME.tertiaryText,
                    fontSize: 11,
                    fontWeight: "800",
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
          }}
        >
          {(figureMode === "both" || figureMode === "front") && (
            <BodyFigure
              data={frontData}
              label={copy.painMap.front}
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
                alignSelf: "stretch",
                marginHorizontal: 4,
                backgroundColor: SCANNER_THEME.border,
              }}
            />
          ) : null}

          {(figureMode === "both" || figureMode === "back") && (
            <BodyFigure
              data={backData}
              label={copy.painMap.back}
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
          marginTop: 10,
          paddingTop: 10,
          paddingBottom: 8,
        }}
      >
        <View
          style={{
            marginBottom: 8,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: SCANNER_THEME.border,
            backgroundColor: SCANNER_THEME.surface,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              color: SCANNER_THEME.primaryText,
              fontSize: 13,
              fontWeight: "700",
              marginBottom: 3,
            }}
          >
            {copy.painMap.continueTitle}
          </Text>
          <Text
            style={{
              color: SCANNER_THEME.secondaryText,
              fontSize: 11,
              lineHeight: 15,
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
            minHeight: 58,
            borderRadius: 18,
            borderWidth: 1.5,
            borderColor: SCANNER_THEME.accentStroke,
            backgroundColor: SCANNER_THEME.accent,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            opacity: selectedParts.length === 0 ? 0.45 : pressed ? 0.92 : 1,
            paddingHorizontal: 16,
            shadowColor: SCANNER_THEME.accent,
            shadowOpacity: 0.34,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 },
            elevation: 7,
          })}
        >
          <Text
            style={{
              color: SCANNER_THEME.primaryText,
              fontSize: 16,
              fontWeight: "800",
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
              backgroundColor: "rgba(255,255,255,0.18)",
            }}
          >
            <ChevronRight
              color={SCANNER_THEME.primaryText}
              size={17}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
