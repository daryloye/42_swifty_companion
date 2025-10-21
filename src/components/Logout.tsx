import { AppButton } from '../components/AppButton';
import * as cache from '../utils/cache';

export function Logout() {
    return (
        <AppButton title="Logout" onPress={() => cache.deleteToken()} />
    );
}