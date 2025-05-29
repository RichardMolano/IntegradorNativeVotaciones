import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import { Text, Card, Button, TextInput } from "react-native-paper";
import { colors } from "../../constants/colors";
import FabMenuNavigator from "./hooks/fabMenuNavegator";
import NavBar from "./hooks/NavBar";
import { SeguridadContext } from "../asyncData/Context";
import { CandidatesController } from "../controllers/private/candidateController";

export default function CandidatePanel() {
  const { sesion, token } = useContext(SeguridadContext);
  const controller = new CandidatesController();
  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<{ [electionId: number]: string }>(
    {}
  );
  const [saving, setSaving] = useState<{ [electionId: number]: boolean }>({});

  useEffect(() => {
    const controller = new CandidatesController();
    controller
      .getCandidatesByElectionId(sesion.id, token)
      .then((data: any[]) => {
        setElections(Array.isArray(data) ? data : []);
        // Inicializa las propuestas
        const initial: { [electionId: number]: string } = {};
        (Array.isArray(data) ? data : []).forEach((election) => {
          const myCandidate = (election.candidatesElections || []).find(
            (c: any) => c.id_user === sesion.id
          );
          if (myCandidate) {
            initial[election.id] = myCandidate.proposals || "";
          }
        });
        setProposals(initial);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, sesion.id]);

  const handleProposalChange = (electionId: number, text: string) => {
    setProposals((prev) => ({ ...prev, [electionId]: text }));
  };

  const handleSaveProposal = async (
    electionId: number,
    candidateId: number
  ) => {
    setSaving((prev) => ({ ...prev, [electionId]: true }));
    try {
      // Aquí deberías llamar a tu API para guardar la propuesta
      await controller.updateCandidatesByElectionId(
        candidateId,
        proposals[electionId],
        token
      );
      alert("¡Propuesta guardada!");
    } catch (e) {
      alert("Error al guardar la propuesta");
    } finally {
      setSaving((prev) => ({ ...prev, [electionId]: false }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu Perfil como Candidato</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.name}>{sesion.name}</Text>
          <Text style={styles.votes}>Contacto : {sesion.email}</Text>
        </Card.Content>
      </Card>

      <Text style={styles.subtitle}>Tus Elecciones</Text>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 32 }}
      >
        {loading ? (
          <Text style={{ color: "#fff", marginTop: 16 }}>
            Cargando elecciones...
          </Text>
        ) : elections.length === 0 ? (
          <Text style={{ color: "#ccc", marginTop: 16 }}>
            No participas en ninguna elección.
          </Text>
        ) : (
          elections.map((election) => {
            const myCandidate = (election.candidatesElections || []).find(
              (c: any) => c.id_user === sesion.id
            );
            return (
              <View
                key={election.id}
                style={{ width: "100%", alignItems: "center" }}
              >
                <Card style={styles.electionCard}>
                  <Card.Content>
                    <Text style={styles.electionName}>
                      {election.name || "Sin nombre"}
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
                    {myCandidate && (
                      <>
                        <Text style={styles.bold}>Tu propuesta:</Text>
                        <TextInput
                          mode="outlined"
                          value={proposals[election.id] || ""}
                          onChangeText={(text) =>
                            handleProposalChange(election.id, text)
                          }
                          placeholder="Escribe tu propuesta"
                          style={{
                            marginBottom: 8,
                            backgroundColor: "#181818",
                            minHeight: 60,
                            textAlignVertical: "top",
                          }}
                          multiline
                        />
                        <Button
                          mode="contained"
                          loading={!!saving[election.id]}
                          disabled={saving[election.id]}
                          onPress={() =>
                            handleSaveProposal(election.id, myCandidate.id)
                          }
                          style={{ marginTop: 4 }}
                        >
                          Guardar propuesta
                        </Button>
                      </>
                    )}
                  </Card.Content>
                </Card>
              </View>
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
    alignItems: "center",
  },
  title: {
    color: colors.text || "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    color: colors.primary || "#c7b3f7",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 28,
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1e1e1e",
    width: "100%",
    maxWidth: 350,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  electionCard: {
    backgroundColor: "#232323",
    width: 320,
    marginVertical: 8,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  document: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 8,
  },
  votes: {
    fontSize: 16,
    color: "#00cc66",
    textAlign: "center",
  },
  electionName: {
    color: "#fff",
    fontSize: 16,
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
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    marginTop: 30,
    alignSelf: "center",
  },
});
