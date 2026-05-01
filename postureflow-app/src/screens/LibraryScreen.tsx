import {
  ChevronLeft,
  CloudOff,
  Download,
  HardDrive,
  Loader2,
} from "lucide-react-native";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { BentoCard } from "../components/BentoCard";
import { ScreenAtmosphere } from "../components/ScreenAtmosphere";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import { zenAmbientGlow, zenDarkTheme, zenGlassEffect } from "../theme/zen-dark";
import type { AppScreenProps } from "../types/app";
import { getLocalizedText } from "../utils/localize";

type Props = AppScreenProps<"Library">;

export function LibraryScreen({ navigation }: Props) {
  const { library, locale, downloadRoutine, refreshRemoteState } = useAppModel();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const copy = messages[locale];

  useEffect(() => {
    void refreshRemoteState();
  }, [refreshRemoteState]);

  if (!library) {
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
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 40,
          maxWidth: 460,
          alignSelf: "center",
          width: "100%",
        }}
      >
        <View
          style={{
            marginBottom: 22,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              marginRight: 16,
              height: 40,
              width: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              borderWidth: 1,
              borderColor: zenDarkTheme.border,
              backgroundColor: zenDarkTheme.surfaceGlass,
              ...zenGlassEffect,
            }}
          >
            <ChevronLeft color={zenDarkTheme.textSecondary} size={20} />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                letterSpacing: 1.4,
                textTransform: "uppercase",
                color: zenDarkTheme.textTertiary,
              }}
            >
              {locale === "es" ? "Biblioteca offline" : "Offline library"}
            </Text>
            <Text
              style={{
                marginTop: 4,
                fontSize: 34,
                fontWeight: "700",
                letterSpacing: -0.8,
                color: zenDarkTheme.textPrimary,
              }}
            >
              {copy.library.title}
            </Text>
          </View>

          <View
            style={{
              height: 40,
              width: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              borderWidth: 1,
              borderColor: zenDarkTheme.border,
              backgroundColor: zenDarkTheme.surfaceGlass,
              ...zenGlassEffect,
            }}
          >
            <CloudOff color={zenDarkTheme.accent} size={18} />
          </View>
        </View>

        <BentoCard
          style={{
            marginBottom: 20,
            padding: 22,
            backgroundColor: zenDarkTheme.porcelain,
            borderColor: zenDarkTheme.borderMuted,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                marginRight: 16,
                height: 48,
                width: 48,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 20,
                backgroundColor: zenDarkTheme.accentSoft,
              }}
            >
              <HardDrive color={zenDarkTheme.textSecondary} size={20} />
            </View>

            <View style={{ flex: 1 }}>
              <View
                style={{
                  marginBottom: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "800",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: zenDarkTheme.textTertiary,
                  }}
                >
                  {copy.common.localStorage}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: zenDarkTheme.textPrimary,
                  }}
                >
                  {`${library.storage.usedMb} MB / ${library.storage.totalMb} MB`}
                </Text>
              </View>

              <View
                style={{
                  height: 6,
                  overflow: "hidden",
                  borderRadius: 999,
                  backgroundColor: zenDarkTheme.surface,
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${
                      (library.storage.usedMb / library.storage.totalMb) * 100
                    }%`,
                    borderRadius: 999,
                    backgroundColor: zenDarkTheme.accent,
                  }}
                />
              </View>
            </View>
          </View>
        </BentoCard>

        <View style={{ gap: 14 }}>
          {library.routines.map((routine) => {
            const isDownloading = downloadingId === routine.id;

            return (
              <BentoCard
                key={routine.id}
                style={{
                  minHeight: 142,
                  padding: 16,
                  ...zenAmbientGlow(0.05, 18),
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      height: 104,
                      width: 104,
                      overflow: "hidden",
                      borderRadius: 30,
                      borderWidth: 1,
                      borderColor: zenDarkTheme.border,
                    }}
                  >
                    <Image
                      source={{ uri: routine.imageUrl }}
                      style={{ height: "100%", width: "100%" }}
                      resizeMode="cover"
                    />
                  </View>

                  <View style={{ marginLeft: 16, flex: 1, alignSelf: "stretch", justifyContent: "center" }}>
                    <Text
                      style={{
                        color: zenDarkTheme.textPrimary,
                        fontSize: 17,
                        fontWeight: "800",
                        lineHeight: 22,
                      }}
                    >
                      {getLocalizedText(routine.title, locale)}
                    </Text>
                    <Text
                      style={{
                        marginTop: 4,
                        color: zenDarkTheme.textSecondary,
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      {`${getLocalizedText(routine.durationLabel, locale)} | ${routine.sizeLabel}`}
                    </Text>
                  </View>

                  {routine.downloaded ? (
                    <View
                      style={{
                        minHeight: 36,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: zenDarkTheme.borderMuted,
                        backgroundColor: zenDarkTheme.accentSoft,
                        paddingHorizontal: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: zenDarkTheme.accentStrong,
                          fontSize: 11,
                          fontWeight: "800",
                          letterSpacing: 0.8,
                          textTransform: "uppercase",
                        }}
                      >
                        {locale === "es" ? "Guardado" : "Saved"}
                      </Text>
                    </View>
                  ) : (
                    <Pressable
                      onPress={async () => {
                        setDownloadingId(routine.id);
                        await downloadRoutine(routine.id);
                        setDownloadingId(null);
                      }}
                      style={{
                        height: 40,
                        width: 40,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 999,
                        backgroundColor: zenDarkTheme.input,
                        ...zenGlassEffect,
                      }}
                    >
                      {isDownloading ? (
                        <Loader2 color={zenDarkTheme.accentStrong} size={18} />
                      ) : (
                        <Download color={zenDarkTheme.textSecondary} size={18} />
                      )}
                    </Pressable>
                  )}
                </View>
              </BentoCard>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
