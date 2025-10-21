import * as cache from '../utils/cache';
import { AppButton } from './AppButton';

export function ExpireToken() {
    return (
        <AppButton title="Expire Token" onPress={() => cache.expireToken()} />
    )
}