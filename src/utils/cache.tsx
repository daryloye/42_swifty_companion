import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import * as api from '../utils/api';

const tokenKey = '_token';
const friendsKey = '_friends';

export type Token = {
    access_token: string;
    expiry_time: number;
    refresh_token: string;
}

// storage
async function setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
    } else {
        await SecureStore.setItemAsync(key, value);
    }
}

async function getItem(key: string) {
    if (Platform.OS === 'web') {
        return localStorage.getItem(key);
    } else {
        return await SecureStore.getItemAsync(key);
    }
}

async function deleteItem(key: string) {
    if (Platform.OS === 'web') {
        localStorage.removeItem(key);
    } else {
        await SecureStore.deleteItemAsync(key);
    }
}


// Token
export async function setToken(token: Token) {
    console.log('Set token')
    await setItem(tokenKey, JSON.stringify(token))
}

export async function getToken(): Promise<string> {
    console.log('Get token');
    
    const stored = await getItem(tokenKey);
    if (!stored) return "";

    const { access_token, expiry_time, refresh_token } = JSON.parse(stored) as Token;

    // Refresh token
    if (expiry_time - 60 < Date.now()/1000) {
        console.log('Refreshing token')
        const new_token = await api.fetchTokenRefresh(refresh_token);
        setToken(new_token);
        return new_token.access_token;
    }

    return access_token;
}

export async function deleteToken() {
    console.log('Delete token');
    await deleteItem(tokenKey);
}

export async function expireToken() {
    console.log('Expire token');
    const stored = await getItem(tokenKey);
    if (!stored) return;

    var token = JSON.parse(stored) as Token;
    token.expiry_time = 60;
    console.log('Token expires in:', token.expiry_time);
    
    setToken(token);
}


// Friend
export async function addFriendId(key: string, value: string) {
    console.log('Add friend');
    
    const stored = await getItem(friendsKey);
    if (stored) {
        var friends = JSON.parse(stored);
    }
    
    friends[key] = value;
    await setItem(friendsKey, JSON.stringify(friends));
}

export async function getFriendIds(): Promise<string[]> {
    console.log('Get friend');

    const stored = await getItem(friendsKey);
    if (!stored) return [];

    const friends = JSON.parse(stored);
    return Object.values(friends);
}

export async function deleteFriendId(key: string) {
    console.log('Delete friend');

    const stored = await getItem(friendsKey);
    if (!stored) return;
    
    const friends = JSON.parse(stored);
    delete friends[key];
    await setItem(friendsKey, JSON.stringify(friends));
}
