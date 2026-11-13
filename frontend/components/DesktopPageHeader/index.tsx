import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import styles from './styles';

type DesktopPageHeaderProps = {
    title: string;
    subtitle: string;
};

export default function DesktopPageHeader({ title, subtitle }: DesktopPageHeaderProps) {
    return (
        <View style={styles.header}>
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            <View style={styles.actions}>
                <View style={styles.iconButton}><Ionicons name="chatbubble-outline" size={19} color="#5F5953" /></View>
                <View style={styles.iconButton}><Ionicons name="notifications-outline" size={19} color="#5F5953" /></View>
            </View>
        </View>
    );
}
