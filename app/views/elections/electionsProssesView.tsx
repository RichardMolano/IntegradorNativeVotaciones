import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  useWindowDimensions,
  ScrollView,
  Platform,
} from "react-native";
import {
  Text,
  Button,
  Divider,
  Card,
  Checkbox,
  Chip,
} from "react-native-paper";
import { colors } from "../../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Elections } from "../../models/elections/elections";
import dayjs from "dayjs";
import { UserController } from "../../controllers/private/userController";
import NavBar from "../hooks/NavBar";
import { CandidatesController } from "../../controllers/private/candidateController";
import { VoteController } from "../../controllers/private/voteController";
import { Candidates } from "../../models/candidates/candidates";
import { Votes } from "../../models/vote/vote";
import { Student } from "../../models/student/student";
import { User } from "../../models/user/user";
import { Role } from "../../models/role/role";
import FabMenuNavigator from "../hooks/fabMenuNavegator";

type GrupoUsuario = "candidato" | "estudiante" | undefined;

interface UserWithGrupo {
  id: string;
  name?: string;
  email?: string;
  username?: string;
  grupo?: GrupoUsuario;
  order?: number;
  candidateId?: number;
  voteId?: number;
}

export default function ElectionsProssesView({ route }: { route: any }) {
  const { token, election } = route.params;
  const { id, codeJoin, name, end_date, start_date, state } =
    election as Elections;
  const controllerCandidate = new CandidatesController();
  const controllerVote = new VoteController();
  const userController = new UserController();

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;
  const styles = getStyles(isSmallScreen, insets);

  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState<UserWithGrupo[]>([]);
  const [originalUsers, setOriginalUsers] = React.useState<UserWithGrupo[]>([]);

  // Cargar usuarios y relaciones existentes
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        // 1. Traer todos los usuarios
        const allUsers = await userController.getAllUsers(token);

        // 2. Traer toda la información de la elección (candidatos y votos)
        const data = await controllerVote.getByElectionId(id, token);
        // data[0]: candidatos, data[1]: votantes

        // Extraer ids de candidatos y votantes
        const candidatosIds = Array.isArray(data[0])
          ? data[0].map((item: any) => item.id_user)
          : [];
        const votantesIds = Array.isArray(data[1])
          ? data[1].map((item: any) => item.id_user)
          : [];

        // Mapear usuarios con su grupo
        const usersWithGrupo: UserWithGrupo[] = [];
        for (const u of allUsers) {
          let grupo: GrupoUsuario = undefined;
          if (candidatosIds.includes(u.id)) {
            grupo = "candidato";
          } else if (votantesIds.includes(u.id)) {
            grupo = "estudiante";
          }
          usersWithGrupo.push({
            id: u.id.toString(),
            name: u.name,
            email: u.email,
            username: u.name,
            grupo,
          });
        }

        console.log("Usuarios con grupo:", usersWithGrupo);

        // Ordenar para mostrar primero candidatos, luego votantes, luego indefinidos
        const candidatosOrdenados = usersWithGrupo.filter(
          (u) => u.grupo === "candidato"
        );
        const votantesOrdenados = usersWithGrupo.filter(
          (u) => u.grupo === "estudiante"
        );
        const sinRol = usersWithGrupo.filter((u) => !u.grupo);

        const finalList = [
          ...candidatosOrdenados,
          ...votantesOrdenados,
          ...sinRol,
        ];

        if (mounted) {
          setUsers(finalList);
          setOriginalUsers(JSON.parse(JSON.stringify(finalList)));
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
        Alert.alert("Error", "No se pudo cargar la información");
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [token, id]);

  // Cambiar grupo de usuario (checkbox)
  const handleRoleChange = (userId: string, newGrupo: GrupoUsuario) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, grupo: u.grupo === newGrupo ? undefined : newGrupo }
          : u
      )
    );
  };

  // Guardar cambios en backend
  const handleGuardarOrden = async () => {
    setLoading(true);
    try {
      // Lista de votantes
      // Guardar votantes
      const votantes = users
        .filter((u) => u.grupo === "estudiante")
        .map(
          (u) =>
            new Votes(
              u.voteId || 0,
              undefined, // candidate
              new User(
                Number(u.id),
                u.name || "",
                u.email || "",
                u.username || "",
                "",
                0,
                new Role(0, "")
              ),
              election,
              new Date(),
              true
            )
        );
      await controllerVote.create(votantes, token);

      // Guardar candidatos
      const candidatos = users
        .filter((u) => u.grupo === "candidato")
        .map(
          (u) =>
            new Candidates(
              u.candidateId || 0,
              Number(u.id),
              election as Elections,
              new Student(
                new User(
                  Number(u.id),
                  u.name || "",
                  u.email || "",
                  u.username || "",
                  "",
                  0,
                  new Role(0, "")
                ),
                undefined,
                undefined
              ),
              name
            )
        );
      await controllerCandidate.createCandidate(candidatos, token);

      //borrar votantes y candidatos que no tengan grupo
      const usersToDelete = users.filter((u) => u.grupo === undefined);
      await controllerVote.deleteVotes(
        usersToDelete.map((u) => Number(u.id)),
        election.id,
        token
      );
      await controllerCandidate.deleteCandidates(
        usersToDelete.map((u) => Number(u.id!)),
        election.id,
        token
      );

      setOriginalUsers(JSON.parse(JSON.stringify(users)));
      Alert.alert("Éxito", "Orden y roles guardados correctamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el orden");
    }
    setLoading(false);
  };

  // Renderiza lista con checkboxes (solo web)
  const renderCheckboxList = () => (
    <View style={{ marginBottom: 24, width: "100%" }}>
      {users.map((user) => (
        <Card key={user.id} style={styles.userCard} mode="outlined">
          <Card.Content style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text variant="titleSmall" style={{ color: colors.primary }}>
                {user.name || user.email || user.username}
              </Text>
              <Text variant="bodySmall" style={{ color: "#aaa" }}>
                {user.email || user.username}
              </Text>
            </View>
            <Chip
              style={{
                backgroundColor:
                  user.grupo === "candidato"
                    ? "#c7b3f7"
                    : user.grupo === "estudiante"
                    ? "#b3f7c7"
                    : "#888",
                marginRight: 8,
              }}
              textStyle={{
                color:
                  user.grupo === "candidato"
                    ? "#000"
                    : user.grupo === "estudiante"
                    ? "#000"
                    : "#fff",
                fontWeight: "bold",
              }}
              compact
            >
              {user.grupo === "candidato"
                ? "Candidato"
                : user.grupo === "estudiante"
                ? "Votante"
                : "Sin definir"}
            </Chip>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox
                status={user.grupo === "candidato" ? "checked" : "unchecked"}
                onPress={() => handleRoleChange(user.id, "candidato")}
                color={colors.primary}
              />
              <Text style={styles.checkboxLabel}>Candidato</Text>
              <Checkbox
                status={user.grupo === "estudiante" ? "checked" : "unchecked"}
                onPress={() => handleRoleChange(user.id, "estudiante")}
                color={colors.accent}
              />
              <Text style={styles.checkboxLabel}>Votante</Text>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );

  // Renderiza usuarios agrupados por rol
  const renderGroupedUsers = () => {
    const candidatos = users.filter((u) => u.grupo === "candidato");
    const votantes = users.filter((u) => u.grupo === "estudiante");
    const indefinidos = users.filter((u) => !u.grupo);

    return (
      <ScrollView style={{ width: "100%", flex: 1 }}>
        {/* Candidatos */}
        <Text
          variant="titleMedium"
          style={{ color: "#c7b3f7", marginVertical: 8 }}
        >
          Candidatos ({candidatos.length})
        </Text>
        {candidatos.length > 0 && (
          <Text style={{ color: "#fff", marginBottom: 8 }}>
            {candidatos.map((u) => u.name || u.email || u.username).join(", ")}
          </Text>
        )}
        {candidatos.map((user) => (
          <Card key={user.id} style={styles.userCard} mode="outlined">
            <Card.Content
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 1 }}>
                <Text variant="titleSmall" style={{ color: colors.primary }}>
                  {user.name || user.email || user.username}
                </Text>
                <Text variant="bodySmall" style={{ color: "#aaa" }}>
                  {user.email || user.username}
                </Text>
              </View>
              <Chip
                style={{
                  backgroundColor: "#c7b3f7",
                  marginRight: 8,
                }}
                textStyle={{
                  color: "#000",
                  fontWeight: "bold",
                }}
                compact
              >
                Candidato
              </Chip>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Checkbox
                  status={user.grupo === "candidato" ? "checked" : "unchecked"}
                  onPress={() => handleRoleChange(user.id, "candidato")}
                  color={colors.primary}
                />
                <Text style={styles.checkboxLabel}>Candidato</Text>
                <Checkbox
                  status={user.grupo === "estudiante" ? "checked" : "unchecked"}
                  onPress={() => handleRoleChange(user.id, "estudiante")}
                  color={colors.accent}
                />
                <Text style={styles.checkboxLabel}>Votante</Text>
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* Votantes */}
        <Text
          variant="titleMedium"
          style={{ color: "#b3f7c7", marginVertical: 8 }}
        >
          Votantes ({votantes.length})
        </Text>
        {votantes.length > 0 && (
          <Text style={{ color: "#fff", marginBottom: 8 }}>
            {votantes.map((u) => u.name || u.email || u.username).join(", ")}
          </Text>
        )}
        {votantes.map((user) => (
          <Card key={user.id} style={styles.userCard} mode="outlined">
            <Card.Content
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 1 }}>
                <Text variant="titleSmall" style={{ color: colors.primary }}>
                  {user.name || user.email || user.username}
                </Text>
                <Text variant="bodySmall" style={{ color: "#aaa" }}>
                  {user.email || user.username}
                </Text>
              </View>
              <Chip
                style={{
                  backgroundColor: "#b3f7c7",
                  marginRight: 8,
                }}
                textStyle={{
                  color: "#000",
                  fontWeight: "bold",
                }}
                compact
              >
                Votante
              </Chip>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Checkbox
                  status={user.grupo === "candidato" ? "checked" : "unchecked"}
                  onPress={() => handleRoleChange(user.id, "candidato")}
                  color={colors.primary}
                />
                <Text style={styles.checkboxLabel}>Candidato</Text>
                <Checkbox
                  status={user.grupo === "estudiante" ? "checked" : "unchecked"}
                  onPress={() => handleRoleChange(user.id, "estudiante")}
                  color={colors.accent}
                />
                <Text style={styles.checkboxLabel}>Votante</Text>
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* Sin definir */}
        <Text
          variant="titleMedium"
          style={{ color: "#fff", marginVertical: 8 }}
        >
          Sin definir ({indefinidos.length})
        </Text>
        {indefinidos.length > 0 && (
          <Text style={{ color: "#fff", marginBottom: 8 }}>
            {indefinidos.map((u) => u.name || u.email || u.username).join(", ")}
          </Text>
        )}
        {indefinidos.map((user) => (
          <Card key={user.id} style={styles.userCard} mode="outlined">
            <Card.Content
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 1 }}>
                <Text variant="titleSmall" style={{ color: colors.primary }}>
                  {user.name || user.email || user.username}
                </Text>
                <Text variant="bodySmall" style={{ color: "#aaa" }}>
                  {user.email || user.username}
                </Text>
              </View>
              <Chip
                style={{
                  backgroundColor: "#888",
                  marginRight: 8,
                }}
                textStyle={{
                  color: "#fff",
                  fontWeight: "bold",
                }}
                compact
              >
                Sin definir
              </Chip>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Checkbox
                  status={user.grupo === "candidato" ? "checked" : "unchecked"}
                  onPress={() => handleRoleChange(user.id, "candidato")}
                  color={colors.primary}
                />
                <Text style={styles.checkboxLabel}>Candidato</Text>
                <Checkbox
                  status={user.grupo === "estudiante" ? "checked" : "unchecked"}
                  onPress={() => handleRoleChange(user.id, "estudiante")}
                  color={colors.accent}
                />
                <Text style={styles.checkboxLabel}>Votante</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    );
  };

  // Render principal
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerBox}>
          <Text variant="headlineLarge" style={styles.header}>
            Proceso de Elección
          </Text>
          <Text variant="titleMedium" style={styles.infoText}>
            Nombre: {name}
          </Text>
          <Text variant="titleMedium" style={styles.infoText}>
            Código de unión: {codeJoin}
          </Text>
          <Text variant="bodyMedium" style={styles.infoText}>
            {state === true && (
              <>
                <Text style={{ color: "green" }}>●</Text> Activo
              </>
            )}
            {state === false && (
              <>
                <Text style={{ color: "gray" }}>●</Text> Inactivo
              </>
            )}
            {typeof state !== "boolean" && <>{String(state)}</>}
          </Text>
          <Text variant="bodyMedium" style={styles.infoText}>
            Fecha de inicio: {dayjs(start_date).format("DD/MM/YYYY HH:mm")}
          </Text>
          <Text variant="bodyMedium" style={styles.infoText}>
            Fecha de fin: {dayjs(end_date).format("DD/MM/YYYY HH:mm")}
          </Text>
        </View>

        <Divider style={styles.divider} />

        {loading ? (
          <ActivityIndicator />
        ) : (
          <View style={{ width: "100%", flex: 1 }}>
            <Button
              mode="contained"
              style={styles.massButton}
              onPress={handleGuardarOrden}
            >
              Guardar orden y roles
            </Button>
            {renderGroupedUsers()}
          </View>
        )}

        <NavBar visible={true} />
      </SafeAreaView>
      {Platform.OS === "web" ? (
        <NavBar visible={true} />
      ) : (
        <FabMenuNavigator visible={true} />
      )}
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
      alignItems: "center",
    },
    headerBox: {
      width: "100%",
      alignItems: "center",
      marginBottom: 8,
      marginTop: 8,
    },
    header: {
      marginBottom: 16,
      color: colors.primary,
      fontWeight: "bold",
      textAlign: "center",
    },
    infoText: {
      marginBottom: 8,
      color: "#fff",
    },
    divider: {
      marginVertical: 16,
      width: "100%",
      backgroundColor: colors.primary,
      height: 1.5,
    },
    sectionTitle: {
      marginBottom: 8,
      color: "#c7b3f7",
      fontWeight: "bold",
      fontSize: 18,
      marginLeft: 8,
    },
    userCard: {
      marginBottom: 12,
      borderRadius: 12,
      borderColor: "#c7b3f7",
      backgroundColor: "#23272f",
      elevation: 2,
    },
    checkboxLabel: {
      marginRight: 12,
      color: "#fff",
      fontSize: 13,
    },
    massButton: {
      marginBottom: 16,
      alignSelf: "flex-end",
      color: "#fff",
      backgroundColor: "#c7b3f7",
    },
  });
}
