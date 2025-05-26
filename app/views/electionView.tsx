import React, { useContext } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { Text, Button, TextInput, Divider, Snackbar } from "react-native-paper";
import { colors } from "../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SeguridadContext } from "../asyncData/Context";
import { UserController } from "../controllers/private/userController";
import { User } from "../models/user/user";
import { Role } from "../models/role/role";
import { RoleController } from "../controllers/private/rolControlle";

export default function ElectionView() {
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

  const [showSnack, setShowSnack] = React.useState(false);

  function toggleSnack() {
    setShowSnack((prev) => !prev);
  }

  const [showCode, setShowCode] = React.useState(false);

  // Centrar todo el contenido usando el estilo container
  return (
    <View style={styles.container}>
      <View style={{ width: "100%", alignItems: "center" }}>
        <Text variant="headlineSmall" style={{ textAlign: "center" }}>
          Sign up to our newsletter!
        </Text>
        <Text
          variant="labelLarge"
          style={{ textAlign: "center", marginBottom: 16 }}
        >
          Get a monthly dose of fresh React Native Paper news straight to your
          mailbox. Just sign up to our newsletter and enjoy!
        </Text>
        <Divider style={{ width: "80%", alignSelf: "center" }} />
        <TextInput
          style={{ marginTop: 15, width: 300, alignSelf: "center" }}
          label="Outlined input"
          mode="outlined"
        />
        {showCode == true ? (
          <>
            <Text
              variant="labelLarge"
              style={{
                textAlign: "center",
                marginBottom: 16,
                marginTop: 16,
                color: "#bb86fc",
              }}
            >
              Use the code to join your party!
              {"\n"}
              Only useful for Actual users
            </Text>
            <Text
              variant="titleLarge"
              style={{
                color: "#bb86fc",
                fontWeight: "bold",
                fontSize: 32,
                letterSpacing: 2,
                textAlign: "center",
                marginVertical: 12,
              }}
            >
              123456
            </Text>
          </>
        ) : (
          <> </>
        )}
        <Button
          style={{ marginTop: 15, width: 200, alignSelf: "center" }}
          icon="send"
          mode="contained"
          onPress={() => setShowCode(true)}
        >
          Sign me up
        </Button>

        <Snackbar
          visible={showSnack}
          onDismiss={toggleSnack}
          action={{
            label: "Dismiss",
            onPress: () => {},
          }}
          duration={Snackbar.DURATION_LONG}
        >
          Hey there! I'm a Snackbar.
        </Snackbar>
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
      justifyContent: "center",
      alignItems: "center",
    },
    // ...otros estilos no modificados
  });
}
