import { Alert, Platform } from 'react-native';


export function alert(msg: string) {
    if (Platform.OS === 'web') {
        window.alert(msg);
    }
    else {
        Alert.alert('Alert', msg);
    }
}
