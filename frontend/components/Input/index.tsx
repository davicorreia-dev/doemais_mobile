import React, { useState } from "react";
import { TextInput, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
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
    error?: string;
};

export default function Input({ 
    placeholder, 
    value, 
    label, 
    secureTextEntry, 
    onChangeText, 
    keyboardType,
    autoCapitalize,
    error
}: InputProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View style={styles.containerInput}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <View style={[styles.inputContainer, error ? { borderColor: 'red', borderWidth: 1 } : null]}>
                <TextInput
                    keyboardType={keyboardType}
                    style={styles.inputStyle}
                    value={value}
                    placeholder={placeholder}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    onChangeText={onChangeText}
                    autoCapitalize={autoCapitalize}
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}