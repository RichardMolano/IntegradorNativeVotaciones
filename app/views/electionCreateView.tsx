import React, { useCallback, useContext, useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Animated,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { Text, Button, TextInput, Divider, Snackbar } from "react-native-paper";

import { colors } from "../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RoleController } from "../controllers/private/rolControlle";
import { ElectionController } from "../controllers/private/electionController";
import { Elections } from "../models/elections/elections";
import { useNavigation } from "@react-navigation/native";
import FabMenuNavigator from "./hooks/fabMenuNavegator";
import { SeguridadContext } from "../asyncData/Context";
import NavBar from "./hooks/NavBar";
import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";
import dayjs from "dayjs";

export default function ElectionCreateView() {
  let today = new Date();
  const defaultStyles = useDefaultStyles();
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const { sesion, token } = useContext(SeguridadContext);

  const insets = useSafeAreaInsets();
  const electionController = new ElectionController();
  const [newElection, setNewElection] = React.useState<Elections>({
    id: 0,
    codeJoin: "",
    name: "",
    end_date: new Date(),
    start_date: new Date(),
    state: false,
  });
  const handleCreateElection = async () => {
    if (newElection.start_date.getDate() === today.getDate()) {
      newElection.state = true;
    }
    const election = await electionController.createElection(
      newElection,
      token
    );
    if (election) {
      console.log("Election created successfully:", election);
      navigation.navigate("ElectionsProcess", {
        token: token,
        election: election,
      });
    } else {
      console.error("Failed to create election");
    }

    console.log("Creating election with data:", newElection);
  };

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;
  const styles = getStyles(isSmallScreen, insets);
  const [showSnack, setShowSnack] = React.useState(false);

  const toggleSnack = () => {
    setShowSnack((prev) => !prev);
  };

  // This function is used to create a new election and display a code for joining the party.
  return (
    <View style={styles.container}>
      <View style={{ width: "100%", alignItems: "center" }}>
        <Text variant="headlineSmall" style={{ textAlign: "center" }}>
          Crear Elección
        </Text>

        <Divider style={{ width: "80%", alignSelf: "center" }} />
        <TextInput
          style={{ marginTop: 15, width: 300, alignSelf: "center" }}
          label="Nombre de la Elección"
          mode="outlined"
          value={newElection.name}
          onChangeText={(text) =>
            setNewElection({ ...newElection, name: text })
          }
        />
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Button
            icon="calendar"
            mode="outlined"
            onPress={() => setOpen(true)}
            style={{ marginBottom: 10, marginTop: 15, width: "100%" }}
          >
            {`Start: ${
              newElection.start_date instanceof Date
                ? newElection.start_date.toLocaleDateString()
                : ""
            }  |  End: ${
              newElection.end_date instanceof Date
                ? newElection.end_date.toLocaleDateString()
                : ""
            }`}
          </Button>
          <View style={{ width: 300, alignItems: "center", marginTop: 10 }}>
            {open && (
              <View
                style={{
                  backgroundColor: Platform.OS === "web" ? "#232126" : "#fff",
                  borderRadius: 12,
                  padding: 12,
                  elevation: 6,
                  shadowColor: "#000",
                  shadowOpacity: 0.12,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 3 },
                  marginBottom: 10,
                  width: "100%",
                  borderWidth: Platform.OS === "web" ? 1 : 0,
                  borderColor: Platform.OS === "web" ? "#444" : undefined,
                  alignItems: "center",
                }}
              >
                <Text
                  variant="titleMedium"
                  style={{
                    marginBottom: 8,
                    color: Platform.OS === "web" ? "#fff" : "#232126",
                    alignSelf: "flex-start",
                  }}
                >
                  Select Election Dates
                </Text>
                <DateTimePicker
                  mode="range"
                  startDate={newElection.start_date}
                  endDate={newElection.end_date}
                  onChange={({ startDate, endDate }) => {
                    setNewElection({
                      ...newElection,
                      start_date: dayjs(startDate).toDate(),
                      end_date: dayjs(endDate).toDate(),
                    });
                  }}
                  styles={{
                    ...defaultStyles,
                  }}
                  minDate={today}
                />
                <Button
                  mode="contained-tonal"
                  onPress={() => setOpen(false)}
                  style={{ marginTop: 12, alignSelf: "flex-end" }}
                  labelStyle={{ fontWeight: "bold" }}
                  compact
                >
                  Done
                </Button>
              </View>
            )}
          </View>
        </View>
        <Button
          style={{ marginTop: 5, width: 200, alignSelf: "center" }}
          icon="send"
          mode="contained"
          onPress={() => {
            handleCreateElection();
          }}
        >
          Create Election
        </Button>
      </View>
      {Platform.OS === "web" ? (
        <NavBar visible={true} />
      ) : (
        <FabMenuNavigator visible={true} />
      )}
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
  });
}
function toDate(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }
  return date;
}
