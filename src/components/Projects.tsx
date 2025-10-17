import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProjectsProps {
    projects: {
        final_mark: number | null;
        status: string;
        project: {
            name: string;
        }
    }[]
}

export function Projects({ projects }: ProjectsProps) {
    if (!projects || projects.length === 0 ) {
        return <Text>No skills available</Text>;
    }

    return (
        <View style={styles.table}>
            {/* Header */}
            <View style={styles.row}>
                <Text style={[styles.header, styles.cell]}>Project</Text>
                <Text style={[styles.header, styles.cell]}>Status</Text>
                <Text style={[styles.header, styles.cell]}>Mark</Text>
            </View>

            {/* Row */}
            {projects.map((p) => (
                <View key={p.project.name} style={styles.row}>
                    <Text style={styles.cell}>{p.project.name}</Text>
                    <Text style={styles.cell}>{p.status}</Text>
                    <Text style={styles.cell}>{p.final_mark}</Text>
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    table: { borderWidth: 1, borderColor: 'black', margin: 10, width: '75%' },
    header: { fontWeight: 'bold' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    cell: { flex: 1, padding: 2, textAlign: 'center' },
});


