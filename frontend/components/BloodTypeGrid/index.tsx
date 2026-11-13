import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

type BloodTypeGridProps = {
    bloodTypes: string[];
    selected?: string | null;
    onSelect?: (type: string) => void;
    variant?: 'home' | 'form';
};

export default function BloodTypeGrid({ bloodTypes, selected, onSelect, variant = 'home' }: BloodTypeGridProps) {
    return <View style={[styles.grid, variant === 'form' && styles.formGrid]}>{bloodTypes.map((type) => {
        const active = selected === type;
        return <TouchableOpacity key={type} style={[styles.button, variant === 'form' && styles.formButton, active && styles.buttonActive]} onPress={() => onSelect?.(type)} disabled={!onSelect} accessibilityRole={onSelect ? 'button' : undefined} accessibilityState={{ selected: active }}>
            <Text style={[styles.text, variant === 'form' && styles.formText, active && styles.textActive]}>{type}</Text>
        </TouchableOpacity>;
    })}</View>;
}
