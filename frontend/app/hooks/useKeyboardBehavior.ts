import { useState, useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';

export function useKeyboardBehavior() {
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    // No iOS sempre usamos 'padding'. No Android, usamos 'padding' apenas quando o teclado estiver aberto
    // para evitar o footer branco indesejado quando o teclado estiver fechado.
    return Platform.OS === 'ios' ? 'padding' : (keyboardVisible ? 'padding' : undefined);
}
