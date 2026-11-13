import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import styles from './styles';

type FeedbackModalProps = {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    variant?: 'error' | 'info';
};

export default function FeedbackModal({ visible, title, message, onClose, variant = 'error' }: FeedbackModalProps) {
    const color = variant === 'error' ? '#E0323C' : '#2E7D32';
    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.backdrop}>
                <View style={styles.card} accessibilityViewIsModal>
                    <Ionicons name={variant === 'error' ? 'alert-circle-outline' : 'information-circle-outline'} size={50} color={color} />
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onClose} accessibilityRole="button">
                        <Text style={styles.buttonText}>Entendi</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
