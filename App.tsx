import { PaperProvider } from "react-native-paper";
import AppNavigation from "./app/navigation";
import { customTheme } from "./app/theme";

export default function App() {
  return (
    <PaperProvider theme={customTheme}>
      <AppNavigation />
    </PaperProvider>
  );
}
