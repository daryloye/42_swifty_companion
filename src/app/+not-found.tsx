import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from '../components/AppButton';

export default function PageNotFoundScreen() {
    const router = useRouter();
    
    return (
        <View style={styles.container}>
            <Text style={styles.text}>404 Page Not Found 😭</Text>
            <AppButton title="Back to Home" onPress={() => router.push('/')} />
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