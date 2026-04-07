import { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform, ScrollView, View, Alert } from "react-native";
import Header from "../../../components/Header";
import Input from "../../../components/Input";
import Styles from "./RegisterStyles";
import Button from "../../../components/Button";
import { isValidName, isValidEmail, isValidCPF, isValidPhone } from '../../utils/validators';





export default function RegisterScreen() {

    const navigation = useNavigation<any>();

    // Estados para armazenar os dados digitados
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleNext = () => {
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

        //Se passou por tudo, segue o baile!
        navigation.navigate("LgpdScreen", {
            basicData: {
                nome: name.trim(),
                email: email.trim().toLowerCase(),
                cpf: cpf.replace(/\D/g, ''),
                senha: password,
                telefone: phone ? phone.replace(/\D/g, '') : ''
            }
        });
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                
                <Header
                    icon="arrow-back-outline"
                    title="Criar uma conta"
                    titleColor="#E0323C"
                    subtitle="Insira os dados da sua conta "
                    subtitleColor="#000"
                    subtitleSize={20}
                    titleSize={24}
                    onBack={() => navigation.goBack()}
                />

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
                </View>

                {/* Removi o Checkbox daqui pois o aceite será na tela LgpdScreen */}

                <View style={{ marginTop: 40, alignItems: 'center', paddingBottom: 20 }}>
                    <Button
                        title="Continuar"
                        textColor="#fff"
                        width={309}
                        borderRadius={10}
                        onPress={handleNext}
                    />
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}