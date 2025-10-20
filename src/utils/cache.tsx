import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const tokenKey = '_token';
const friendsKey = '_friends';

export async function setToken(value: string) {
    if (Platform.OS === 'web') {
        localStorage.setItem(tokenKey, value);
    } else {
        await SecureStore.setItemAsync(tokenKey, value);
    }
    console.log('Set token')
}

export async function getToken() {
    var value;
    if (Platform.OS === 'web') {
        value = localStorage.getItem(tokenKey);
    } else {
        value = await SecureStore.getItemAsync(tokenKey);
    }
    console.log('Get token');
    return value
}

export async function deleteToken() {
    if (Platform.OS === 'web') {
        localStorage.removeItem(tokenKey);
    } else {
        await SecureStore.deleteItemAsync(tokenKey);
    }
    console.log('Delete token');
}

export async function addFriendId(key: string, value: string) {
    var friends: Record<string, string> = {};
    if (Platform.OS === 'web') {
        const stored = localStorage.getItem(friendsKey);
        if (stored) {
            friends = JSON.parse(stored);
        }
        friends[key] = value;
        localStorage.setItem(friendsKey, JSON.stringify(friends));
    } else {
        const stored = await SecureStore.getItemAsync(friendsKey);
        if (stored) {
            friends = JSON.parse(stored);
        }
        friends[key] = value;
        await SecureStore.setItemAsync(friendsKey, JSON.stringify(friends));
    }
    console.log('Add friend');
}

export async function getFriendIds() {
    var friends: Record<string, string> = {};
    if (Platform.OS === 'web') {
        const stored = localStorage.getItem(friendsKey);
        if (stored) {
            friends = JSON.parse(stored);
        }
    } else {
        const stored = await SecureStore.getItemAsync(friendsKey);
        if (stored) {
            friends = JSON.parse(stored);
        }
    }
    const value = Object.values(friends);
    console.log('Get friend');
    return value
}

export async function deleteFriendId(key: string) {
    var friends: Record<string, string> = {};
    if (Platform.OS === 'web') {
        const stored = localStorage.getItem(friendsKey);
        if (stored) {
            friends = JSON.parse(stored);
        }
        delete friends[key];
        localStorage.setItem(friendsKey, JSON.stringify(friends));
    } else {
        const stored = await SecureStore.getItemAsync(friendsKey);
        if (stored) {
            friends = JSON.parse(stored);
        }
        delete friends[key];
        await SecureStore.setItemAsync(friendsKey, JSON.stringify(friends));
    }
    console.log('Delete friend');
}
