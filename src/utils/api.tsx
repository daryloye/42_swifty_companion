import { Token } from '../utils/cache';

const client_id = process.env.EXPO_PUBLIC_CLIENT_ID;
const client_secret = process.env.EXPO_PUBLIC_CLIENT_SECRET;
const base_url = "https://api.intra.42.fr";


export async function fetchWithTimeout(url: string, options = {}, timeout = 5000) {
    
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    const signal =  controller.signal;

    try {
        const response = await fetch(url, { ...options, signal });
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return await response.json()
    } catch (error: any) {
        if (error.name === "AbortError") {
            console.error('Fetch request aborted: ', error);
            throw new Error("Fetch request aborted:", error);
        } else if (error.name === "TimeoutError") {
            console.error('Fetch request timed out: ', error);
            throw new Error("Fetch request timed out:", error);
        } else {
            console.error('Fetch request failed: ', error);
            throw new Error("Fetch request failed:", error);
        }
    }
}

export async function fetchTokenWithCode(code: string, redirectUri: string, state: string): Promise<Token> {
    const res = await fetchWithTimeout(base_url + `/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: client_id,
            client_secret: client_secret,
            code: code,
            redirect_uri: redirectUri,
            state: state
        })
    });
    if (res === undefined || res.access_token === undefined) {
        throw new Error("Failed to fetch token");
    }
    console.log('Fetched token:', res.access_token);
    console.log('Token expires in:', res.expires_in);
    return {
        access_token: res.access_token,
        expiry_time: res.expires_in + Date.now()/1000,
        refresh_token: res.refresh_token,
    } as Token;
}

export async function fetchTokenRefresh(refresh_token: string) {
    const res = await fetchWithTimeout(base_url + `/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            grant_type: 'refresh_token',
            client_id: client_id,
            client_secret: client_secret,
            refresh_token: refresh_token,
        })
    });
    if (res === undefined || res.access_token === undefined) {
        throw new Error("Failed to refresh token");
    }
    console.log('Refreshed token:', res.access_token);
    console.log('Token expires in:', res.expires_in);
    return {
        access_token: res.access_token,
        expiry_time: res.expires_in + Date.now()/1000,
        refresh_token: res.refresh_token,
    } as Token;
}

export async function fetchUserId(token: string, login: string) {
    const res = await fetchWithTimeout(base_url + `/v2/users?filter[login]=` + login, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (res === undefined || res.length === 0) {
        throw new Error("User not found");
    }
    return res[0].id;
}

export async function fetchUserDetails(token: string, id: string) {
    const res = await fetchWithTimeout(base_url + `/v2/users/` + id, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (res === undefined || res.length === 0) {
        throw new Error("User data not found");
    }
    return res;
}