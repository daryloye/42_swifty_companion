import * as AuthSession from "expo-auth-session";
import * as Crypto from 'expo-crypto';
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from 'react';
import { AppButton } from '../components/AppButton';
import * as Api from '../utils/api';
import * as Cache from '../utils/cache';

WebBrowser.maybeCompleteAuthSession();

async function generateState() {
    const bytes = await Crypto.getRandomBytesAsync(16);
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

export function Login() {
    const [state, setState] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const s = await generateState();
            setState(s);
        })();
    }, []);

    const redirectUri = AuthSession.makeRedirectUri({
        scheme: "swiftlycompanion",
        path: "callback",
    });
    const client_id = process.env.EXPO_PUBLIC_CLIENT_ID;

    const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId: client_id,
            redirectUri,
            responseType: "code",
            state: state!,
        },
        { authorizationEndpoint: "https://api.intra.42.fr/oauth/authorize" }
    );
    
    useEffect(() => {
        console.log("Redirect url:", redirectUri);
        if (response?.type === "success") {
            const handleAuth = async () => {
                const { code, state: returnedState } = response.params;
                if (state !== returnedState) {
                    console.error("State mismatch!");
                    return;
                }

                try {
                    const token = await Api.fetchTokenWithCode(code, redirectUri, state);
                    await Cache.setToken(token);
                } catch (err) {
                    console.error('Error fetching token:', err);
                }
            }

            handleAuth();
        };
    }, [response]);

    if (request) {
        return (
            <AppButton title="Login" onPress={() => promptAsync()} />
        );
    }
}
