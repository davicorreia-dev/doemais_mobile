import { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from '../../../components/Header';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Styles from './StylesNewPassword';
import { useKeyboardBehavior } from '../../hooks/useKeyboardBehavior';

export default function NewPasswordScreen() {
    const navigation = useNavigation<any>();
    const keyboardBehavior = useKeyboardBehavior();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleConfirm = () => {
        // Validação simples (ainda falta coisa aqui)
        if (newPassword.length < 8) {
            Alert.alert("Atenção", "A senha deve ter no mínimo 8 caracteres.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Erro", "As senhas não correspondem.");
            return;
        }

        navigation.navigate("PasswordResetSuccessScreen" as never);
    };

    return (
        <View style={Styles.container}>
            <Header
                icon="arrow-back-outline"
                title="Nova Senha"
                titleColor="#E0323C"
                titleSize={24}
                onBack={() => navigation.goBack()}
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={keyboardBehavior}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                <View style={Styles.content}>
                    <Text style={Styles.description}>
                        Defina uma nova senha{'\n\n'}
                        Crie uma nova senha. Certifique-se de que seja diferente das anteriores para garantir a segurança.
                    </Text>

                    <View style={Styles.inputContainer}>
                        <Input
                            label="Senha*"
                            placeholder=""
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />

                        {/* Lista de Requisitos (Visual conforme Figma) */}
                        <View style={Styles.validationContainer}>
                            <Text style={Styles.validationText}>Sua senha deve conter pelo menos 1 letra maiúscula.</Text>
                            <Text style={Styles.validationText}>Sua senha deve conter pelo menos 1 letra minúscula.</Text>
                            <Text style={Styles.validationText}>Sua senha deve conter pelo menos 1 número.</Text>
                            <Text style={Styles.validationText}>Sua senha deve ter no mínimo 8 caracteres.</Text>
                        </View>

                        <Input
                            label="Confirmar senha*"
                            placeholder=""
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        {newPassword !== confirmPassword && confirmPassword.length > 0 && (
                            <Text style={Styles.errorText}>As senhas devem corresponder.</Text>
                        )}
                    </View>

                    <View style={Styles.buttonContainer}>
                        <Button
                            title="Confirmar"
                            textColor="#FFFFFF"
                            onPress={handleConfirm}
                        />
                    </View>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}