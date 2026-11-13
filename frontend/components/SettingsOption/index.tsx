import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import styles from './styles';

type SettingsOptionProps = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    onPress?: () => void;
    trailing?: React.ReactNode;
};

export default function SettingsOption({ icon, title, description, onPress, trailing }: SettingsOptionProps) {
    return (
        <TouchableOpacity style={styles.option} onPress={onPress} disabled={!onPress} accessibilityRole={onPress ? 'button' : undefined} accessibilityLabel={title}>
            <View style={styles.icon}><Ionicons name={icon} size={21} color="#E0323C" /></View>
            <View style={styles.text}><Text style={styles.title}>{title}</Text><Text style={styles.description}>{description}</Text></View>
            {trailing || (onPress ? <Ionicons name="chevron-forward" size={20} color="#A19A92" /> : null)}
        </TouchableOpacity>
    );
}
