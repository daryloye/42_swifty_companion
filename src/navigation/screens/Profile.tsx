import { Button, Text } from '@react-navigation/elements';
import { StaticScreenProps } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Projects } from '../../components/Projects';
import { Skills } from '../../components/Skills';

type Props = StaticScreenProps<{ user: string }>;

// TODO: get client_id and client_secret from oauth
const client_id = process.env.EXPO_PUBLIC_CLIENT_ID;
const client_secret = process.env.EXPO_PUBLIC_CLIENT_SECRET;
const base_url = "https://api.intra.42.fr";

async function fetchWithTimeout(url: string, options = {}, timeout = 5000) {
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


async function authorize() {
  const response = await fetch(base_url + `/oauth/authorize?client_id=${client_id}&redirect_uri=http://localhost&response_type=code`, {
    method: 'GET',
  });
  const data = await response.json();
  console.log(data);
  return data;
}


async function fetchToken() {
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

async function fetchUserId(token: string, login: string) {
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

async function fetchUserDetails(token: string, id: string) {
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


export function Profile({ route }: Props) {
  const [token, setToken] = useState('');
  const [user, setUser] = useState('' as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await fetchToken();
        setToken(token);

        const id = await fetchUserId(token, route.params.user);
        const data = await fetchUserDetails(token, id);
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
        <Button screen="Home">Back to Home</Button>
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
      
      <Button screen="Home">Back to Home</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { 
    fontSize: 20, 
    fontWeight: 'bold' },
  image: { 
    width: 100, 
    height: 100, 
    borderRadius: 50 },
  container: { 
    padding: 50, 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    gap: 10,
  },
});
