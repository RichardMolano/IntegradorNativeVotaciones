import { PaperProvider } from "react-native-paper";
import AppNavigation from "./app/navigation";
import { customTheme } from "./app/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider } from "./app/asyncData/InventarioContext";

export default function App() {
  return (
    <UserProvider>
      <SafeAreaProvider>
        <PaperProvider theme={customTheme}>
          <AppNavigation />
        </PaperProvider>
      </SafeAreaProvider>
    </UserProvider> 
  );
}
