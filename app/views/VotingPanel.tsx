import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import { Text, Card, Button, RadioButton } from "react-native-paper";
import { colors } from "../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FabMenuNavigator from "./hooks/fabMenuNavegator";
import NavBar from "./hooks/NavBar";
import { SeguridadContext } from "../asyncData/Context";
import { ElectionController } from "../controllers/private/electionController";
import { VoteController } from "../controllers/private/voteController";

export default function VotingPanel() {
  const insets = useSafeAreaInsets();
  const { cerrarSesion, sesion, token } = useContext(SeguridadContext);

  const [elections, setElections] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<{
    [electionId: number]: number | null;
  }>({});
  const [saving, setSaving] = useState<{ [electionId: number]: boolean }>({});
  const controllerVote = new VoteController();

  // Función para cargar elecciones y votos
  const fetchElections = () => {
    controllerVote.getVoteByUser(sesion.id, token).then((data: any[]) => {
      const electionsData = Array.isArray(data[0]) ? data[0] : data;
      setElections(electionsData);
      const initialSelected: { [electionId: number]: number | null } = {};
      electionsData.forEach((vote) => {
        if (vote.electionsVotes && vote.electionsVotes.id !== undefined) {
          initialSelected[vote.electionsVotes.id] =
            vote.id_candidate !== undefined && vote.id_candidate !== null
              ? vote.id_candidate
              : null;
        }
      });
      setSelectedCandidates(initialSelected);
    });
  };

  useEffect(() => {
    fetchElections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, sesion.id]);

  const handleSelectCandidate = (electionId: number, candidateId: number) => {
    setSelectedCandidates((prev) => ({
      ...prev,
      [electionId]: candidateId,
    }));
    console.log("Selected candidate:", candidateId);
  };

  // update: Asegúrate de que el método handleSaveVote sea asíncrono
  const handleSaveVote = async (electionId: number, idVoto: number) => {
    const candidateId = selectedCandidates[electionId];
    if (candidateId === null || candidateId === undefined) {
      alert("Debes seleccionar un candidato antes de votar.");
      return;
    }
    setSaving((prev) => ({ ...prev, [electionId]: true }));
    // Aquí deberías llamar a tu API para guardar el voto
    try {
      await controllerVote.getElectionVotesByMethod(
        candidateId, // id candidato
        idVoto, // id de voto
        token
      );
      alert("¡Voto guardado para la elección " + electionId + "!");
      fetchElections(); // <-- Vuelve a cargar la información después de votar
    } catch (error) {
      console.error("Error al guardar el voto:", error);
    } finally {
      setSaving((prev) => ({ ...prev, [electionId]: false }));
    }
  };

  console.log("Elections en render:", elections);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Text style={styles.title}>Panel de Votación</Text>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {elections.length === 0 ? (
          <Text style={{ color: "#ccc", marginTop: 16 }}>
            No tienes elecciones disponibles para votar.
          </Text>
        ) : (
          elections.map((vote) => {
            if (!vote.electionsVotes) {
              return (
                <Card key={vote.id} style={styles.card}>
                  <Card.Content>
                    <Text style={styles.electionName}>
                      Elección no disponible
                    </Text>
                  </Card.Content>
                </Card>
              );
            }
            const elec = vote.electionsVotes;
            const disponible = elec.state ? elec.state === true : false;
            const yaVoto =
              vote.id_candidate !== undefined && vote.id_candidate !== null;

            return (
              <Card
                key={elec.id || vote.id}
                style={[
                  styles.card,
                  disponible && { borderColor: "#00cc66", borderWidth: 2 },
                ]}
              >
                <Card.Content>
                  <Text style={styles.electionName}>
                    {elec.name || "Sin nombre"}
                  </Text>
                  <Text style={styles.electionInfo}>
                    <Text style={styles.bold}>Código de unión: </Text>
                    {elec.codeJoin || "No disponible"}
                  </Text>
                  <Text style={styles.electionInfo}>
                    <Text style={styles.bold}>Fecha inicio: </Text>
                    {elec.start_date}
                  </Text>
                  <Text style={styles.electionInfo}>
                    <Text style={styles.bold}>Fecha fin: </Text>
                    {elec.end_date}
                  </Text>
                  <Text style={styles.electionInfo}>
                    <Text style={styles.bold}>Estado: </Text>
                    {disponible ? "Disponible" : "No disponible"}
                  </Text>
                  {elec.candidatesElections.length > 0 ? (
                    <>
                      <Text style={styles.bold}>Selecciona tu candidato:</Text>
                      <RadioButton.Group
                        onValueChange={(value) =>
                          handleSelectCandidate(elec.id, Number(value))
                        }
                        value={
                          selectedCandidates[elec.id] !== null &&
                          selectedCandidates[elec.id] !== undefined
                            ? String(selectedCandidates[elec.id])
                            : ""
                        }
                      >
                        {elec.candidatesElections.map((c) => (
                          <RadioButton.Item
                            key={c.id}
                            label={`${c.userStudent.userStudent.name}`}
                            value={String(c.id)}
                            color="#00cc66"
                            labelStyle={{ color: "#fff" }}
                            style={{
                              backgroundColor: "#232323",
                              borderRadius: 8,
                              marginVertical: 2,
                            }}
                            disabled={yaVoto}
                          />
                        ))}
                      </RadioButton.Group>
                      <Button
                        mode="contained"
                        style={styles.voteButton}
                        disabled={
                          !selectedCandidates[elec.id] ||
                          saving[elec.id] ||
                          yaVoto
                        }
                        loading={!!saving[elec.id]}
                        onPress={() => {
                          handleSaveVote(elec.id, vote.id);
                        }}
                      >
                        {yaVoto ? "Voto registrado" : "Guardar voto"}
                      </Button>
                    </>
                  ) : (
                    <Text style={{ color: "#ccc", marginTop: 8 }}>
                      No hay candidatos registrados en esta elección.
                    </Text>
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
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 22,
  },
  card: {
    width: 340,
    marginBottom: 16,
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
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  voteButton: {
    marginTop: 12,
    alignSelf: "center",
    backgroundColor: "#00cc66",
    borderRadius: 8,
  },
  logoutButton: {
    marginTop: 20,
    alignSelf: "center",
  },
});
