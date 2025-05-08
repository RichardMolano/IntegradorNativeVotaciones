import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { colors } from "../../constants/colors";

const candidate = {
  name: "Ana Torres",
  semester: "5° semestre",
  image: "https://randomuser.me/api/portraits/women/45.jpg",
  votes: 120,
};

export default function CandidatePanel() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu Perfil como Candidato</Text>

      <Card style={styles.card}>
        <Image source={{ uri: candidate.image }} style={styles.avatar} />
        <Card.Content>
          <Text style={styles.name}>{candidate.name}</Text>
          <Text style={styles.semester}>{candidate.semester}</Text>
          <Text style={styles.votes}>Votos recibidos: {candidate.votes}</Text>
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        style={styles.button}
        onPress={() => console.log("Salir")}
      >
        Cerrar sesión
      </Button>
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
  card: {
    backgroundColor: "#1e1e1e",
    width: "100%",
    padding: 16,
    borderRadius: 12,
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
  semester: {
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
  button: {
    marginTop: 30,
    alignSelf: "center",
  },
});
