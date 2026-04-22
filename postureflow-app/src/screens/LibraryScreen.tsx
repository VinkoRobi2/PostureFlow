import {
  CheckCircle2,
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
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
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
          backgroundColor: "#f8fafc",
        }}
      >
        <ActivityIndicator color="#0f766e" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 18,
          paddingBottom: 32,
          maxWidth: 460,
          alignSelf: "center",
          width: "100%",
        }}
      >
        <View className="mb-8 flex-row items-center">
          <Pressable
            onPress={() => navigation.goBack()}
            className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-white"
          >
            <ChevronLeft color="#475569" size={20} />
          </Pressable>

          <Text className="flex-1 text-3xl font-semibold tracking-tight text-slate-800">
            {copy.library.title}
          </Text>

          <View className="h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50">
            <CloudOff color="#059669" size={18} />
          </View>
        </View>

        <BentoCard className="mb-8 p-4">
          <View className="flex-row items-center">
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-2xl bg-slate-50">
              <HardDrive color="#94a3b8" size={20} />
            </View>

            <View className="flex-1">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-[10px] font-bold uppercase tracking-[1px] text-slate-500">
                  {copy.common.localStorage}
                </Text>
                <Text className="text-xs font-semibold text-slate-800">
                  {`${library.storage.usedMb} MB / ${library.storage.totalMb} MB`}
                </Text>
              </View>
              <View className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <View
                  className="h-full rounded-full bg-teal-500"
                  style={{
                    width: `${
                      (library.storage.usedMb / library.storage.totalMb) * 100
                    }%`,
                  }}
                />
              </View>
            </View>
          </View>
        </BentoCard>

        <View className="gap-4">
          {library.routines.map((routine) => {
            const isDownloading = downloadingId === routine.id;

            return (
              <BentoCard key={routine.id} className="h-28 p-4">
                <View className="flex-row items-center">
                  <View className="h-20 w-20 overflow-hidden rounded-3xl">
                    <Image
                      source={{ uri: routine.imageUrl }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  </View>

                  <View className="ml-4 flex-1">
                    <Text className="text-base font-semibold leading-5 text-slate-800">
                      {getLocalizedText(routine.title, locale)}
                    </Text>
                    <Text className="mt-1 text-xs font-medium text-slate-400">
                      {`${getLocalizedText(routine.durationLabel, locale)} • ${routine.sizeLabel}`}
                    </Text>
                  </View>

                  {routine.downloaded ? (
                    <View className="h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50">
                      <CheckCircle2 color="#10b981" size={20} />
                    </View>
                  ) : (
                    <Pressable
                      onPress={async () => {
                        setDownloadingId(routine.id);
                        await downloadRoutine(routine.id);
                        setDownloadingId(null);
                      }}
                      className="h-10 w-10 items-center justify-center rounded-full bg-slate-50"
                    >
                      {isDownloading ? (
                        <Loader2 color="#14b8a6" size={18} />
                      ) : (
                        <Download color="#94a3b8" size={18} />
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
