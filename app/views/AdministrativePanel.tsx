import React, { useContext } from "react";
import { View, StyleSheet, useWindowDimensions, FlatList } from "react-native";
import { Text, Button, Card, TextInput } from "react-native-paper";
import { colors } from "../../constants/colors";
import { UserContext } from "../asyncData/Context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetDropdown } from "./hooks/Drop";

const admin = {
  name: "Juan Pérez",
  role: "Administrador General",
};

export default function AdministrativePanel() {
  const insets = useSafeAreaInsets();
  const { user, setUser } = useContext(UserContext);
  const [showCreate, setShowCreate] = React.useState(false);
  const [showSelectRol, setShowSelectRol] = React.useState(false);
  const [newUser, setNewUser] = React.useState({
    id: "",
    userName: "",
    password: "",
    voted: false,
    vote: [""],
    rol: "",
  });
  const [userEdit, setUserEdit] = React.useState(false);

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;

  const styles = getStyles(isSmallScreen, insets);

  const handleCreateUser = () => {
    if (!newUser.userName || !newUser.password) return;

    if (userEdit && newUser.id) {
      setUser((prev: any) =>
        prev.map((u: any) =>
          u.id === newUser.id
            ? {
                ...u,
                userName: newUser.userName,
                password: newUser.password,
                rol: newUser.rol,
              }
            : u
        )
      );
      setUserEdit(false);
    } else {
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
          rol: "",
        },
      ]);
    }

    setNewUser({
      id: "",
      userName: "",
      password: "",
      voted: false,
      vote: [""],
      rol: "",
    });
    setShowCreate(false);
  };

  return (
    <View style={styles.container}>
      {/* Perfil del Administrador */}
      <View style={styles.profileContainer}>
        <Text style={styles.title}>Perfil del Administrador</Text>
        <Card style={styles.card}>
          <Text style={styles.name}>{admin.name}</Text>
          <Text style={styles.role}>{admin.role}</Text>
        </Card>
        <Button
          mode={showCreate ? "outlined" : "contained"}
          style={styles.button}
          onPress={() => setShowCreate((prev) => !prev)}
        >
          {showCreate ? "Cancelar" : "Crear nuevo usuario"}
        </Button>
      </View>

      {/* Panel de usuarios */}
      <View style={styles.usersContainer}>
        {showCreate && (
          <Card style={styles.createCard}>
            <Card.Title title="Nuevo Usuario" titleStyle={{ color: "#fff" }} />
            <Card.Content>
              <Text style={{ color: "#fff", marginBottom: 8 }}>
                Nombre de usuario
              </Text>
              <TextInput
                label="Usuario"
                mode="outlined"
                style={styles.input}
                placeholder="Usuario"
                value={newUser.userName}
                onChangeText={(text) =>
                  setNewUser((prev) => ({ ...prev, userName: text }))
                }
                theme={{
                  colors: {
                    text: "#fff",
                    primary: "#fff",
                    placeholder: "#ccc",
                  },
                }}
              />
              <Text style={{ color: "#fff", marginBottom: 8 }}>Contraseña</Text>
              <TextInput
                label="Contraseña"
                mode="outlined"
                style={styles.input}
                placeholder="Contraseña"
                value={newUser.password}
                onChangeText={(text) =>
                  setNewUser((prev) => ({ ...prev, password: text }))
                }
                secureTextEntry
                theme={{
                  colors: {
                    text: "#fff",
                    primary: "#fff",
                    placeholder: "#ccc",
                  },
                }}
              />
              {newUser.rol ? (
                <View style={styles.rolRow}>
                  <Text style={{ color: "#fff", marginRight: 8 }}>Rol:</Text>
                  <View style={styles.rolBadge}>
                    <Text style={{ color: "#000" }}>{newUser.rol}</Text>
                  </View>
                  <View />
                </View>
              ) : (
                <Text style={{ color: "#fff", marginBottom: 8 }}>Rol</Text>
              )}
              {isSmallScreen ? (
                <Button
                  mode="outlined"
                  style={styles.rolButton}
                  labelStyle={{ fontSize: 16 }}
                  onPress={() => setShowSelectRol(true)}
                  icon="account"
                >
                  Seleccionar rol
                </Button>
              ) : (
                <View style={styles.rolRow}>
                  <Text
                    style={{ color: "#fff", marginRight: 12, fontSize: 18 }}
                  >
                    Rol:
                  </Text>
                  <Button
                    mode="contained"
                    style={styles.rolSelectButton}
                    labelStyle={{ fontSize: 18, color: "#fff" }}
                    onPress={() => setShowSelectRol(true)}
                  >
                    {newUser.rol ? newUser.rol : "Seleccionar rol"}
                  </Button>
                </View>
              )}
              <BottomSheetDropdown
                visible={showSelectRol}
                onDismiss={() => setShowSelectRol(false)}
                onSelect={(value) =>
                  setNewUser((prev) => ({ ...prev, rol: String(value) }))
                }
                listValue={["Administrador", "Votante"]}
              />
              <View style={styles.actionRow}>
                <Button
                  mode="outlined"
                  style={{ flex: 1, marginRight: 8 }}
                  onPress={() =>
                    setNewUser({
                      id: "",
                      userName: "",
                      password: "",
                      voted: false,
                      vote: [""],
                      rol: "",
                    })
                  }
                >
                  Limpiar casillas
                </Button>
                <Button
                  mode="contained"
                  style={{ flex: 1, marginLeft: 8 }}
                  onPress={handleCreateUser}
                >
                  Crear usuario
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}
        <Card style={styles.usersCard}>
          <Card.Title
            title="Usuarios Registrados"
            titleStyle={{ color: "#fff" }}
          />
          <Card.Content>
            {user && user.length > 0 ? (
              <FlatList
                data={user}
                keyExtractor={(u: any) => u.id || u.userName}
                renderItem={({ item: u }: any) => (
                  <View style={styles.userRow}>
                    <View style={{ flex: 1, minWidth: 120 }}>
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        {u.userName}
                      </Text>
                      <Text style={{ color: "#ccc" }}>{u.password}</Text>
                    </View>
                    <View style={styles.userActions}>
                      <Button
                        mode="outlined"
                        compact
                        style={{ marginRight: 4 }}
                        onPress={() => {
                          setShowCreate(true);
                          setUserEdit(true);
                          setNewUser({
                            ...u,
                            password: u.password,
                          });
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        mode="contained"
                        compact
                        buttonColor="#b00020"
                        textColor="#fff"
                        onPress={() => {
                          setUser((prev: any) =>
                            prev.filter((item: any) => item.id !== u.id)
                          );
                        }}
                      >
                        Borrar
                      </Button>
                    </View>
                  </View>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              />
            ) : (
              <Text style={{ color: "#ccc" }}>
                No hay usuarios registrados.
              </Text>
            )}
          </Card.Content>
        </Card>
      </View>
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
      flexDirection: isSmallScreen ? "column" : "row-reverse",
      justifyContent: isSmallScreen ? "flex-start" : "center",
      alignItems: isSmallScreen ? "center" : "flex-start",
      gap: isSmallScreen ? 0 : 32,
    },
    profileContainer: {
      flex: isSmallScreen ? undefined : 1,
      alignItems: "center",
      width: isSmallScreen ? "100%" : undefined,
      marginBottom: isSmallScreen ? 16 : 0,
    },
    usersContainer: {
      flex: isSmallScreen ? undefined : 2,
      width: "100%",
      maxWidth: 700,
    },
    title: {
      fontSize: isSmallScreen ? 22 : 26,
      color: colors.text || "#fff",
      fontWeight: "bold",
      marginBottom: isSmallScreen ? 20 : 28,
      marginTop: isSmallScreen ? 20 : 28,
    },
    card: {
      backgroundColor: "#1e1e1e",
      width: "100%",
      maxWidth: isSmallScreen ? 500 : 600,
      padding: isSmallScreen ? 16 : 24,
      borderRadius: 12,
      alignItems: "center",
      marginBottom: isSmallScreen ? 24 : 32,
    },
    button: {
      marginBottom: isSmallScreen ? 12 : 16,
      width: "100%",
      maxWidth: isSmallScreen ? 500 : 600,
    },
    createCard: {
      width: "100%",
      maxWidth: 500,
      marginBottom: 16,
      backgroundColor: "#232323",
      alignSelf: "center",
    },
    input: {
      backgroundColor: "transparent",
      color: "#fff",
      width: "100%",
      marginBottom: 12,
    },
    rolRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    rolBadge: {
      backgroundColor: "#c7b3f7",
      padding: 8,
      borderRadius: 8,
    },
    rolButton: {
      width: "100%",
      marginBottom: 12,
      borderRadius: 8,
      paddingVertical: 6,
    },
    rolSelectButton: {
      minWidth: 180,
      borderRadius: 20,
      paddingVertical: 10,
      backgroundColor: "#333",
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    usersCard: {
      width: "100%",
      maxWidth: 700,
      marginBottom: 16,
      backgroundColor: "#232323",
      alignSelf: "center",
    },
    userRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 8,
    },
    userActions: {
      flexDirection: "row",
      gap: 8,
    },
    name: {
      fontSize: isSmallScreen ? 20 : 24,
      color: "#fff",
      textAlign: "center",
      fontWeight: "bold",
    },
    role: {
      fontSize: isSmallScreen ? 16 : 18,
      color: "#ccc",
      textAlign: "center",
    },
  });
}
