import React, { useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { TextInput, Button, useTheme } from "react-native-paper";
import { colors } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { sigIn } from "../service/api/api";
import { User } from "../models/user/user";
import { Role } from "../models/role/role";
import { SeguridadContext } from "../asyncData/Context";

export default function LogIn() {
  const { guardarToken } = useContext(SeguridadContext);

  const theme = useTheme();
  const navigation = useNavigation();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Error", "Por favor, ingrese usuario y contraseña");
      return;
    }
    try {
      const userPayload = new User(
        0,
        "",
        "",
        email,
        password,
        0,
        new Role(0, "")
      );
      const result = await sigIn(userPayload);
      console.log("Respuesta API login:", result);
      const token = result?.response?.tokenApp;
      console.log("Token recibido:", token);

      if (typeof token === "string") {
        await guardarToken(token);
        navigation.navigate("Votación" as never);
      }
    } catch (error) {
      Alert.alert("Error", "Usuario o contraseña no válidos");
      console.error(error);
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
        onChangeText={(text) => setEmail(text)}
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
