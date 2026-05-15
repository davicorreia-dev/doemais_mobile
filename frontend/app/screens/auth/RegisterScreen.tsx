import { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform, ScrollView, View, Alert, Text } from "react-native";
import Header from "../../../components/Header";
import Input from "../../../components/Input";
import Styles from "./RegisterStyles";
import Button from "../../../components/Button";
import { isValidName, isValidCPF, isValidPhone } from '../../utils/validators';
import { api } from '../../services/api';
import CheckboxInput from '../../../components/CheckboxInput';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório.").refine(isValidName, "Por favor, digite seu nome completo, sem números."),
    email: z.string().min(1, "O e-mail é obrigatório.").email("Verifique se o email foi digitado corretamente."),
    cpf: z.string().min(1, "O CPF é obrigatório.").refine(isValidCPF, "O CPF deve conter 11 dígitos numéricos."),
    phone: z.string().min(1, "O número de celular é obrigatório.").refine(isValidPhone, "Digite um número válido com DDD."),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
    confirmPassword: z.string().min(1, "A confirmação de senha é obrigatória.")
}).refine((data) => data.password === data.confirmPassword, {
    message: "A confirmação de senha não confere.",
    path: ["confirmPassword"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {

    const navigation = useNavigation<any>();

    const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            cpf: '',
            phone: '',
            password: '',
            confirmPassword: ''
        }
    });

    const [loading, setLoading] = useState(false);

    const onSubmit = (data: RegisterFormData) => {
        const payload = {
            nome: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            cpf: data.cpf.replace(/\D/g, ''),
            senha: data.password,
            telefone: data.phone ? data.phone.replace(/\D/g, '') : ''
        };

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
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Nome Completo*"
                                    placeholder="Digite seu nome"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.name?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="E-mail:*"
                                    placeholder="seu@email.com"
                                    keyboardType="email-address"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.email?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="cpf"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="CPF:*"
                                    placeholder="000.000.000-00"
                                    keyboardType="numeric"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.cpf?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="phone"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Número de celular (com DDD)"
                                    placeholder="(00) 00000-0000"
                                    keyboardType="numeric"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.phone?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Senha:*"
                                    placeholder="Mínimo 8 caracteres"
                                    secureTextEntry
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.password?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Confirmar Senha:*"
                                    placeholder="Repita a senha"
                                    secureTextEntry
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.confirmPassword?.message}
                                />
                            )}
                        />
                    </View>

                    {/* Removi o Checkbox daqui pois o aceite será na tela LgpdScreen */}

                    <View style={{ marginTop: 20, alignItems: 'center' }}>
                        <Button
                            title={loading ? "Carregando..." : "Continuar"}
                            textColor="#fff"
                            width={309}
                            borderRadius={10}
                            onPress={handleSubmit(onSubmit)}
                            disabled={loading}
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}