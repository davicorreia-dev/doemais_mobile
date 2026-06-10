import { Image, Platform, ScrollView, Text, View, Alert, KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Lexend_100Thin, Lexend_200ExtraLight, Lexend_300Light, Lexend_400Regular, Lexend_500Medium, Lexend_600SemiBold, Lexend_700Bold } from "@expo-google-fonts/lexend";

import Header from "../../../components/Header";
import Input from "../../../components/Input";
import Styles from "./stylesLogin";
import SocialButton from "../../../components/SocialButton";
import Button from "../../../components/Button";

import { api } from "../../services/api";
import { StatusBar } from "expo-status-bar";
import z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
    email: z.string().min(1, "O e-mail é obrigatório.").email("E-mail inválido"),
    password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres")
});

type LoginFormData = z.infer<typeof loginSchema>;

const loginResponseSchema = z.object({
    accessToken: z.string().min(15, "Token não retornado pelo servidor"),
    refreshToken: z.string().optional(),
    doador: z.object({
        id: z.string().or(z.number()),
        nome: z.string(),
        email: z.string().email(),
        genero: z.string().nullable().optional(), // Mantido da branch para leitura futura
    })
});

export default function LoginScreen() {
    const navigation = useNavigation<any>();

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const [loading, setLoading] = useState(false);

    const [fontsLoaded] = useFonts({
        Lexend_100Thin,
        Lexend_200ExtraLight,
        Lexend_300Light,
        Lexend_400Regular,
        Lexend_500Medium,
        Lexend_600SemiBold,
        Lexend_700Bold,
    });

    const onSubmit = async (data: LoginFormData) => {
        const payload = {
            email: data.email.trim().toLowerCase(),
            senha: data.password
        }

        setLoading(true);

        try {
            console.log("Tentando logar com:", payload);

            const response = await api('/api/auth/login', 'POST', payload);
            const responseData = response.data || response;
            const parsedResponse = loginResponseSchema.parse(responseData);

            if (parsedResponse.accessToken) {
                await AsyncStorage.setItem('@doemais:token', parsedResponse.accessToken);
                await AsyncStorage.setItem('@doemais:user', JSON.stringify(parsedResponse.doador));
                if (parsedResponse.refreshToken) {
                    await AsyncStorage.setItem('@doemais:refreshToken', parsedResponse.refreshToken);
                }

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                });
            } else {
                throw new Error("Token não recebido.");
            }

        } catch (error: any) {
            console.error("Erro Login:", error);
            const msg = error.message.includes('401') || error.message.includes('404')
                ? 'E-mail ou senha incorretos.'
                : error.message;
            Alert.alert('Falha no Login', msg);
        } finally {
            setLoading(false);
        }
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar backgroundColor="#E0323C" style="light" />
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
                    <View>
                        <Text style={Styles.TitleContainer}>
                            Seja bem-vindo(a)! Sua solidariedade pode salvar vidas.
                        </Text>

                        <View style={Styles.inputcontainer}>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="E-mail:"
                                        keyboardType="email-address"
                                        value={value}
                                        onChangeText={onChange}
                                        autoCapitalize="none"
                                        error={errors.email?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Senha:"
                                        value={value}
                                        onChangeText={onChange}
                                        secureTextEntry
                                        error={errors.password?.message}
                                    />
                                )}
                            />

                            <Text style={Styles.ForgetPassword}
                                onPress={() => navigation.navigate("ForgetPasswordChoiceScreen")}> Esqueceu sua senha? </Text>
                        </View>

                        <View style={Styles.SocialbuttonsContainer}>
                            <SocialButton
                                title="Entrar com o Google"
                                iconSource={require("../../../assets/images/googleicon.png")}
                                onPress={() => Alert.alert("Em breve", "Login social ainda não configurado.")}
                            />

                            <SocialButton
                                title="Entrar com o Facebook"
                                iconSource={require("../../../assets/images/facebook 1.png")}
                                onPress={() => Alert.alert("Em breve", "Login social ainda não configurado.")}
                            />

                            <Button
                                title={loading ? "Entrando..." : "Entrar"}
                                textColor="white"
                                borderRadius={10}
                                width={270}
                                onPress={handleSubmit(onSubmit)}
                                disabled={loading}
                            />
                        </View>

                        <View style={Styles.containerRegister}>
                            <Text style={Styles.registerText}>
                                Não tem uma conta ainda?{" "}
                                <Text
                                    style={Styles.RegisterUnderline}
                                    onPress={() => navigation.navigate("Register")} 
                                >
                                    Cadastre-se.
                                </Text>
                            </Text>
                        </View>
                    </View >
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}