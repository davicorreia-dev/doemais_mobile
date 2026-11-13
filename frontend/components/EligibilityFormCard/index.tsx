import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

type EligibilityFormCardProps = {
    title: string;
    description: string;
    image: any;
    status: 'approved' | 'blocked' | 'neutral';
    blockedMessage?: string;
    onPress: () => void;
    onReview: () => void;
};

export default function EligibilityFormCard({ title, description, image, status, blockedMessage, onPress, onReview }: EligibilityFormCardProps) {
    const blocked = status === 'blocked';
    const approved = status === 'approved';
    const tint = blocked ? '#C62828' : approved ? '#2E7D32' : '#E0323C';
    const icon = blocked ? 'close-circle' : approved ? 'checkmark-circle' : 'chevron-forward';
    return <View style={[styles.card, blocked && styles.blocked, approved && styles.approved]}>
        <TouchableOpacity style={[styles.mainAction, status !== 'neutral' && styles.mainActionReview]} activeOpacity={0.85} onPress={onPress}>
            <View style={[styles.iconWrap, blocked && styles.iconBlocked, approved && styles.iconApproved]}><Image source={image} style={[styles.icon, { tintColor: tint }]} resizeMode="contain" /></View>
            <View style={styles.body}><Text style={[styles.title, { color: tint }]}>{title}</Text><Text style={[styles.description, { color: blocked ? '#D32F2F' : approved ? '#388E3C' : '#666' }]}>{blocked ? blockedMessage : description}</Text></View>
            {status === 'neutral' && <Ionicons name={icon} size={24} color={tint} />}
        </TouchableOpacity>
        {status !== 'neutral' && <TouchableOpacity style={styles.reviewButton} onPress={onReview} accessibilityRole="button" accessibilityLabel={`Solicitar revisão do formulário ${title}`}><Ionicons name="create-outline" size={20} color="#E0323C" /></TouchableOpacity>}
    </View>;
}
