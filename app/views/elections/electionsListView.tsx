import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Platform,
} from "react-native";
import { Text, Card, Button, useTheme } from "react-native-paper";
import { colors } from "../../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FabMenuNavigator from "../hooks/fabMenuNavegator";
import { ElectionController } from "../../controllers/private/electionController";
import { SeguridadContext } from "../../asyncData/Context";
import NavBar from "../hooks/NavBar";
import { useNavigation } from "@react-navigation/native";

export default function ElectionsListView() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;
  const styles = getStyles(isSmallScreen, insets);
  const theme = useTheme();
  const { sesion, token } = useContext(SeguridadContext);
  const controllerElecctions = new ElectionController();

  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    controllerElecctions
      .getAllElections(token)
      .then((data: any[]) => {
        setElections(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error loading elections");
        setLoading(false);
      });
  }, [token]);

  const handleView = (election: any) => {
    alert(`Ver elección: ${election.name || election.nombre}`);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Lista de Elecciones</Text>
        {loading && (
          <Text style={styles.loadingText}>Cargando elecciones...</Text>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {!loading && !error && (
          <View style={styles.cardsContainer}>
            {elections.map((election, idx) => (
              <Card key={election.id || idx} style={styles.card}>
                <Card.Content>
                  <Text style={styles.electionName}>
                    {election.name || election.nombre || "Sin nombre"}
                  </Text>
                  <Text style={styles.electionInfo}>
                    <Text style={styles.bold}>Código de unión: </Text>
                    {election.id || "No disponible"}
                  </Text>
                  <Text style={styles.electionInfo}>
                    <Text style={styles.bold}>Código de unión: </Text>
                    {election.codeJoin || "No disponible"}
                  </Text>
                  <Text style={styles.electionInfo}>
                    <Text style={styles.bold}>Fecha inicio: </Text>
                    {election.start_date}
                  </Text>
                  <Text style={styles.electionInfo}>
                    <Text style={styles.bold}>Fecha fin: </Text>
                    {election.end_date}
                  </Text>
                  <Text style={styles.electionInfo}>
                    <Text style={styles.bold}>Estado: </Text>
                    {election.state ? "Activa" : "Inactiva"}
                  </Text>
                  <Button
                    mode="contained"
                    style={styles.viewButton}
                    onPress={() => {
                      navigation.navigate("ElectionsProcess", {
                        token: token,
                        election: election,
                      });
                    }}
                    labelStyle={{ color: "#fff" }}
                  >
                    Ver
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
      {Platform.OS === "web" ? (
        <NavBar visible={true} />
      ) : (
        <FabMenuNavigator visible={true} />
      )}
      <View />
    </>
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
    },
    title: {
      color: colors.text || "#fff",
      marginBottom: 16,
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 22,
    },
    cardsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      paddingBottom: 32,
    },
    card: {
      width: 250,
      margin: 12,
      padding: 16,
      backgroundColor: "#1e1e1e",
      borderRadius: 12,
      alignItems: "center",
      borderColor: "#333",
      borderWidth: 1,
    },
    electionName: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      textAlign: "center",
    },
    electionInfo: {
      color: "#fff",
      fontSize: 13,
      marginBottom: 4,
      textAlign: "center",
    },
    bold: {
      fontWeight: "bold",
      color: "#fff",
    },
    viewButton: {
      marginTop: 12,
      alignSelf: "center",
      backgroundColor: colors.primary || "#1976d2",
      borderRadius: 8,
    },
    loadingText: {
      color: "#fff",
      textAlign: "center",
      marginTop: 20,
    },
    errorText: {
      color: "red",
      textAlign: "center",
      marginTop: 20,
    },
  });
}
