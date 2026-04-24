import { TextInput, Text, View } from "react-native";
import type { KeyboardTypeOptions } from "react-native";
import styles from "./styles";

type InputProps = {
    placeholder?: string;
    value?: string;
    label?: string;
    secureTextEntry?: boolean;
    onChangeText?: (text: string) => void;
    keyboardType?: KeyboardTypeOptions;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'; 
};

export default function Input({ 
    placeholder, 
    value, 
    label, 
    secureTextEntry, 
    onChangeText, 
    keyboardType,
    autoCapitalize
}: InputProps) {

    return (
        <View style={styles.containerInput}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <TextInput
                keyboardType={keyboardType}
                style={styles.Input}
                value={value}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                onChangeText={onChangeText}
                autoCapitalize={autoCapitalize}
            />
        </View>
    );
}