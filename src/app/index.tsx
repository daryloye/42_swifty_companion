import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Alert, Button, ImageBackground, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { Login } from '../components/Login';
import { Logout } from '../components/Logout';

export default function HomeScreen() {
    const router = useRouter();
    const [login, onChangeLogin] = useState('');
    
    const handleSearch = () => {
        if (login.trim() === '') {
            if (Platform.OS === 'web') {
                window.alert('Please enter a username');
                return;
            }
            else {
                Alert.alert('Error', 'Please enter a username');
                return;
            }
        }
        router.push({
            pathname: "/profile",
            params: { login: login.toLowerCase() },
        });
    }

    return (
        <ImageBackground
            source={require("../../assets/background.jpg")}
            resizeMode="cover"
            style={styles.container}
        >
            <View style={styles.container}>
                <Text style={styles.text}>Swiftly Companion 👀</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter username"
                    value={login}
                    onChangeText={onChangeLogin}
                />
                <Button
                    color="#055c9d"
                    title="Search User"
                    onPress={() => handleSearch()}
                />
                <Login />
                <Logout />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%"
    },
    input: {
        width: 150,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: "white",
        color: "black",
    },
    text: {
        fontSize: 24,
        color: "white",
        marginBottom: 10,
    },
});
