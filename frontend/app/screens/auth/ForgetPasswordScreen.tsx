import { useState } from "react";
import { Image, Text, View, KeyboardAvoidingView, ScrollView } from "react-native";
import Header from "../../../components/Header";
import Styles from "./ForgetPasswordStyles";
import { useNavigation } from "@react-navigation/native";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useKeyboardBehavior } from '../../hooks/useKeyboardBehavior';
import { formColumn } from '../../utils/responsive';
import { api } from '../../services/api';
import { isValidEmail } from '../../utils/validators';

export default function ForgetPasswordScreen() {
    const navigation = useNavigation<any>();
    const keyboardBehavior = useKeyboardBehavior();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async () => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!isValidEmail(normalizedEmail)) {
            setError('Informe um e-mail válido.');
            return;
        }

        setError('');
        setLoading(true);
        try {
            await api('/api/auth/password-reset/request', 'POST', { email: normalizedEmail });
            setSent(true);
        } catch {
            setError('Não foi possível solicitar a redefinição. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Header
                onBack={() => navigation.navigate("Login")}
                title="Esqueceu sua senha"
                subtitle="Por favor, insira seu e-mail para redefinir a senha."
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={keyboardBehavior}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={Styles.InputContainer}>
                        <Image style={Styles.image}
                            source={require("../../../assets/images/Logo - Horizontal.png")}
                        />

                        {sent ? (
                            <View style={Styles.confirmation} accessibilityLiveRegion="polite">
                                <Text style={Styles.confirmationTitle}>Confira seu e-mail</Text>
                                <Text style={Styles.confirmationText}>
                                    Se houver uma conta associada a este e-mail, enviaremos as instruções para redefinir sua senha.
                                </Text>
                                <View style={formColumn}>
                                    <Button title="Voltar ao login" textColor="#fff" onPress={() => navigation.navigate('Login')} />
                                </View>
                            </View>
                        ) : (
                            <>
                                <Input
                                    label="E-mail"
                                    value={email}
                                    onChangeText={(value) => { setEmail(value); if (error) setError(''); }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    error={error}
                                />

                                <View style={formColumn}>
                                    <Button
                                        title={loading ? "Enviando..." : "Redefinir senha"}
                                        textColor="#fff"
                                        onPress={handleSubmit}
                                        disabled={loading}
                                    />
                                </View>
                            </>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}
