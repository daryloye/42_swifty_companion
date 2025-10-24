import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { Friends } from '../components/Friends';
import { alert } from '../utils/alert';
import * as api from '../utils/api';
import * as cache from '../utils/cache';


export default function FriendsScreen() {
    const [input, onChangeInput] = useState('');

    const [locations, setLocations] = useState<string[]>([]);
    const [logins, setLogins] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const router = useRouter();

    const handleAdd = async () => {
        try {
            const token = await cache.getToken();
            if (!token) {
                throw Error('Not Logged in')
            }
            
            const id = await api.fetchUserId(token, input);
            if (!id) return;
    
            await cache.addFriendId(input, id);
            setLoading(true);
        }
        catch (err: any) {
            alert(err?.message || String(err));
        }
        finally {
            onChangeInput('');
        }
    }

    const handleRemove = async () => {
        await cache.deleteFriendId(input);
        onChangeInput('');
        setLoading(true);
    }

    // refresh
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await cache.getToken();       
                if (!token) {
                    throw Error('Not Logged In');
                }

                const ids = await cache.getFriendIds();
                if (ids.length === 0) {
                    setLocations([]);
                    setLogins([]);
                    return;
                }
                
                const locations: string[] = [];
                const logins: string[] = [];
                
                for (const id of ids) {
                    const user = await api.fetchUserDetails(token, id as string);
                    if (!user) continue;

                    console.log('fetching for id:', id);
                    locations.push(user.location);
                    logins.push(user.login);
                }
                
                setLocations(locations);
                setLogins(logins);
            }
            catch (err) {
                setError(err as Error);
            }
            finally {
                onChangeInput('');
                setLoading(false);
            }
        };

        fetchData();
    }, [loading]);


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
            <Text style={styles.header}>My friends 👬</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter username"
                value={input}
                onChangeText={(text) => onChangeInput(text.trim().toLowerCase())}
            />
            <View style={styles.horizontal}>
                <AppButton title="Add" onPress={() => handleAdd()} />
                <AppButton title="Remove" onPress={() => handleRemove() } />
                <AppButton title="Refresh" onPress={() => setLoading(true)} />
            </View>
            <Friends logins={logins} locations={locations}/>
            <AppButton title="Home" onPress={() => router.push('/')} />
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    container: {
        padding: 50,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
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
    horizontal: {
        flexDirection: 'row',
        gap: 12,
    },
});
