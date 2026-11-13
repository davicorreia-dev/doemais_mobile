import { Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from './styles';

type ActivityCardProps = { icon: any; label: string; highlight?: boolean; onPress?: () => void };

export default function ActivityCard({ icon, label, highlight, onPress }: ActivityCardProps) {
    return <TouchableOpacity style={[styles.card, highlight && styles.cardHighlight]} onPress={onPress} disabled={!onPress} accessibilityRole={onPress ? 'button' : undefined} accessibilityLabel={label}>
        <View style={[styles.icon, highlight && styles.iconHighlight]}><FontAwesome5 name={icon} size={20} color="#E0323C" /></View>
        <Text style={[styles.label, highlight && styles.labelHighlight]}>{label}</Text>
    </TouchableOpacity>;
}
