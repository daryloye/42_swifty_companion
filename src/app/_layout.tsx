import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                contentStyle: { backgroundColor: "transparent" },
                animation: "none",
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ title: "Profile" }} />
            <Stack.Screen name="+not-found" options={{ title: "404 Page Not Found" }} />
        </Stack>
    );
}

