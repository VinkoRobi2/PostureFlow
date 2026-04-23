import { PropsWithChildren } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import {
  zenCardShadow,
  zenCardStyle,
  zenDarkTheme,
} from "../theme/zen-dark";

type BentoCardProps = PropsWithChildren<{
  className?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}>;

const shadowStyle: ViewStyle = zenCardShadow;

export function BentoCard({
  children,
  className = "",
  onPress,
  style,
}: BentoCardProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`rounded-[32px] ${className}`}
        style={({ pressed }) => [
          shadowStyle,
          zenCardStyle,
          { overflow: "hidden" },
          style,
          pressed ? { transform: [{ scale: 0.985 }] } : null,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View
      className={`rounded-[32px] ${className}`}
      style={[
        shadowStyle,
        zenCardStyle,
        style,
        {
          borderColor: zenDarkTheme.border,
          backgroundColor: zenDarkTheme.surfaceGlass,
          overflow: "hidden",
        },
      ]}
    >
      {children}
    </View>
  );
}
