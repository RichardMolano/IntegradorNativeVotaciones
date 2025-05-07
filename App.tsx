import { PaperProvider } from "react-native-paper";
import AppNavigation from "./app/navigation";
import { customTheme } from "./app/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={customTheme}>
        <AppNavigation />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
