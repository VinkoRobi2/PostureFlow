import { useEffect } from "react";
import {
  Activity,
  Box,
  Clock3,
  Play,
  ShieldAlert,
} from "lucide-react-native";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LanguageToggle } from "../components/LanguageToggle";
import { messages } from "../i18n/messages";
import { useAppModel } from "../providers/app-provider";
import type { AppScreenProps } from "../types/app";
import { getLocalizedText } from "../utils/localize";

type Props = AppScreenProps<"Dashboard">;

const DASHBOARD_THEME = {
  background: "#000000",
  surface: "#09090B",
  surfaceAlt: "#18181B",
  border: "#27272A",
  accent: "#10B981",
  primaryText: "#FFFFFF",
  secondaryText: "#A1A1AA",
  tertiaryText: "#52525B",
  yellow: "#EAB308",
} as const;

export function DashboardScreen({ navigation }: Props) {
  const { dashboard, locale, logout, refreshRemoteState, toggleLocale } =
    useAppModel();
  const copy = messages[locale];

  useEffect(() => {
    void refreshRemoteState();
  }, [refreshRemoteState]);

  if (!dashboard) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: DASHBOARD_THEME.background,
        }}
      >
        <Text
          style={{
            color: DASHBOARD_THEME.secondaryText,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {copy.common.loading}
        </Text>
      </SafeAreaView>
    );
  }

  const featured = dashboard.featuredRoutine;
  const criticalZoneLabels = dashboard.criticalZones.regionLabels.slice(0, 2);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: DASHBOARD_THEME.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 36,
          maxWidth: 460,
          alignSelf: "center",
          width: "100%",
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            marginBottom: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: DASHBOARD_THEME.accent,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                color: DASHBOARD_THEME.secondaryText,
                fontSize: 11,
                fontWeight: "700",
                letterSpacing: 1.6,
                textTransform: "uppercase",
              }}
            >
              {getLocalizedText(dashboard.systemStatus.label, locale)}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <LanguageToggle
              locale={locale}
              onToggle={() => void toggleLocale()}
              variant="dark"
            />
            <View
              style={{
                marginLeft: 10,
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: DASHBOARD_THEME.surfaceAlt,
                borderWidth: 1,
                borderColor: DASHBOARD_THEME.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: DASHBOARD_THEME.primaryText,
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                {dashboard.systemStatus.operatorBadge}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => navigation.navigate("Player", { routineId: featured.id })}
          style={{
            marginBottom: 14,
            minHeight: 248,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: DASHBOARD_THEME.border,
            backgroundColor: DASHBOARD_THEME.surface,
            overflow: "hidden",
          }}
        >
          <Image
            source={{ uri: featured.imageUrl }}
            style={[StyleSheet.absoluteFillObject, { opacity: 0.22 }]}
            resizeMode="cover"
          />
          <View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: "rgba(0,0,0,0.58)" },
            ]}
          />

          <View style={{ flex: 1, padding: 20, justifyContent: "space-between" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text
                  style={{
                    color: DASHBOARD_THEME.accent,
                    fontSize: 10,
                    fontWeight: "700",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  {getLocalizedText(featured.badge, locale)}
                </Text>
                <Text
                  style={{
                    color: DASHBOARD_THEME.primaryText,
                    fontSize: 24,
                    fontWeight: "700",
                    lineHeight: 28,
                  }}
                >
                  {getLocalizedText(featured.title, locale)}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: DASHBOARD_THEME.border,
                  backgroundColor: DASHBOARD_THEME.surfaceAlt,
                  paddingHorizontal: 8,
                  paddingVertical: 6,
                }}
              >
                <Clock3 color={DASHBOARD_THEME.secondaryText} size={12} />
                <Text
                  style={{
                    color: DASHBOARD_THEME.secondaryText,
                    fontSize: 11,
                    fontWeight: "700",
                    marginLeft: 5,
                  }}
                >
                  {getLocalizedText(featured.durationLabel, locale)}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {featured.previewImageUrls.map((imageUrl, index) => (
                  <View
                    key={`${featured.id}-preview-${index}`}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      overflow: "hidden",
                      backgroundColor: DASHBOARD_THEME.surfaceAlt,
                      borderWidth: 1,
                      borderColor: DASHBOARD_THEME.border,
                      marginLeft: index === 0 ? 0 : -8,
                    }}
                  >
                    <Image
                      source={{ uri: imageUrl }}
                      style={{ width: "100%", height: "100%", opacity: 0.55 }}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 12,
                  backgroundColor: DASHBOARD_THEME.primaryText,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                }}
              >
                <Play
                  color={DASHBOARD_THEME.background}
                  fill={DASHBOARD_THEME.background}
                  size={14}
                />
                <Text
                  style={{
                    color: DASHBOARD_THEME.background,
                    fontSize: 13,
                    fontWeight: "800",
                    marginLeft: 8,
                  }}
                >
                  {getLocalizedText(featured.cta, locale).toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>

        <View style={{ flexDirection: "row", marginBottom: 14 }}>
          <View
            style={{
              flex: 1,
              minHeight: 126,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: DASHBOARD_THEME.border,
              backgroundColor: DASHBOARD_THEME.surface,
              padding: 16,
              marginRight: 6,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Activity color={DASHBOARD_THEME.secondaryText} size={14} />
              <Text
                style={{
                  color: DASHBOARD_THEME.secondaryText,
                  fontSize: 10,
                  fontWeight: "700",
                  letterSpacing: 1.1,
                  textTransform: "uppercase",
                  marginLeft: 6,
                }}
              >
                {getLocalizedText(dashboard.tensionIndex.label, locale)}
              </Text>
            </View>

            <Text
              style={{
                color: DASHBOARD_THEME.primaryText,
                fontSize: 34,
                fontWeight: "300",
                letterSpacing: -1,
                marginBottom: 8,
              }}
            >
              {dashboard.tensionIndex.value}
              <Text
                style={{
                  color: DASHBOARD_THEME.secondaryText,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                %
              </Text>
            </Text>

            <View
              style={{
                width: "100%",
                height: 4,
                borderRadius: 999,
                backgroundColor: DASHBOARD_THEME.surfaceAlt,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${dashboard.tensionIndex.progress * 100}%`,
                  height: "100%",
                  borderRadius: 999,
                  backgroundColor: DASHBOARD_THEME.yellow,
                }}
              />
            </View>
          </View>

          <View
            style={{
              flex: 1,
              minHeight: 126,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: DASHBOARD_THEME.border,
              backgroundColor: DASHBOARD_THEME.surface,
              padding: 16,
              marginLeft: 6,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <ShieldAlert color={DASHBOARD_THEME.secondaryText} size={14} />
              <Text
                style={{
                  color: DASHBOARD_THEME.secondaryText,
                  fontSize: 10,
                  fontWeight: "700",
                  letterSpacing: 1.1,
                  textTransform: "uppercase",
                  marginLeft: 6,
                }}
              >
                {getLocalizedText(dashboard.criticalZones.label, locale)}
              </Text>
            </View>

            <Text
              style={{
                color: DASHBOARD_THEME.primaryText,
                fontSize: 34,
                fontWeight: "300",
                letterSpacing: -1,
                marginBottom: 8,
              }}
            >
              {String(dashboard.criticalZones.count).padStart(2, "0")}
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {criticalZoneLabels.map((label, index) => (
                <View
                  key={`critical-zone-${index}`}
                  style={{
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: DASHBOARD_THEME.border,
                    paddingHorizontal: 6,
                    paddingVertical: 3,
                    marginRight: 6,
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      color: DASHBOARD_THEME.secondaryText,
                      fontSize: 10,
                      fontWeight: "700",
                    }}
                  >
                    {getLocalizedText(label, locale)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{ marginTop: 4 }}>
          <Text
            style={{
              color: DASHBOARD_THEME.tertiaryText,
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 1.6,
              textTransform: "uppercase",
              paddingLeft: 8,
              marginBottom: 8,
            }}
          >
            {getLocalizedText(dashboard.quickLibrary.label, locale)}
          </Text>

          {dashboard.quickLibrary.items.map((routine) => (
            <Pressable
              key={routine.id}
              onPress={() => navigation.navigate("Player", { routineId: routine.id })}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: DASHBOARD_THEME.border,
                backgroundColor: DASHBOARD_THEME.surface,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    overflow: "hidden",
                    backgroundColor: DASHBOARD_THEME.surfaceAlt,
                    borderWidth: 1,
                    borderColor: DASHBOARD_THEME.border,
                    marginRight: 12,
                  }}
                >
                  <Image
                    source={{ uri: routine.imageUrl }}
                    style={{ width: "100%", height: "100%", opacity: 0.68 }}
                    resizeMode="cover"
                  />
                </View>

                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text
                    style={{
                      color: DASHBOARD_THEME.primaryText,
                      fontSize: 14,
                      fontWeight: "600",
                      marginBottom: 2,
                    }}
                  >
                    {getLocalizedText(routine.title, locale)}
                  </Text>
                  <Text
                    style={{
                      color: DASHBOARD_THEME.secondaryText,
                      fontSize: 10,
                      fontWeight: "700",
                      letterSpacing: 0.9,
                      textTransform: "uppercase",
                    }}
                  >
                    {getLocalizedText(routine.categoryLabel, locale)}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Box color={DASHBOARD_THEME.secondaryText} size={14} />
                <Text
                  style={{
                    color: DASHBOARD_THEME.secondaryText,
                    fontSize: 11,
                    fontWeight: "700",
                    marginLeft: 6,
                  }}
                >
                  {getLocalizedText(routine.durationLabel, locale)}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => {
            void logout().then(() => navigation.replace("Auth", { mode: "login" }));
          }}
          style={{ alignSelf: "center", marginTop: 8, paddingVertical: 8 }}
        >
          <Text
            style={{
              color: DASHBOARD_THEME.tertiaryText,
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {copy.common.signOut}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
