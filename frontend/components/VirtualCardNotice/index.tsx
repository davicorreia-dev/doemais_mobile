import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import styles from './styles';

type VirtualCardNoticeProps = { underReview: boolean; desktop?: boolean; formName?: string; requestedAt?: string };

export default function VirtualCardNotice({ underReview, desktop, formName, requestedAt }: VirtualCardNoticeProps) {
    const text = underReview
        ? `O reteste${formName ? ` de ${formName}` : ''} foi solicitado${requestedAt ? ` em ${requestedAt}` : ''}. Aguarde a revisão do hemocentro antes de usar esta carteirinha.`
        : 'Esta carteirinha registra a aprovação no questionário de triagem e não substitui a avaliação presencial do hemocentro.';
    return <View style={[styles.notice, desktop && styles.noticeDesktop]}><Ionicons name="information-circle-outline" size={21} color="#A12C34" /><Text style={styles.noticeText}>{text}</Text></View>;
}
