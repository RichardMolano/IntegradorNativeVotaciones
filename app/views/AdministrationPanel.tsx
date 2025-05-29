import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { Text, Card, Avatar, Button } from "react-native-paper";
import { colors } from "../../constants/colors";
import FabMenuNavigator from "./hooks/fabMenuNavegator";
import NavBar from "./hooks/NavBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ElectionController } from "../controllers/private/electionController";
import { SeguridadContext } from "../asyncData/Context";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import jsPDF from "jspdf"; // Solo para web

const screenWidth = Dimensions.get("window").width - 32;

export default function VotingResultsPanel() {
  const insets = useSafeAreaInsets();
  const [results, setResults] = useState<any[]>([]);
  const controller = new ElectionController();
  const { token, sesion } = useContext(SeguridadContext);

  useEffect(() => {
    controller.getResultsByElections(sesion.id, token).then((data) => {
      setResults(data);
    });
  }, []);

  // Función para contar votos por candidato
  const getVotesCount = (election: any) => {
    const counts: { [candidateId: number]: number } = {};
    (election.candidates || []).forEach((c: any) => {
      counts[c.id] = 0;
    });
    (election.votes || []).forEach((v: any) => {
      if (v.id_candidate !== null && counts[v.id_candidate] !== undefined) {
        counts[v.id_candidate]++;
      }
    });
    return counts;
  };

  // Genera y comparte el PDF de UNA elección
  const exportElectionToPDF = async (
    election: any,
    votesCount: any,
    winnerId: number | null
  ) => {
    const htmlContent = `
      <h1>Resultados de la elección: ${election.name || "Sin nombre"}</h1>
      <p><strong>Código:</strong> ${election.codeJoin || "No disponible"}</p>
      <p><strong>Fecha:</strong> ${election.start_date} - ${
      election.end_date
    }</p>
      <p><strong>Estado:</strong> ${
        election.state ? "Activa" : "Finalizada"
      }</p>
      <h3>Resultados:</h3>
      <ul>
        ${(election.candidates || [])
          .map((c: any) => {
            const user = c.id_user?.userStudent;
            const votos = votesCount[c.id] || 0;
            const isWinner = c.id === winnerId && votos > 0;
            return `<li>
              <b>${user?.name || "Candidato"}</b>: ${votos} votos
              ${isWinner ? " 🏆" : ""}
            </li>`;
          })
          .join("")}
      </ul>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      if (Platform.OS === "web") {
        window.open(uri, "_blank");
      } else if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        alert("No se pudo compartir el PDF.");
      }
    } catch (e) {
      alert("Error al generar o compartir el PDF");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.title}>Resultados de Votación</Text>
        {results.length === 0 ? (
          <Text style={{ color: "#ccc", marginTop: 16 }}>
            No hay resultados para mostrar.
          </Text>
        ) : (
          results.map((election) => {
            const votesCount = getVotesCount(election);
            // Encuentra el candidato con más votos
            let maxVotes = 0;
            let winnerId: number | null = null;
            Object.entries(votesCount).forEach(([cid, count]) => {
              if (count > maxVotes) {
                maxVotes = count as number;
                winnerId = Number(cid);
              }
            });

            return (
              <Card key={election.id} style={styles.electionCard}>
                <Card.Content>
                  <Button
                    icon="file-pdf-box"
                    mode="contained"
                    style={{
                      marginBottom: 8,
                      alignSelf: "flex-end",
                      backgroundColor: "#bb86fc",
                    }}
                    onPress={() =>
                      exportElectionToPDF(election, votesCount, winnerId)
                    }
                  >
                    Generar PDF
                  </Button>
                  <Text style={styles.electionName}>
                    {election.name || "Sin nombre"}
                  </Text>
                  <Text style={styles.electionInfo}>
                    <Text style={styles.bold}>Código: </Text>
                    {election.codeJoin || "No disponible"}
                  </Text>
                  <Text style={styles.electionInfo}>
                    <Text style={styles.bold}>Fecha: </Text>
                    {election.start_date} - {election.end_date}
                  </Text>
                  <Text style={styles.electionInfo}>
                    <Text style={styles.bold}>Estado: </Text>
                    {election.state ? "Activa" : "Finalizada"}
                  </Text>
                  <Text style={[styles.bold, { marginTop: 10 }]}>
                    Resultados:
                  </Text>
                  {(election.candidates || []).length === 0 ? (
                    <Text style={{ color: "#ccc", marginTop: 8 }}>
                      No hay candidatos registrados.
                    </Text>
                  ) : (
                    election.candidates.map((c: any) => {
                      const user = c.id_user?.userStudent;
                      const votos = votesCount[c.id] || 0;
                      const isWinner = c.id === winnerId && votos > 0;
                      return (
                        <View
                          key={c.id}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginVertical: 4,
                            backgroundColor: "#232323",
                            borderRadius: 8,
                            padding: 8,
                          }}
                        >
                          <Avatar.Text
                            size={32}
                            label={user?.name?.[0]?.toUpperCase() || "?"}
                            style={{
                              backgroundColor: isWinner ? "#ffd700" : "#bb86fc",
                              marginRight: 10,
                            }}
                            color={isWinner ? "#232323" : "#fff"}
                          />
                          <Text
                            style={{ color: "#fff", fontSize: 16, flex: 1 }}
                          >
                            {user?.name || "Candidato"}
                          </Text>
                          <Text style={{ color: "#fff", fontWeight: "bold" }}>
                            {votos} votos
                          </Text>
                          {isWinner && (
                            <Avatar.Icon
                              size={32}
                              icon="crown"
                              style={{
                                backgroundColor: "#ffd700",
                                marginLeft: 10,
                              }}
                              color="#232323"
                            />
                          )}
                        </View>
                      );
                    })
                  )}
                </Card.Content>
              </Card>
            );
          })
        )}
      </ScrollView>
      {Platform.OS === "web" ? (
        <NavBar visible={true} />
      ) : (
        <FabMenuNavigator visible={true} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || "#121212",
    padding: 16,
  },
  title: {
    color: colors.text || "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    color: colors.text || "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  electionCard: {
    backgroundColor: "#1e1e1e",
    marginBottom: 20,
    borderRadius: 12,
    padding: 8,
  },
  electionName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  electionInfo: {
    color: "#fff",
    fontSize: 13,
    marginBottom: 2,
    textAlign: "center",
  },
  bold: {
    color: "#fff",
    fontWeight: "bold",
  },
});
