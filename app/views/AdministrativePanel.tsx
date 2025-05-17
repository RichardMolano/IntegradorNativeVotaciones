import React, { Context, useContext } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button, Card, TextInput } from "react-native-paper";
import { colors } from "../../constants/colors";
import { UserContext } from "../asyncData/InventarioContext";

const admin = {
  name: "Juan Pérez",
  role: "Administrador General",
  image: "https://randomuser.me/api/portraits/men/12.jpg",
};

export default function AdministrativePanel() {
  const { user, setUser } = useContext(UserContext);
  const [showCreate, setShowCreate] = React.useState(false);
  const [newUser, setNewUser] = React.useState({
    id: "",
    userName: "",
    password: "",
    voted: false,
    vote: [""],
  });

  const handleCreateUser = () => {
    if (!newUser.userName || !newUser.password) return;
    let newId: string;
    do {
      newId = Math.random().toString(36).substring(2, 11);
    } while ((user || []).some((u: any) => u.id === newId));
    setUser([
      ...(user || []),
      {
        ...newUser,
        id: newId,
        voted: false,
        vote: [""],
      },
    ]);
    setNewUser({
      id: "",
      userName: "",
      password: "",
      voted: false,
      vote: [""],
    });
    setShowCreate(false);
  };
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
        onPress={() => setShowCreate((prev) => !prev)}
      >
        {showCreate ? "Cancelar" : "Crear nuevo usuario"}
      </Button>
      {showCreate && (
        <Card style={{ width: "100%", marginBottom: 16, backgroundColor: "#232323" }}>
          <Card.Title title="Nuevo Usuario" titleStyle={{ color: "#fff" }} />
          <Card.Content>
            <Text style={{ color: "#fff", marginBottom: 8 }}>Nombre de usuario</Text>
            <TextInput
              label="Usuario"
              mode="outlined"
              style={{
              backgroundColor: "transparent",
              color: "#fff",
              width: "100%",
              marginBottom: 12,
              }}
              placeholder="Usuario"
              value={newUser.userName}
              onChangeText={(text) =>
              setNewUser((prev) => ({ ...prev, userName: text }))
              }
              theme={{ colors: { text: "#fff", primary: "#fff", placeholder: "#ccc" } }}
            />
            <Text style={{ color: "#fff", marginBottom: 8 }}>Contraseña</Text>
            <TextInput
              label="Contraseña"
              mode="outlined"
              style={{
              backgroundColor: "transparent",
              color: "#fff",
              width: "100%",
              marginBottom: 12,
              }}
              placeholder="Contraseña"
              value={newUser.password}
              onChangeText={(text) =>
              setNewUser((prev) => ({ ...prev, password: text }))
              }
              secureTextEntry
              theme={{ colors: { text: "#fff", primary: "#fff", placeholder: "#ccc" } }}
            />
            <Button
              mode="contained"
              style={{ marginTop: 8 }}
              onPress={handleCreateUser}
            >
              Crear usuario
            </Button>
          </Card.Content>
        </Card>
      )}
      <Card style={{ width: "100%", marginBottom: 16, backgroundColor: "#232323" }}>
        <Card.Title title="Usuarios Registrados" titleStyle={{ color: "#fff" }} />
        <Card.Content>
          {user && user.length > 0 ? (
            user.map((u: any, idx: number) => (
              <View key={u.id || idx} style={{ marginBottom: 8 }}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>{u.userName}</Text>
                <Text style={{ color: "#ccc" }}>{u.password}</Text>
              </View>
            ))
          ) : (
            <Text style={{ color: "#ccc" }}>No hay usuarios registrados.</Text>
          )}
        </Card.Content>
      </Card>

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
