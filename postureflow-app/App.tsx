import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import "./global.css";
import { RootNavigator } from "./src/navigation/root-navigator";
import { AppProvider } from "./src/providers/app-provider";
import { LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";
import { GestureHandlerRootView } from "react-native-gesture-handler";

enableScreens(false);
LogBox.ignoreLogs([
  "SafeAreaView has been deprecated and will be removed in a future release.",
]);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
