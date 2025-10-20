import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { Projects } from '../components/Projects';
import { Skills } from '../components/Skills';
import * as Api from '../utils/api';
import * as Token from '../utils/token';


export default function ProfileScreen() {
    const [user, setUser] = useState('' as any);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const { login } = useLocalSearchParams<{ login: string }>();

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await Token.getToken();
                // check if token expired??       
                if (!token) {
                    throw Error('Not Logged In');
                }
                const id = await Api.fetchUserId(token, login);
                const data = await Api.fetchUserDetails(token, id);
                setUser(data);
            }
            catch (err) {
                setError(err as Error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }
    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error: {error.message}</Text>
                <AppButton title="Back to Home" onPress={() => router.push('/')} />
            </View>
        );
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>{user.login}'s Profile</Text>
            <Image
                source={{ uri: user.image.link }}
                style={styles.image}
            />
            <Text>Name: {user.usual_full_name}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Wallet: A${user.wallet}</Text>
            <Skills cursus={user.cursus_users[user.cursus_users.length - 1]} />
            <Projects projects={user.projects_users} />
            <AppButton title="Home" onPress={() => router.push('/')} />
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    container: {
        padding: 50,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    text: {
        fontSize: 24,
        color: "black",
        marginBottom: 10,
    },
});
