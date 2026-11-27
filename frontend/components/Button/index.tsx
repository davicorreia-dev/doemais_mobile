import { ActivityIndicator, Text, TouchableOpacity, DimensionValue, StyleProp, ViewStyle } from "react-native";
import styles from "./styles";
import { colors } from '../../theme/tokens';


//props dos botões
type ButtonProps = {
    title: string;
    backgroundColor?: string;
    textColor?: string;
    onPress?: () => void;
    borderRadius?: number;
    width?: DimensionValue;
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
};


export default function Button({ title, backgroundColor, textColor, onPress, borderRadius, width, disabled, loading, style}: ButtonProps) {
    const isDisabled = Boolean(disabled || loading);
    return (
        <TouchableOpacity onPress={onPress} disabled={isDisabled}
            accessibilityRole="button"
            accessibilityLabel={title}
            accessibilityState={{ disabled: isDisabled, busy: Boolean(loading) }}
            //props do button para passar em outras telas
            style={[
                styles.button,
                {
                    backgroundColor: backgroundColor || colors.primary,
                    borderRadius: borderRadius || styles.button.borderRadius,
                    width: width || styles.button.width,
                    opacity: isDisabled ? 0.5 : 1
                },
                style
            ]}>

            {loading ? <ActivityIndicator color={textColor || colors.surface} /> : <Text style={[styles.TextLogin, { color: textColor || styles.TextLogin.color || colors.surface }]}>{title}</Text>}
        </TouchableOpacity>
    )
}
