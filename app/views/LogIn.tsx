import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Box } from '@react-native-material/core';



export default function LogIn() {
    return (
        <Box style={{ flex: 1, justifyContent: 'space-between', margin: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Log In</Text>
            <Box>
            <TextInput
                label="Email"
                mode="outlined"
                style={{ marginBottom: 10 }}
            />
            <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry
                style={{ marginBottom: 20 }}
            />
            </Box>
            <Button mode="contained" onPress={() => console.log('Login pressed')}>
            Log In
            </Button>
        </Box>
    );
}
