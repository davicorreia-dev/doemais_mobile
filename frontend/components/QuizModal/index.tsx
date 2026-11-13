import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

type QuizModalProps = {
    visible: boolean;
    title: string;
    message: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    actionLabel?: string;
    onAction?: () => void;
    onClose: () => void;
    children?: React.ReactNode;
};

export default function QuizModal({ visible, title, message, icon, iconColor, actionLabel, onAction, onClose, children }: QuizModalProps) {
    return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.backdrop}>
            <View style={styles.card} accessibilityViewIsModal>
                <Ionicons name={icon} size={60} color={iconColor} />
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
                {children}
                {actionLabel && <TouchableOpacity style={styles.action} onPress={onAction} accessibilityRole="button"><Text style={styles.actionText}>{actionLabel}</Text></TouchableOpacity>}
            </View>
        </View>
    </Modal>;
}
