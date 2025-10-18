import { useRouter } from 'expo-router';
import { useEffect } from 'react';


export default function CallbackScreen() {
    const router = useRouter();

    useEffect(() => {
        router.push('/');
    }, []);

    return null;
}