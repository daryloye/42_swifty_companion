import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Friends } from '../components/Friends';
import * as Api from '../utils/api';
import * as Token from '../utils/token';


export default function FriendsScreen() {
    const [input, onChangeInput] = useState('');
    const [locations, setLocations] = useState('' as any);
    const [friends, setFriends] = useState<string[]>([]);
    const [logins, setLogins] = useState('' as any);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await Token.getToken();       
                if (!token) {
                    throw Error('Not Logged In');
                }
                
                const locations = []
                const logins = []
                for (const friend of friends) {
                    console.log('searching for', friend);
                    const id = await Api.fetchUserId(token, friend);
                    const user = await Api.fetchUserDetails(token, id);
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
                setLoading(false);
            }
        };

        fetchData();
    }, [friends]);

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
                <Button
                    color="#055c9d"
                    title="Back to Home"
                    onPress={() => router.push("/")}
                />
            </View>
        );
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TextInput
                placeholder="Enter login"
                value={input}
                onChangeText={onChangeInput}
            />
            <View>
                <Button 
                    color="#055c9d"
                    title="Add"
                    onPress={() => {
                        var c = input.trim().toLowerCase();
                        if (!friends.includes(c)) {
                            setFriends([...friends, c]);
                        }
                        onChangeInput('');
                    }}
                />
                <Button
                    color="#055c9d"
                    title="Remove"
                    onPress={() => {
                        var c = input.trim().toLowerCase();
                        setFriends(friends.filter(x => x !== c))
                        onChangeInput('')
                    }}
                />
            </View>
            <Friends logins={logins} locations={locations}/>
            <Button
                color="#055c9d"
                title="Home"
                onPress={() => router.push("/")}
            />
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
