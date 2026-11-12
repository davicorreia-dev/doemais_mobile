import { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../../components/Header';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Styles from './StylesNewPassword';
import { useKeyboardBehavior } from '../../hooks/useKeyboardBehavior';
import { api } from '../../services/api';

const passwordIsValid = (value: string) =>
    value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[@$!%*?&]/.test(value);

function tokenFromBrowserUrl(): string {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('token') || '';
}

export default function ResetPasswordScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const keyboardBehavior = useKeyboardBehavior();
    const token = useMemo(() => route.params?.token || tokenFromBrowserUrl(), [route.params]);
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!token) {
            setError('Este link de redefinição é inválido ou expirou.');
            return;
        }
        if (!passwordIsValid(password)) {
            setError('Use ao menos 8 caracteres, com maiúscula, minúscula, número e símbolo.');
            return;
        }
        if (password !== confirmation) {
            setError('As senhas devem corresponder.');
            return;
        }

        setError('');
        setLoading(true);
        try {
            await api('/api/auth/password-reset/confirm', 'POST', { token, senha: password });
            Alert.alert('Senha redefinida', 'Agora você já pode entrar com sua nova senha.', [
                { text: 'Ir para o login', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) },
            ]);
        } catch (requestError: any) {
            setError(requestError?.message || 'Não foi possível redefinir sua senha.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={Styles.container}>
            <Header icon="arrow-back-outline" title="Nova senha" titleColor="#E0323C" titleSize={24} onBack={() => navigation.navigate('Login')} />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={keyboardBehavior}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={Styles.content}>
                        <Text style={Styles.description}>Crie uma nova senha forte para acessar sua conta novamente.</Text>
                        <View style={Styles.inputContainer}>
                            <Input label="Nova senha" secureTextEntry value={password} onChangeText={setPassword} error={undefined} />
                            <View style={Styles.validationContainer}>
                                <Text style={Styles.validationText}>Mínimo de 8 caracteres, com maiúscula, minúscula, número e símbolo.</Text>
                            </View>
                            <Input label="Confirmar nova senha" secureTextEntry value={confirmation} onChangeText={setConfirmation} error={error} />
                        </View>
                        <View style={Styles.buttonContainer}>
                            <Button title={loading ? 'Redefinindo...' : 'Confirmar nova senha'} textColor="#fff" onPress={submit} disabled={loading} />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
