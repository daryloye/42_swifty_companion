import { Button, Text } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';


export function Home() {
  const navigation = useNavigation();
  const [name, onChangeName] = useState('');

  const handlePress = () => {
    if (name.trim() === '') {
      // window.alert('Please enter a name1');
      // Alert.alert('Validation', 'Please enter a name');
      return;
    }
    console.log('Navigating to Profile with user:', name);
    navigation.navigate('Profile', { user: name });
  }

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeName}
        value={name}
        placeholder="Enter login"
      />
      <Button 
        onPress={() => handlePress()}>
        Search User
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
