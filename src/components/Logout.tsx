import { AppButton } from '../components/AppButton';
import * as Token from '../utils/cache';

export function Logout() {
    return (
        <AppButton title="Logout" onPress={() => Token.deleteToken()} />
    );
}