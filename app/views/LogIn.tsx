import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { colors } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import VotingPanel from "./VotingPanel";

const credentials = [
  { username: "admin", password: "admin" },
  { username: "user1", password: "password1" },
  { username: "user2", password: "password2" },
];

export default function LogIn() {
  const theme = useTheme();
  const navigation = useNavigation();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = () => {
    const user = credentials.find((cred) => cred.username == username);
    if (user && user.password == password) {
      console.log("Login successful");
      // Navigate to the VotingPanel screen
      navigation.navigate("MainTabs" as never);
    } else {
      console.log("Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Bienvenido
      </Text>
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
        onPress={() => {
          handleLogin();
        }}
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
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    borderRadius: 8,
    marginTop: 10,
  },
});
