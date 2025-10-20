import { AppButton } from '../components/AppButton';
import * as Token from '../utils/token';

export function Logout() {
    return (
        <AppButton title="Logout" onPress={() => Token.deleteToken()} />
    );
}