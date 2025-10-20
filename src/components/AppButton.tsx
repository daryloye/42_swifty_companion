import { Pressable, StyleSheet, Text } from 'react-native';

type AppButtonProps = {
    title: string,
    onPress: () => void;
}

export function AppButton({title, onPress}: AppButtonProps) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#055c9d",
        padding: 12,
        borderRadius: 8,
        marginVertical: 5,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    }
})