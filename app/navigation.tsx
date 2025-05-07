// app/navigation.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogIn from "./views/LogIn";
import VotingPanel from "./views/VotingPanel";
import AdministrationPanel from "./views/AdministrationPanel";
import AdministrativePanel from "./views/AdministrativePanel";
import CandidatePanel from "./views/CandidatePanel";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

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
function Voting() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Votación" component={VotingPanel} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LogIn} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
