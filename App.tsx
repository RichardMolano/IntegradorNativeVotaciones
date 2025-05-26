import { PaperProvider } from "react-native-paper";
import AppNavigation from "./app/navigation";
import { customTheme } from "./app/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SeguridadProvider } from "./app/asyncData/Context";

export default function App() {
  return (
    <SeguridadProvider>
      <SafeAreaProvider>
        <PaperProvider theme={customTheme}>
          <AppNavigation />
        </PaperProvider>
      </SafeAreaProvider>
    </SeguridadProvider>
  );
}
