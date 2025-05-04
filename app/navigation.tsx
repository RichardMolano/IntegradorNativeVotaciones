import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import LogIn from './views/LogIn';
import { Text } from 'react-native-paper';
import { Box } from '@react-native-material/core';

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
      <>
      <Box >
      <NavigationContainer>
      <LogIn />
    </NavigationContainer>

      </Box>
    </>
  );
}
