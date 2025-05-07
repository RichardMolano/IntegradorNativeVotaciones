import React from "react";
import { colors } from "../../constants/colors";
import { Image, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function VotingPanel() {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Welcome to the Voting Panel</Text>

      <Button
        mode="contained"
        onPress={() => navigation.navigate("Login" as never)}
        style={{
          backgroundColor: colors.primary,
          marginTop: 20,
          padding: 10,
          borderRadius: 5,
        }}
      >
        Press Me
      </Button>
    </View>
  );
}
