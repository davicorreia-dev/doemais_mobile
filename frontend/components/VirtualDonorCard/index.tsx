import { Image, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import styles from './styles';

type VirtualDonorCardProps = {
    name: string;
    bloodType: string;
    approvalDate: string;
    underReview: boolean;
    desktop?: boolean;
};

export default function VirtualDonorCard({ name, bloodType, approvalDate, underReview, desktop }: VirtualDonorCardProps) {
    return (
        <View style={[styles.card, desktop && styles.cardDesktop]}>
            <View style={styles.cardAccent} />
            <View style={styles.brandRow}>
                <View style={styles.brandLogoWrap}>
                    <Image source={require('../../assets/images/doe-logo.png')} style={styles.brandLogo} resizeMode="contain" />
                </View>
                <Text style={styles.cardType}>CARTEIRINHA DIGITAL</Text>
            </View>
            <View style={styles.cardMain}>
                <View style={styles.donorDetails}>
                    <Text style={styles.fieldLabel}>DOADOR(A)</Text>
                    <Text style={styles.name} numberOfLines={2}>{name}</Text>
                </View>
                <View style={styles.bloodBadge}>
                    <Text style={styles.bloodType}>{bloodType}</Text>
                </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardFooter}>
                <View>
                    <Text style={styles.fieldLabel}>TRIAGEM CONCLUÍDA EM</Text>
                    <Text style={styles.date}>{approvalDate}</Text>
                </View>
                <View style={[styles.approvedSeal, underReview && styles.reviewSeal]}>
                    <Ionicons name={underReview ? 'time' : 'checkmark-circle'} size={18} color={underReview ? '#8A5A13' : '#22753A'} />
                    <Text style={[styles.approvedText, underReview && styles.reviewText]}>{underReview ? 'EM REVISÃO' : 'APTO(A)'}</Text>
                </View>
            </View>
        </View>
    );
}
