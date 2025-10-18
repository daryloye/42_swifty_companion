import { Button } from 'react-native';
import * as Token from '../utils/token';

export function Logout() {
    return (
        <Button
            title="Logout"
            color="#055c9d"
            onPress={() => Token.deleteToken()}
        />
    );
}