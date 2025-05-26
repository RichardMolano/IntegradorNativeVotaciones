import React, { useContext } from "react";
import { View, StyleSheet, useWindowDimensions, FlatList } from "react-native";
import { Text, Button, Card, TextInput } from "react-native-paper";
import { colors } from "../../constants/colors";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetDropdown } from "./hooks/Drop";
import { SeguridadContext } from "../asyncData/Context";
import { UserController } from "../controllers/private/userController";
import { User } from "../models/user/user";
import { Role } from "../models/role/role";
import { RoleController } from "../controllers/private/rolControlle";

export default function AdministrativePanel() {
  const insets = useSafeAreaInsets();
  const userController = new UserController();
  const roleController = new RoleController();

  const { sesion, token } = useContext(SeguridadContext);
  const [showCreate, setShowCreate] = React.useState(false);
  const [showSelectRol, setShowSelectRol] = React.useState(false);
  const [newUser, setNewUser] = React.useState<User>({
    id: 0,
    password: "",
    document: "",
    email: "",
    name: "",
    id_role: 0,
    roleUser: new Role(0, ""),
  });
  /* Fields */
  const [document, setDocument] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [userEdit, setUserEdit] = React.useState(false);
  // State to manage the list of users
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    userController.getAllUsers().then((data) => {
      if (mounted) {
        setUsers(data);
        setLoadingUsers(false);
      }
    });

    roleController.getAllRoles().then((data) => {
      if (mounted) {
        setRoles(data);
      }
    });
  }, []);

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;

  const styles = getStyles(isSmallScreen, insets);

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.password || !newUser.roleUser) return;

    try {
      if (userEdit && newUser.id) {
        // Editar usuario existente
        const updatedUser = await userController.updateUser({
          ...newUser,
        } as User);
        setUsers((prev: any) =>
          prev.map((u: any) => (u.id === updatedUser.id ? updatedUser : u))
        );
        setUserEdit(false);
      } else {
        // Crear nuevo usuario
        const createdUser = await userController.createUser({
          ...newUser,
        } as User);
        setUsers((prev: any) => [...prev, createdUser]);
      }
      setNewUser({
        id: 0,
        name: "",
        password: "",
        document: "",
        email: "",
        id_role: 0,
        roleUser: new Role(0, ""),
      });
      setShowCreate(false);
    } catch (error) {
      // Manejo de error opcional
      console.error("Error al crear/editar usuario:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Perfil del Administrador */}
      <View style={styles.profileContainer}>
        <Text style={styles.title}>Perfil del Administrador</Text>
        <Card style={styles.card}>
          <Text style={styles.name}>{sesion.email}</Text>
          <Text style={styles.role}>{sesion.roleUser.name}</Text>

          <Card.Content>
            <Text style={{ color: "#ccc" }}>
              {loadingUsers
                ? "Cargando usuarios..."
                : users && users.length > 0
                ? `Usuarios registrados: ${users.length}`
                : "No hay usuarios registrados."}
            </Text>
          </Card.Content>
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
                value={newUser.name}
                onChangeText={(text) =>
                  setNewUser((prev) => ({ ...prev, name: text }))
                }
                theme={{
                  colors: {
                    text: "#fff",
                    primary: "#fff",
                    placeholder: "#ccc",
                  },
                }}
              />
              <Text style={{ color: "#fff", marginBottom: 8 }}>
                Documento de identidad
              </Text>
              <TextInput
                label="Documento"
                mode="outlined"
                style={styles.input}
                placeholder="Documento"
                value={newUser.document}
                onChangeText={(text) =>
                  setNewUser((prev) => ({ ...prev, document: text }))
                }
                theme={{
                  colors: {
                    text: "#fff",
                    primary: "#fff",
                    placeholder: "#ccc",
                  },
                }}
              />
              <Text style={{ color: "#fff", marginBottom: 8 }}>Email</Text>
              <TextInput
                label="Email"
                mode="outlined"
                style={styles.input}
                placeholder="Email"
                value={newUser.email}
                onChangeText={(text) =>
                  setNewUser((prev) => ({ ...prev, email: text }))
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
              {newUser.roleUser.name !== "" ? (
                <View style={styles.rolRow}>
                  <Text style={{ color: "#fff", marginRight: 8 }}>Rol:</Text>
                  <View style={styles.rolBadge}>
                    <Text style={{ color: "#000" }}>
                      {newUser.roleUser.name}
                    </Text>
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
                    {newUser.roleUser.name !== ""
                      ? newUser.roleUser.name
                      : "Seleccionar rol"}
                  </Button>
                </View>
              )}
              <BottomSheetDropdown
                visible={showSelectRol}
                onDismiss={() => setShowSelectRol(false)}
                onSelect={(value) =>
                  setNewUser((prev) => ({
                    ...prev,
                    roleUser: new Role(value.id, String(value.name)),
                    id_role: value.id,
                  }))
                }
                listValue={roles.map((r) => ({ id: r.id, name: r.name }))}
              />
              <View style={styles.actionRow}>
                <Button
                  mode="outlined"
                  style={{ flex: 1, marginRight: 8 }}
                  onPress={() =>
                    setNewUser({
                      id: 0,
                      name: "",
                      password: "",
                      document: "",
                      email: "",
                      id_role: 0,
                      roleUser: new Role(0, ""),
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
            {users && users.length > 0 ? (
              <FlatList
                data={users}
                keyExtractor={(u: User) => {
                  return u.id.toString();
                }}
                renderItem={({ item: u }) => (
                  <View style={styles.userRow}>
                    <View style={{ flex: 1, minWidth: 120 }}>
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        {u.name}
                      </Text>
                      <Text style={{ color: "#ccc" }}>{u.email}</Text>
                    </View>
                    <View style={styles.userActions}>
                      <Button
                        mode="outlined"
                        compact
                        style={{ marginRight: 4 }}
                        onPress={() => {
                          setShowCreate(true);
                          setUserEdit(true);
                          setNewUser(u);
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
                          userController.deleteUser(u.id).then(() => {
                            setUsers((prev: any) =>
                              prev.filter((user: any) => user.id !== u.id)
                            );
                          });
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
