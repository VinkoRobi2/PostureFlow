import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { KeyboardDismissView } from "../../components/KeyboardDismissView";
import { OnboardingFrame } from "../../components/onboarding/OnboardingFrame";
import { useAppModel } from "../../providers/app-provider";
import {
  onboardingDarkTheme,
  onboardingEyebrow,
} from "../../theme/onboarding-pro-dark";
import type { AppScreenProps } from "../../types/app";
import { getLocalizedOnboardingText } from "./content";

type Props = AppScreenProps<"OnboardingName">;

export function OnboardingNameScreen({ navigation }: Props) {
  const { locale, onboardingDraft, setOnboardingName } = useAppModel();
  const copy = getLocalizedOnboardingText(locale);
  const [name, setName] = useState(onboardingDraft.firstName);

  const trimmedName = name.trim();

  return (
    <OnboardingFrame keyboard>
      <KeyboardDismissView>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={{ marginTop: 56 }}>
            <Text style={onboardingEyebrow}>Personalization</Text>
            <Text
              style={{
                marginTop: 18,
                color: onboardingDarkTheme.textPrimary,
                fontSize: 36,
                fontWeight: "400",
                lineHeight: 44,
                letterSpacing: -1,
              }}
            >
              {copy.nameTitle}
            </Text>

            <View style={{ marginTop: 42 }}>
              <TextInput
                value={name}
                onChangeText={setName}
                autoFocus
                autoCapitalize="words"
                placeholder={copy.namePlaceholder}
                placeholderTextColor={onboardingDarkTheme.textTertiary}
                selectionColor={onboardingDarkTheme.accent}
                style={{
                  color: onboardingDarkTheme.textPrimary,
                  fontSize: 34,
                  fontWeight: "400",
                  letterSpacing: -0.6,
                  paddingVertical: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: trimmedName
                    ? onboardingDarkTheme.accent
                    : onboardingDarkTheme.border,
                }}
              />
            </View>
          </View>

          <Pressable
            disabled={!trimmedName}
            onPress={() => {
              setOnboardingName(trimmedName);
              navigation.replace("OnboardingHours");
            }}
            style={{
              marginBottom: 18,
              borderRadius: 32,
              backgroundColor: trimmedName
                ? onboardingDarkTheme.accentSoft
                : onboardingDarkTheme.card,
              borderWidth: 1,
              borderColor: trimmedName
                ? onboardingDarkTheme.borderStrong
                : onboardingDarkTheme.border,
              paddingVertical: 18,
              opacity: trimmedName ? 1 : 0.5,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: onboardingDarkTheme.textPrimary,
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              {copy.nameCta}
            </Text>
          </Pressable>
        </View>
      </KeyboardDismissView>
    </OnboardingFrame>
  );
}
