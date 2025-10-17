import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function PageNotFoundScreen() {
    const router = useRouter();
    
    return (
        <View style={styles.container}>
            <Text style={styles.text}>404 Page Not Found 😭</Text>
            <Button
                color="#055c9d"
                title="Back to Home"
                onPress={() => router.push("/")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    color: "black",
    marginBottom: 40,
  },
});