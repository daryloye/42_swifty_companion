const client_id = process.env.EXPO_PUBLIC_CLIENT_ID;
const client_secret = process.env.EXPO_PUBLIC_CLIENT_SECRET;
const base_url = "https://api.intra.42.fr";

export async function fetchWithTimeout(url: string, options = {}, timeout = 5000) {
    const signal = AbortSignal.timeout(timeout);

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

export async function authorize() {
    const response = await fetch(base_url + `/oauth/authorize?client_id=${client_id}&redirect_uri=http://localhost&response_type=code`, {
        method: 'GET',
    });
    const data = await response.json();
    console.log(data);
    return data;
}

export async function fetchToken() {
    const res = await fetchWithTimeout(base_url + `/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            grant_type: 'client_credentials',
            client_id: client_id,
            client_secret: client_secret,
        })
    });
    if (res === undefined || res.access_token === undefined) {
        throw new Error("Failed to fetch token");
    }
    return res.access_token;
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