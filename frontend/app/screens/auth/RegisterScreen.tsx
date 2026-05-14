import { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform, ScrollView, View, Alert, Text } from "react-native";
import Header from "../../../components/Header";
import Input from "../../../components/Input";
import Styles from "./RegisterStyles";
import Button from "../../../components/Button";
import { isValidName, isValidEmail, isValidCPF, isValidPhone } from '../../utils/validators';
import { api } from '../../services/api';
import CheckboxInput from '../../../components/CheckboxInput';

export default function RegisterScreen() {

    const navigation = useNavigation<any>();

    // Estados para armazenar os dados digitados
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);



    const handleNext = async () => {
        //Campos Vazios
        if (!name || !email || !cpf || !password || !confirmPassword) {
            Alert.alert("Campos Obrigatórios", "Por favor, preencha todos os campos marcados com *.");
            return;
        }

        //Nome Completo
        if (!isValidName(name)) {
            Alert.alert("Nome Inválido", "Por favor, digite seu nome completo (Nome e Sobrenome), sem números.");
            return;
        }

        //Email
        if (!isValidEmail(email)) {
            Alert.alert("Email Inválido", "Verifique se o email foi digitado corretamente.");
            return;
        }

        //CPF
        if (!isValidCPF(cpf)) {
            Alert.alert("CPF Inválido", "O CPF deve conter 11 dígitos numéricos.");
            return;
        }

        //Telefone
        if (phone && !isValidPhone(phone)) {
            Alert.alert("Telefone Inválido", "Digite um número válido com DDD.");
            return;
        }

        //Senhas
        if (password.length < 6) {
            Alert.alert("Senha Fraca", "A senha deve ter pelo menos 8 caracteres.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Senhas Diferentes", "A confirmação de senha não confere.");
            return;
        }

        if (!isTermsAccepted) {
            Alert.alert("Termos não aceitos", "Você deve aceitar os termos para se cadastrar.");
            return;
        }

        // Se passou por tudo, prepara os dados
        const payload = {
            nome: name.trim(),
            email: email.trim().toLowerCase(),
            cpf: cpf.replace(/\D/g, ''),
            senha: password,
            telefone: phone ? phone.replace(/\D/g, '') : ''
        };

        // Navegamos para a próxima tela do fluxo passando os dados
        navigation.navigate("LgpdScreen", {
            basicData: payload
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Header
                marginTop={30}
                minHeight={50}
                icon="arrow-back-outline"
                iconColor="#FFF"
                onBack={() => {
                    if (navigation.canGoBack()) {
                        navigation.goBack();
                    } else {
                        navigation.navigate("AuthChoice");
                    }
                }}
                containerStyle={{ backgroundColor: '#E0323C' }}
            />


            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>


                    <Text style={Styles.TitleContainer}>
                        Seja bem-vindo(a)! Vamos fazer o bem juntos.
                    </Text>

                    <View style={Styles.InputContainer}>
                        {/* Campos adicionados para bater com o Backend */}
                        <Input
                            label="Nome Completo*"
                            placeholder="Digite seu nome"
                            value={name}
                            onChangeText={setName}
                        />

                        <Input
                            label="E-mail:*"
                            placeholder="seu@email.com"
                            keyboardType="email-address"
                            // autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <Input
                            label="CPF:*"
                            placeholder="000.000.000-00"
                            keyboardType="numeric"
                            value={cpf}
                            onChangeText={setCpf}
                        />

                        <Input
                            label="Número de celular (com DDD)"
                            placeholder="(00) 00000-0000"
                            keyboardType="numeric"
                            value={phone}
                            onChangeText={setPhone}
                        />

                        <Input
                            label="Senha:*"
                            placeholder="Mínimo 8 caracteres"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />



                        <Input
                            label="Confirmar Senha:*"
                            placeholder="Repita a senha"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <CheckboxInput
                            checked={isTermsAccepted}
                            onPress={setIsTermsAccepted}
                            style={Styles.checkbox}
                        />
                    </View>

                    {/* Removi o Checkbox daqui pois o aceite será na tela LgpdScreen */}

                    <View style={{ marginTop: 20, alignItems: 'center' }}>
                        <Button
                            title={loading ? "Carregando..." : "Continuar"}
                            textColor="#fff"
                            width={309}
                            borderRadius={10}
                            onPress={handleNext}
                            disabled={loading}
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}