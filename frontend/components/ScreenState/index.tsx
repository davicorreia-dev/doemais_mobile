import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import styles from './styles';

type ScreenStateProps = {
    type: 'loading' | 'empty' | 'error';
    title?: string;
    message?: string;
    onRetry?: () => void;
    desktop?: boolean;
};

export default function ScreenState({ type, title, message, onRetry, desktop }: ScreenStateProps) {
    if (type === 'loading') {
        return <View style={[styles.container, desktop && styles.desktop]}><ActivityIndicator size="large" color="#E0323C" /><Text style={styles.message}>{message || 'Carregando...'}</Text></View>;
    }

    const isError = type === 'error';
    return (
        <View style={[styles.container, desktop && styles.desktop]}>
            <View style={styles.icon}><Ionicons name={isError ? 'cloud-offline-outline' : 'information-circle-outline'} size={40} color="#E0323C" /></View>
            <Text style={styles.title}>{title || (isError ? 'Não foi possível carregar' : 'Nada por aqui ainda')}</Text>
            {message && <Text style={styles.message}>{message}</Text>}
            {onRetry && <TouchableOpacity style={styles.retryButton} onPress={onRetry} accessibilityRole="button"><Text style={styles.retryText}>Tentar novamente</Text></TouchableOpacity>}
        </View>
    );
}
