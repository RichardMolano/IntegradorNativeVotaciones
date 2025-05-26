// app/navigation.tsx
import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LogIn from "./views/LogIn";
import VotingPanel from "./views/VotingPanel";
import AdministrationPanel from "./views/AdministrationPanel";
import CandidatePanel from "./views/CandidatePanel";

import { SeguridadContext } from "./asyncData/Context";
import AdministrativePanel from "./views/AdministrativePanel";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Votación" component={VotingPanel} />
      <Tab.Screen name="Candidatos" component={CandidatePanel} />
      <Tab.Screen name="Administración" component={AdministrationPanel} />
      <Tab.Screen name="Panel Admin" component={AdministrativePanel} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { isAuthenticated, verificarSesion } = useContext(SeguridadContext);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      await verificarSesion();
      setCheckingSession(false);
    };
    checkSession();
  }, []);

  if (checkingSession) {
    return (
      <div
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          display: "flex",
          backgroundColor: "#fff",
        }}
      >
        <img
          src={require("../assets/voting_login.png")}
          alt="App Icon"
          style={{ width: 80, height: 80, marginBottom: 20 }}
        />
        <span style={{ fontSize: 18, color: "#333" }}>Cargando...</span>
      </div>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LogIn} />
        ) : (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
