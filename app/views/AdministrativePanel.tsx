import React, { useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  FlatList,
  Platform,
} from "react-native";
import { Text, Button, Card, TextInput } from "react-native-paper";
import { colors } from "../../constants/colors";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetDropdown } from "./hooks/Drop";
import { SeguridadContext } from "../asyncData/Context";
import { UserController } from "../controllers/private/userController";
import { User } from "../models/user/user";
import { Role } from "../models/role/role";
import { RoleController } from "../controllers/private/rolControlle";
import FabMenuNavigator from "./hooks/fabMenuNavegator";
import NavBar from "./hooks/NavBar";
import { ScrollView } from "react-native-gesture-handler";
import { Faculty } from "../models/faculty/faculty";
import { FacultyController } from "../controllers/private/facultyController";
import { Student } from "../models/student/student";
import { StudentController } from "../controllers/private/studentController";

export default function AdministrativePanel() {
  const insets = useSafeAreaInsets();
  const userController = new UserController();
  const roleController = new RoleController();
  const facultyController = new FacultyController();

  const { sesion, token } = useContext(SeguridadContext);
  const [showCreate, setShowCreate] = React.useState(false);
  const [showSelectRol, setShowSelectRol] = React.useState(false);
  const [showSelectFaculty, setShowSelectFaculty] = React.useState(false);
  const [selectedFacultyId, setSelectedFacultyId] =
    React.useState<Faculty | null>(null);
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
  const [semester, setSemester] = React.useState(""); // Nuevo estado para semestre

  const [userEdit, setUserEdit] = React.useState(false);
  // State to manage the list of users
  const [loadingUsers, setLoadingUsers] = React.useState(true);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [faculty, setFaculty] = React.useState<Faculty[]>([]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [newstudents, setnewStudents] = React.useState<Student>({
    faculty: new Faculty(0, ""),
    semester: 0,
    userStudent: new User(0, "", "", "", "", 0, new Role(0, "")),
  });

  useEffect(() => {
    let mounted = true;
    userController.getAllUsers(token).then((data) => {
      if (mounted) {
        setUsers(data);
        setLoadingUsers(false);
      }
    });

    roleController.getAllRoles(token).then((data) => {
      if (mounted) {
        setRoles(data);
      }
    });

    facultyController.getAllFaculties(token).then((data) => {
      if (mounted) {
        setFaculty(data);
      }
    });
  }, []);

  const { width } = useWindowDimensions();
  const styles = getStyles(insets);

  const handleCreateUser = async () => {
    if (
      !newUser.name ||
      !newUser.password ||
      !newUser.roleUser ||
      !selectedFacultyId ||
      !semester
    ) {
      alert("Completa todos los campos, selecciona rol, facultad y semestre.");
      return;
    }

    try {
      if (userEdit && newUser.id) {
        // Editar usuario existente
        const updatedUser = await userController.updateUser(
          {
            ...newUser,
          } as User,
          token
        );
        setUsers((prev: any) =>
          prev.map((u: any) => (u.id === updatedUser.id ? updatedUser : u))
        );
        setUserEdit(false);
      } else {
        // Crear nuevo usuario
        const createdUser = await userController.createUser(
          {
            ...newUser,
          } as User,
          token
        );
        setUsers((prev: any) => [...prev, createdUser]);
        // Crear estudiante asociado
        const newStudent = new Student(
          createdUser, // userStudent: User
          selectedFacultyId, // id de la facultad seleccionada
          Number(semester) // semestre como número
        );
        const studentController = new StudentController();
        await studentController.createStudent(newStudent, token);
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
      setSemester("");
      setSelectedFacultyId(null);
    } catch (error) {
      console.error("Error al crear/editar usuario:", error);
    }
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          backgroundColor: colors.background || "#121212",
        }}
      >
        <FlatList
          style={{ width: "100%", maxWidth: 900 }}
          contentContainerStyle={{
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 16,
            paddingHorizontal: 16,
            minHeight: Platform.OS === "web" ? "100%" : undefined,
          }}
          data={users}
          keyExtractor={(u: User) => u.id.toString()}
          ListHeaderComponent={
            <>
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
                    <Card.Title
                      title="Nuevo Usuario"
                      titleStyle={{ color: "#fff" }}
                    />
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
                      <Text style={{ color: "#fff", marginBottom: 8 }}>
                        Email
                      </Text>
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

                      <Text style={{ color: "#fff", marginBottom: 8 }}>
                        Contraseña
                      </Text>
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
                          <Text style={{ color: "#fff", marginRight: 8 }}>
                            Rol:
                          </Text>
                          <View style={styles.rolBadge}>
                            <Text style={{ color: "#000" }}>
                              {newUser.roleUser.name}
                            </Text>
                          </View>
                          <View />
                        </View>
                      ) : (
                        <Text style={{ color: "#fff", marginBottom: 8 }}>
                          Rol
                        </Text>
                      )}
                      {true ? (
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
                            style={{
                              color: "#fff",
                              marginRight: 12,
                              fontSize: 18,
                            }}
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
                        listValue={roles.map((r) => ({
                          id: r.id,
                          name: r.name,
                        }))}
                      />
                      <Text style={{ color: "#fff", marginBottom: 8 }}>
                        Facultad
                      </Text>
                      <Button
                        mode="outlined"
                        style={styles.rolButton}
                        labelStyle={{ fontSize: 16 }}
                        onPress={() => setShowSelectFaculty(true)}
                        icon="school"
                      >
                        {faculty.find((f) => f.id === selectedFacultyId?.id)
                          ?.name || "Seleccionar facultad"}
                      </Button>
                      <BottomSheetDropdown
                        visible={showSelectFaculty}
                        onDismiss={() => setShowSelectFaculty(false)}
                        onSelect={(value) => setSelectedFacultyId(value)}
                        listValue={faculty.map((f) => ({
                          id: f.id,
                          name: f.name,
                        }))}
                      />
                      <Text style={{ color: "#fff", marginBottom: 8 }}>
                        Semestre
                      </Text>
                      <TextInput
                        label="Semestre"
                        mode="outlined"
                        style={styles.input}
                        placeholder="Semestre"
                        value={semester}
                        keyboardType="numeric"
                        onChangeText={setSemester}
                        theme={{
                          colors: {
                            text: "#fff",
                            primary: "#fff",
                            placeholder: "#ccc",
                          },
                        }}
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
                </Card>
              </View>
            </>
          }
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
                    userController.deleteUser(u.id, token).then(() => {
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
          ListEmptyComponent={
            <Text style={{ color: "#ccc", textAlign: "center", padding: 16 }}>
              No hay usuarios registrados.
            </Text>
          }
        />
      </View>
      {Platform.OS === "web" ? (
        <NavBar visible={true} />
      ) : (
        <FabMenuNavigator visible={true} />
      )}
    </>
  );
}

function getStyles(insets: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background || "#121212",
      paddingTop: insets.top + 16,
      paddingBottom: insets.bottom + 16,
      paddingHorizontal: 16,
      width: "100%",
      alignSelf: "center",
    },
    profileContainer: {
      width: "100%",
      maxWidth: 500,
      alignItems: "center",
      marginBottom: 24,
      alignSelf: "center",
    },
    usersContainer: {
      width: "100%",
      maxWidth: 600,
      alignSelf: "center",
    },
    title: {
      fontSize: 26,
      color: colors.primary || "#c7b3f7",
      fontWeight: "bold",
      marginBottom: 20,
      marginTop: 10,
      textAlign: "center",
    },
    card: {
      backgroundColor: "#1e1e1e",
      width: "100%",
      maxWidth: 500,
      padding: 20,
      borderRadius: 16,
      alignItems: "center",
      marginBottom: 24,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    button: {
      marginBottom: 18,
      width: "100%",
      maxWidth: 400,
      borderRadius: 24,
      alignSelf: "center",
      backgroundColor: colors.primary || "#c7b3f7",
    },
    createCard: {
      width: "100%",
      maxWidth: 480,
      marginBottom: 18,
      backgroundColor: "#232323",
      alignSelf: "center",
      borderRadius: 16,
      padding: 10,
      elevation: 3,
    },
    input: {
      backgroundColor: "#181818",
      color: "#fff",
      width: "100%",
      marginBottom: 14,
      borderRadius: 10,
      fontSize: 16,
      paddingHorizontal: 8,
    },
    rolRow: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      marginBottom: 10,
      gap: 8,
    },
    rolBadge: {
      backgroundColor: "#c7b3f7",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      marginLeft: 8,
    },
    rolButton: {
      width: "100%",
      marginBottom: 12,
      borderRadius: 8,
      paddingVertical: 8,
      backgroundColor: "#232323",
      alignSelf: "center",
    },
    rolSelectButton: {
      minWidth: 140,
      borderRadius: 20,
      paddingVertical: 8,
      backgroundColor: "#333",
      marginLeft: 8,
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
      gap: 8,
    },
    usersCard: {
      width: "100%",
      maxWidth: 600,
      marginBottom: 16,
      backgroundColor: "#232323",
      alignSelf: "center",
      borderRadius: 12,
      paddingVertical: 8,
    },
    userRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: "#222",
      gap: 8,
    },
    userActions: {
      flexDirection: "row",
      gap: 8,
    },
    name: {
      fontSize: 22,
      color: "#fff",
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: 2,
    },
    role: {
      fontSize: 16,
      color: "#ccc",
      textAlign: "center",
      marginBottom: 2,
    },
  });
}
