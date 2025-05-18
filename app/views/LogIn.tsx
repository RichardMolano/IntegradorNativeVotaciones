import React, { useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { TextInput, Button, useTheme } from "react-native-paper";
import { colors } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../asyncData/Context";
import { Alert } from "react-native";

export default function LogIn() {
  const initialAdminUser = {
    id: "admin",
    userName: "admin",
    password: "admin",
    voted: false,
    vote: ["admin"],
    rol: "admin",
  };
  const { user = [], setUser } = useContext(UserContext);
  React.useEffect(() => {
    if (!user || user.length === 0) {
      setUser((prev: any[] = []) => [...prev, initialAdminUser]);
    }
  }, []);
  const theme = useTheme();
  const navigation = useNavigation();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = () => {
    const foundUser = user.find((cred) => cred.userName == username);
    if (foundUser && foundUser.password == password) {
      console.log("Login successful");
      navigation.navigate("MainTabs" as never);
    } else {
      console.log("Login failed");
      console.log(user);

      Alert.alert("Error", "Usuario o contraseña no válidos");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      <Image
        source={require("../../assets/voting_login.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <TextInput
        label="Usuario"
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="account" />}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        label="Contraseña"
        mode="outlined"
        secureTextEntry
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
        onChangeText={(text) => setPassword(text)}
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        contentStyle={{ paddingVertical: 8 }}
      >
        Iniciar sesión
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || "#1e1e2f",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: colors.text || "#fff",
    marginBottom: 20,
    fontWeight: "bold",
    fontSize: 24,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  input: {
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
    marginBottom: 15,
  },
  button: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "center",
  },
});
