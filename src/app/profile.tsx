import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { Projects } from '../components/Projects';
import { Skills } from '../components/Skills';
import * as api from '../utils/api';
import * as cache from '../utils/cache';


export default function ProfileScreen() {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const { login } = useLocalSearchParams<{ login: string }>();

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await cache.getToken();
                if (!token) {
                    throw Error('Not Logged In');
                }
                const id = await api.fetchUserId(token, login);
                if (!id) return;
                
                const data = await api.fetchUserDetails(token, id);
                if (!data) return;
                
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
    }, [login]);

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
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
            <Text style={styles.header}>{user.login}'s Profile</Text>
            <Image
                source={{ uri: user.image.link }}
                style={styles.image}
            />
            <Text>Name: {user.usual_full_name}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Wallet: A${user.wallet}</Text>

            {user.cursus_users?.length > 0 && (
                <Skills cursus={user.cursus_users[user.cursus_users.length - 1]} />
            )}

            {user.project_users && 
                <Projects projects={user.projects_users} />
            }
            
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
