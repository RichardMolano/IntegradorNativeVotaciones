import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { colors } from "../../constants/colors";

const admin = {
  name: "Juan Pérez",
  role: "Administrador General",
  image: "https://randomuser.me/api/portraits/men/12.jpg",
};

export default function AdministrativePanel() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil del Administrador</Text>

      <Card style={styles.card}>
        <Image source={{ uri: admin.image }} style={styles.avatar} />
        <Card.Content>
          <Text style={styles.name}>{admin.name}</Text>
          <Text style={styles.role}>{admin.role}</Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => console.log("Ir al Panel de Administración")}
      >
        Ir al Panel de Administración
      </Button>

      <Button
        mode="outlined"
        style={styles.logoutButton}
        onPress={() => console.log("Cerrar sesión")}
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
    fontSize: 22,
    color: colors.text || "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1e1e1e",
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  role: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
  },
  button: {
    marginBottom: 12,
    width: "100%",
  },
  logoutButton: {
    width: "100%",
  },
});
