import React, { useContext, useEffect, useState, useRef } from "react";
import { NavigationContainer, ParamListBase } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LogIn from "./views/LogIn";
import VotingPanel from "./views/VotingPanel";
import AdministrationPanel from "./views/AdministrationPanel";
import CandidatePanel from "./views/CandidatePanel";

import { SeguridadContext } from "./asyncData/Context";
import AdministrativePanel from "./views/AdministrativePanel";
import ElectionCreateView from "./views/electionCreateView";
import electionsListView from "./views/elections/electionsListView";
import electionsListUserView from "./views/elections/electionsListUserView";
import electionsProssesView from "./views/elections/electionsProssesView";

const Stack = createStackNavigator();

export default function Navigation() {
  const { isAuthenticated, verificarSesion, sesion } =
    useContext(SeguridadContext);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigationRef = useRef<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      await verificarSesion();
      setCheckingSession(false);
    };
    checkSession();
  }, []);

  // Verifica sesión en cada navegación
  useEffect(() => {
    const unsubscribe = navigationRef.current?.addListener?.(
      "state",
      async () => {
        await verificarSesion();
      }
    );
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [verificarSesion]);

  if (checkingSession) {
    return <></>;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LogIn} />
        ) : (
          <>
            <>
              <Stack.Screen name="Votación" component={VotingPanel} />
              <Stack.Screen name="Candidatos" component={CandidatePanel} />
            </>
            {sesion.roleUser.name === "Administrator" ||
            sesion.roleUser.name === "Admin" ? (
              <>
                <Stack.Screen
                  name="Administración"
                  component={AdministrationPanel}
                />
                <Stack.Screen
                  name="ElectionsList"
                  component={electionsListView}
                />
                <Stack.Screen
                  name="ElectionsProcess"
                  component={electionsProssesView}
                />
                <Stack.Screen
                  name="Panel Elecciones"
                  component={ElectionCreateView}
                />
              </>
            ) : null}

            {sesion.roleUser.name === "Admin" ? (
              <>
                <Stack.Screen
                  name="Panel Admin"
                  component={AdministrativePanel}
                />
              </>
            ) : null}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
