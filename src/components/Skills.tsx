import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SkillsProps = {
    cursus: {
        skills: {
            name: string;
            level: number;
        }[]
    }
}

export function Skills({ cursus }: SkillsProps) {
    const maxLevel = 21;
    
    if (!cursus || !cursus.skills || cursus.skills.length === 0) {
        return <Text>No skills available</Text>;
    }

    return (
        <View style={styles.table}>
            {/* Header */}
            <View style={styles.row}>
                <Text style={[styles.header, styles.cell]}>Skill</Text>
                <Text style={[styles.header, styles.cell]}>Level</Text>
                <Text style={[styles.header, styles.cell]}>%</Text>
            </View>

            {/* Row */}
            {cursus.skills.map((skill) => (
                <View key={skill.name} style={styles.row}>
                    <Text style={styles.cell}>{skill.name}</Text>
                    <Text style={styles.cell}>{skill.level.toFixed(2)}</Text>
                    <Text style={styles.cell}>{(skill.level/maxLevel*100).toFixed(2)+'%'}</Text>
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


