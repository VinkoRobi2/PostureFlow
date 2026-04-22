import { PropsWithChildren } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";

type BentoCardProps = PropsWithChildren<{
  className?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}>;

const shadowStyle: ViewStyle = {
  shadowColor: "#0f172a",
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.08,
  shadowRadius: 28,
  elevation: 6,
};

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
        className={`rounded-[28px] border border-slate-100 bg-white ${className}`}
        style={({ pressed }) => [
          shadowStyle,
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
      className={`rounded-[28px] border border-slate-100 bg-white ${className}`}
      style={[shadowStyle, style]}
    >
      {children}
    </View>
  );
}
