import React, { useContext } from "react";
import { colors } from "../../constants/colors";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Button, Card, useTheme } from "react-native-paper";
import { TabActions, useNavigation } from "@react-navigation/native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { UserContext } from "../asyncData/Context";

const candidates = [
  {
    id: "1",
    name: "Ana Torres",
    semester: "5° semestre",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: "2",
    name: "Carlos Gómez",
    semester: "6° semestre",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "3",
    name: "Laura Mendoza",
    semester: "4° semestre",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function VotingPanel() {
  const { user, setUser } = useContext(UserContext);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const handleVote = (id: string) => {
    setSelectedId(id);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Panel de Votación</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {candidates.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleVote(item.id)}
                activeOpacity={1}
              >
                <Card
                  style={[
                    styles.card,
                    isSelected && {
                      borderColor: theme.colors.primary,
                      borderWidth: 2,
                    },
                  ]}
                >
                  <Image source={{ uri: item.image }} style={styles.avatar} />
                  <View style={styles.info}>
                    <Text style={styles.Textinf}>{item.name}</Text>
                    <Text style={styles.Textinf}>{item.semester}</Text>
                    <View style={{ height: 30 }}></View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate("Login" as never)}
          style={styles.logoutButton}
        >
          Cerrar sesión
        </Button>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  Textinf: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 8,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background || "#121212",
    padding: 16,
  },
  title: {
    color: colors.text || "#fff",
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 22,
  },
  card: {
    width: 120,
    marginRight: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  info: {
    alignItems: "center",
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 20,
    alignSelf: "center",
  },
});
