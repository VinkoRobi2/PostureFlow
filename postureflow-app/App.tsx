import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { RootNavigator } from "./src/navigation/root-navigator";
import { AppProvider } from "./src/providers/app-provider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { zenDarkTheme } from "./src/theme/zen-dark";

enableScreens(false);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: zenDarkTheme.canvas }}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
