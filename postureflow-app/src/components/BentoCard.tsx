import { PropsWithChildren } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import {
  zenCardShadow,
  zenCardStyle,
  zenDarkTheme,
} from "../theme/zen-dark";

type BentoCardProps = PropsWithChildren<{
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}>;

const shadowStyle: ViewStyle = zenCardShadow;

export function BentoCard({
  children,
  onPress,
  style,
}: BentoCardProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          shadowStyle,
          zenCardStyle,
          {
            borderRadius: 32,
            overflow: "hidden",
            backgroundColor: pressed
              ? zenDarkTheme.surfacePressed
              : zenDarkTheme.surfaceGlass,
          },
          style,
          pressed ? { transform: [{ scale: 0.982 }] } : null,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View
      style={[
        shadowStyle,
        zenCardStyle,
        {
          borderRadius: 32,
          backgroundColor: zenDarkTheme.surface,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
