import { useEffect } from 'react';
import { useNavigation, useRoute } from "@react-navigation/native";
import { KeyboardAvoidingView, ScrollView, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import Header from "../../../components/Header";
import Input from "../../../components/Input";
import Styles from "./RegisterStyles";
import { formColumn } from "../../utils/responsive";
import Button from "../../../components/Button";
import { isValidName, isValidCPF, isValidPhone } from '../../utils/validators';
import { RegisterFieldErrors } from '../../utils/registerErrors';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useKeyboardBehavior } from '../../hooks/useKeyboardBehavior';

// Regras espelhadas do RegisterDoadorDto do backend, para que nenhuma validação
// de servidor sobre estes campos só apareça no fim do fluxo de cadastro.
const registerSchema = z.object({
    name: z.string()
        .min(1, "O nome é obrigatório.")
        .min(3, "O nome deve ter no mínimo 3 caracteres.")
        .max(100, "O nome deve ter no máximo 100 caracteres.")
        .refine(isValidName, "Por favor, digite seu nome completo, sem números."),
    email: z.string()
        .min(1, "O e-mail é obrigatório.")
        .email("Verifique se o email foi digitado corretamente.")
        .max(100, "O e-mail deve ter no máximo 100 caracteres."),
    cpf: z.string().min(1, "O CPF é obrigatório.").refine(isValidCPF, "O CPF informado é inválido."),
    phone: z.string().min(1, "O número de celular é obrigatório.").refine(isValidPhone, "Digite um número válido com DDD."),
    password: z.string()
        .min(8, "A senha deve ter pelo menos 8 caracteres.")
        .max(128, "A senha deve ter no máximo 128 caracteres.")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "A senha deve conter: 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial (@$!%*?&)."),
    confirmPassword: z.string().min(1, "A confirmação de senha é obrigatória.")
}).refine((data) => data.password === data.confirmPassword, {
    message: "A confirmação de senha não confere.",
    path: ["confirmPassword"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Dados que voltam da CompleteProfileScreen quando o servidor recusa o cadastro
type RegisterRouteParams = {
    prefill?: {
        nome?: string;
        email?: string;
        cpf?: string;
        senha?: string;
        telefone?: string;
    };
    fieldErrors?: RegisterFieldErrors;
};

export default function RegisterScreen() {

    const navigation = useNavigation<any>();
    const route = useRoute();
    const keyboardBehavior = useKeyboardBehavior();

    const { prefill, fieldErrors } = (route.params as RegisterRouteParams | undefined) ?? {};

    const { control, handleSubmit, setError, reset, formState: { errors } } = useForm<RegisterFormData>({
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

    // O cadastro só é criado na última tela do fluxo. Quando o servidor recusa,
    // voltamos para cá com os dados preenchidos e o erro no campo que causou a recusa.
    useEffect(() => {
        if (!fieldErrors) return;

        if (prefill) {
            // reset() limpa os erros, então precisa vir antes do setError
            reset({
                name: prefill.nome ?? '',
                email: prefill.email ?? '',
                cpf: prefill.cpf ?? '',
                phone: prefill.telefone ?? '',
                password: prefill.senha ?? '',
                confirmPassword: prefill.senha ?? '',
            });
        }

        (Object.keys(fieldErrors) as (keyof RegisterFieldErrors)[]).forEach((field) => {
            const message = fieldErrors[field];
            if (message) {
                setError(field, { type: 'server', message });
            }
        });

        // Evita reaplicar os mesmos erros a cada re-render
        navigation.setParams({ prefill: undefined, fieldErrors: undefined });
    }, [fieldErrors, prefill, reset, setError, navigation]);


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
            <StatusBar style="light" />
            <Header
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


            <KeyboardAvoidingView style={{ flex: 1 }} behavior={keyboardBehavior}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={{ paddingHorizontal: 30, marginTop: 35 }}>
                        <Text style={Styles.HeaderTitle}>Crie sua conta</Text>
                        <Text style={Styles.HeaderSubtitle}>Vamos fazer o bem juntos.</Text>
                    </View>

                    <View style={Styles.InputContainer}>
                        <View style={[formColumn, { marginBottom: 4 }]}>
                            <Text style={Styles.requiredHint}>* Campos obrigatórios</Text>
                        </View>

                        {/* Campos adicionados para bater com o Backend */}
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Nome completo*"
                                    placeholder="Digite seu nome"
                                    autoCapitalize="words"
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
                                    label="E-mail*"
                                    placeholder="seu@email.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
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
                                    label="CPF*"
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
                                    label="Celular (com DDD)*"
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
                                    label="Senha*"
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
                                    label="Confirmar senha*"
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

                    <View style={[formColumn, { marginTop: 20 }]}>
                        <Button
                            title="Continuar"
                            textColor="#fff"
                            borderRadius={10}
                            onPress={handleSubmit(onSubmit)}
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}