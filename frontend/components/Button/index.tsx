import { Text, TouchableOpacity, DimensionValue, StyleProp, ViewStyle } from "react-native";
import styles from "./styles";


//props dos botões
type ButtonProps = {
    title: string;
    backgroundColor?: string;
    textColor?: string;
    onPress?: () => void;
    borderRadius?: number;
    width?: DimensionValue;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
};


export default function Button({ title, backgroundColor, textColor, onPress, borderRadius, width, disabled, style}: ButtonProps) {
    return (
        <TouchableOpacity onPress={onPress} disabled={disabled}
            //props do button para passar em outras telas
            style={[
                styles.button,
                {
                    backgroundColor: backgroundColor || styles.button.backgroundColor,
                    borderRadius: borderRadius || styles.button.borderRadius,
                    width: width || styles.button.width,
                    opacity: disabled ? 0.5 : 1 
                },
                style
            ]}>

            <Text style={[styles.TextLogin, { color: textColor || styles.TextLogin.color }]}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}