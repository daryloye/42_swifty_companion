import { useRouter } from "expo-router";
import { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, View } from "react-native";
import { AppButton } from '../components/AppButton';
import { Login } from '../components/Login';
import { Logout } from '../components/Logout';
import { alert } from '../utils/alert';

export default function HomeScreen() {
    const router = useRouter();
    const [login, onChangeLogin] = useState('');
    
    const handleSearch = () => {
        if (login === '') {
            alert('Please enter a login');
        } else {
            router.push({
                pathname: "/profile",
                params: { login: login },
            });
        }
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
                    onChangeText={(text) => onChangeLogin(text.trim().toLowerCase())}
                />
                <AppButton title="Search User" onPress={handleSearch} />
                <AppButton title="Find Friends" onPress={() => router.push('/friends')} />
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
