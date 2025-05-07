import { MD3DarkTheme as DarkTheme } from "react-native-paper";

export const customTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#bb86fc",
    background: "#1c1b1f",
    surface: "#1e1e1e",
    text: "#ffffff",
    onSurface: "#ffffff",
    placeholder: "#aaaaaa",
  },
  roundness: 8,
};
