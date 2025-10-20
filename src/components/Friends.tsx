import { ScrollView, StyleSheet, Text, View } from 'react-native';

type FriendsProps = {
    logins: string[]
    locations: string[]
}

export function Friends({ logins, locations }: FriendsProps) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {locations.some(loc => loc !== null) ? (
                <Text style={styles.text}>NOT SAFE ❌</Text>
            ): <Text style={styles.text}>SAFE ✅</Text>}
            <View style={styles.table}>
                {/* Header */}
                <View style={styles.row}>
                    <Text style={[styles.header, styles.cell]}>Login</Text>
                    <Text style={[styles.header, styles.cell]}>Location</Text>
                </View>

                {/* Location */}
                {logins.map((login, i) => (
                    <View key={i} style={styles.row}>
                        <Text style={styles.cell}>{login}</Text>
                        <Text style={styles.cell}>{locations[i]}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    table: { 
        borderWidth: 1, 
        borderColor: 'black', 
        margin: 10, 
        width: 200,
    },
    header: { fontWeight: 'bold' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    cell: { flex: 1, padding: 2, textAlign: 'center' },
    container: {
        padding: 15,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
});