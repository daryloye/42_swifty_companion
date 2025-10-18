import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const key = 'token';

export async function setToken(value: string) {
    if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
    } else {
        await SecureStore.setItemAsync(key, value);
    }
    console.log('Set token')
}

export async function getToken() {
    var token;
    if (Platform.OS === 'web') {
        token = localStorage.getItem(key);
    } else {
        token = await SecureStore.getItemAsync(key);
    }
    console.log('Get token');
    return token
}

export async function deleteToken() {
    if (Platform.OS === 'web') {
        localStorage.removeItem(key);
    } else {
        await SecureStore.deleteItemAsync(key);
    }
    console.log('Delete token');
}