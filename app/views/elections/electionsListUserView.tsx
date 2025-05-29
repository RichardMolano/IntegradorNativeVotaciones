import React, { useContext } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { Text, Button, TextInput, Divider, Snackbar } from "react-native-paper";
import { colors } from "../../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FabMenuNavigator from "../hooks/fabMenuNavegator";

export default function electionsListUserView() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;
  const styles = getStyles(isSmallScreen, insets);

  const [showCode, setShowCode] = React.useState(false);

  // This function is used to create a new election and display a code for joining the party.
  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={{ marginBottom: 16 }}>
        Lista para usuario Elección
      </Text>
      <FabMenuNavigator visible={true} />
    </View>
  );
}

function getStyles(isSmallScreen: boolean, insets: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background || "#121212",
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingHorizontal: isSmallScreen ? 8 : 32,
      justifyContent: "center",
      alignItems: "center",
    },

    // ...otros estilos no modificados
  });
}
function toDate(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }
  return date;
}
