import Body, {
  type ExtendedBodyPart,
  type Slug,
} from "react-native-body-highlighter";
import { ChevronRight } from "lucide-react-native";
import { useMemo, useState } from "react";
import { type DimensionValue, Pressable, Text, View } from "react-native";
import { messages } from "../i18n/messages";
import type { LocaleCode, PainRegion } from "../types/app";
import { getLocalizedText } from "../utils/localize";

type ScannerRegionId = string;

type ScannerView = "front" | "back";

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
  surface: "#18181B",
  surfaceAlt: "#0F0F12",
  border: "#27272A",
  accent: "#10B981",
  accentStroke: "#34D399",
  primaryText: "#FFFFFF",
  secondaryText: "#A1A1AA",
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
  width: 148,
  height: 286,
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
    front: [
      {
        slug: "neck",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
    back: [
      {
        slug: "neck",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
  },
  shoulders: {
    front: [
      {
        slug: "deltoids",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
    back: [
      {
        slug: "deltoids",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
      {
        slug: "trapezius",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
  },
  chest: {
    front: [
      {
        slug: "chest",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
    back: [],
  },
  arms: {
    front: [
      {
        slug: "biceps",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
    back: [
      {
        slug: "triceps",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
  },
  forearms: {
    front: [
      {
        slug: "forearm",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
    back: [
      {
        slug: "forearm",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
  },
  hands: {
    front: [
      {
        slug: "hands",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
    back: [
      {
        slug: "hands",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
  },
  core: {
    front: [
      {
        slug: "abs",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
      {
        slug: "obliques",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
    back: [],
  },
  upper_back: {
    front: [],
    back: [
      {
        slug: "upper-back",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
  },
  lower_back: {
    front: [],
    back: [
      {
        slug: "lower-back",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
  },
  hips: {
    front: [
      {
        slug: "adductors",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
    back: [
      {
        slug: "gluteal",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
  },
  legs: {
    front: [
      {
        slug: "quadriceps",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
    back: [
      {
        slug: "hamstring",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
  },
  knees: {
    front: [
      {
        slug: "knees",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
    back: [
      {
        slug: "knees",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
  },
  calves: {
    front: [
      {
        slug: "tibialis",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
    back: [
      {
        slug: "calves",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
  },
  feet: {
    front: [
      {
        slug: "feet",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
    back: [
      {
        slug: "feet",
        styles: {
          fill: SCANNER_THEME.accent,
          stroke: SCANNER_THEME.accentStroke,
          strokeWidth: 1.1,
        },
      },
    ],
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
                  ? "rgba(39,39,42,0.55)"
                  : "transparent",
              borderWidth: isSelected ? 1 : 0,
              borderColor: isSelected
                ? SCANNER_THEME.accent
                : "transparent",
            })}
          />
        );
      })}
    </View>
  );
}

function BodyColumn({
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
    <View style={{ alignItems: "center", width: BODY_SIZE.width + 8 }}>
      <Text
        style={{
          color: SCANNER_THEME.secondaryText,
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 1.8,
          marginBottom: 6,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
      <View
        style={{
          width: BODY_SIZE.width,
          height: BODY_SIZE.height,
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Body
          border="none"
          data={data}
          defaultFill={SCANNER_THEME.surface}
          defaultStroke={SCANNER_THEME.border}
          defaultStrokeWidth={1}
          gender="male"
          scale={0.73}
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
    () =>
      regionOptions.filter((region) => selectedParts.includes(region.id)),
    [regionOptions, selectedParts],
  );

  const continueLabel =
    selectedParts.length > 0
      ? copy.painMap.continueWithSelection
      : copy.painMap.continueButton;

  const frontData = useMemo(
    () => selectedParts.flatMap((part) => REGION_TO_BODY_PARTS[part].front),
    [selectedParts],
  );

  const backData = useMemo(
    () => selectedParts.flatMap((part) => REGION_TO_BODY_PARTS[part].back),
    [selectedParts],
  );

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
        <View className="mb-3 flex-row items-center">
          <View
            style={{
              width: 8,
              height: 8,
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

        <Text
          style={{
            color: SCANNER_THEME.primaryText,
            fontSize: 26,
            fontWeight: "500",
            lineHeight: 31,
            marginBottom: 6,
          }}
        >
          {copy.painMap.title}
        </Text>

        <Text
          style={{
            color: SCANNER_THEME.secondaryText,
            fontSize: 13,
            lineHeight: 19,
          }}
        >
          {copy.painMap.subtitle}
        </Text>
      </View>

      <View
        style={{
          marginBottom: 12,
          alignItems: "center",
          borderRadius: 14,
          backgroundColor: SCANNER_THEME.surface,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            color: SCANNER_THEME.secondaryText,
            fontSize: 12,
            fontWeight: "600",
          }}
        >
          {copy.painMap.helper}
        </Text>
        <Text
          style={{
            color: selectedParts.length > 0
              ? SCANNER_THEME.accent
              : SCANNER_THEME.secondaryText,
            fontSize: 12,
            fontWeight: "700",
          }}
        >
          {`${selectedParts.length} ${copy.painMap.selectedCount}`}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: SCANNER_THEME.surfaceAlt,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: SCANNER_THEME.border,
          paddingVertical: 14,
          paddingHorizontal: 12,
        }}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <BodyColumn
            data={frontData}
            label={copy.painMap.front}
            selectedParts={selectedParts}
            side="front"
            onPress={(slug) => handleBodyPartPress("front", slug)}
            onToggle={togglePart}
          />

          <View
            style={{
              width: 1,
              height: 214,
              backgroundColor: SCANNER_THEME.border,
            }}
          />

          <BodyColumn
            data={backData}
            label={copy.painMap.back}
            selectedParts={selectedParts}
            side="back"
            onPress={(slug) => handleBodyPartPress("back", slug)}
            onToggle={togglePart}
          />
        </View>
      </View>

      <View
        style={{
          marginTop: 14,
        }}
      >
        <View
          style={{
            backgroundColor: SCANNER_THEME.surfaceAlt,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: SCANNER_THEME.border,
            marginBottom: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        >
          <Text
            style={{
              color: SCANNER_THEME.primaryText,
              fontSize: 14,
              fontWeight: "700",
              marginBottom: 4,
            }}
          >
            {copy.painMap.continueTitle}
          </Text>
          <Text
            style={{
              color: SCANNER_THEME.secondaryText,
              fontSize: 12,
              lineHeight: 17,
            }}
          >
            {selectedParts.length > 0
              ? `${selectedParts.length} ${copy.painMap.selectedCount}. ${copy.painMap.continueHint}`
              : copy.painMap.empty}
          </Text>
        </View>

        {selectedLabels.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            {selectedLabels.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => togglePart(item.id)}
                style={({ pressed }) => ({
                  marginBottom: 6,
                  marginRight: 8,
                  borderRadius: 999,
                  backgroundColor: pressed
                    ? SCANNER_THEME.accent
                    : SCANNER_THEME.surface,
                  borderWidth: 1,
                  borderColor: pressed
                    ? SCANNER_THEME.accent
                    : SCANNER_THEME.border,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                })}
              >
                {({ pressed }) => (
                  <Text
                    style={{
                      color: pressed
                        ? SCANNER_THEME.background
                        : SCANNER_THEME.secondaryText,
                      fontSize: 11,
                      fontWeight: "600",
                    }}
                  >
                    {item.label}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        ) : (
          <Text
            style={{
              color: SCANNER_THEME.secondaryText,
              fontSize: 12,
              lineHeight: 17,
              marginBottom: 12,
            }}
          >
            {copy.painMap.empty}
          </Text>
        )}

        <Pressable
          disabled={selectedParts.length === 0}
          onPress={() => onConfirm(selectedParts)}
          style={({ pressed }) => ({
            alignItems: "center",
            backgroundColor:
              selectedParts.length > 0
                ? SCANNER_THEME.accent
                : SCANNER_THEME.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor:
              selectedParts.length > 0
                ? SCANNER_THEME.accent
                : SCANNER_THEME.border,
            flexDirection: "row",
            justifyContent: "space-between",
            opacity: selectedParts.length === 0 ? 0.72 : pressed ? 0.92 : 1,
            paddingHorizontal: 16,
            paddingVertical: 16,
          })}
        >
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text
              style={{
                color:
                  selectedParts.length > 0
                    ? SCANNER_THEME.background
                    : SCANNER_THEME.secondaryText,
                fontSize: 14,
                fontWeight: "800",
                marginBottom: 2,
              }}
            >
              {continueLabel}
            </Text>
            <Text
              style={{
                color:
                  selectedParts.length > 0
                    ? "rgba(0,0,0,0.72)"
                    : SCANNER_THEME.secondaryText,
                fontSize: 11,
                lineHeight: 15,
              }}
            >
              {selectedParts.length > 0
                ? copy.painMap.continueHint
                : copy.painMap.empty}
            </Text>
          </View>
          <ChevronRight
            color={
              selectedParts.length > 0
                ? SCANNER_THEME.background
                : SCANNER_THEME.secondaryText
            }
            size={18}
          />
        </Pressable>
      </View>
    </View>
  );
}
