import { Image, Platform, ScrollView, Text, View, Alert, KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Lexend_100Thin, Lexend_200ExtraLight, Lexend_300Light, Lexend_400Regular, Lexend_500Medium, Lexend_600SemiBold, Lexend_700Bold } from "@expo-google-fonts/lexend";

// Seus componentes
import Header from "../../../components/Header";
import Input from "../../../components/Input";
import Styles from "./stylesLogin";
import SocialButton from "../../../components/SocialButton";
import Button from "../../../components/Button";

// Nossa API
import { api } from "../../services/api";

export default function LoginScreen() {
    const navigation = useNavigation<any>();

    // 1. ADICIONADO: States para controlar os inputs e o carregamento
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

    // 2. ADICIONADO: A Função que faz o Login acontecer
    const handleLogin = async () => {
        // Validação básica
        if (!email || !password) {
            Alert.alert('Atenção', 'Por favor, preencha e-mail e senha.');
            return;
        }

        setLoading(true);

        try {
            console.log("Tentando logar com:", email);

            // Chama a API (/api/auth/login)
            const response = await api('/api/auth/login', 'POST', {
                email: email.toLowerCase().trim(),
                senha: password
            });

            console.log("Login OK:", response);

            // Se recebeu o token, salva e entra
            if (response.token) {
                await AsyncStorage.setItem('@doemais:token', response.token);
                await AsyncStorage.setItem('@doemais:user', JSON.stringify(response.user || response.doador));

                // Redireciona para o Quiz (Home)
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                });
            } else {
                throw new Error("Token não recebido.");
            }

        } catch (error: any) {
            console.error("Erro Login:", error);
            // Mensagem amigável se for erro de senha
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
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                <Header
                    icon="arrow-back-outline"
                    titleSize={20}
                    title="Seja bem-vindo(a)! Sua solidariedade pode salvar vidas."
                    onBack={() => navigation.goBack()} // Adicionei ação de voltar
                />

                <View>
                    <View style={Styles.inputcontainer}>
                        {/* 3. CONECTADO: Input de E-mail */}
                        <Input
                            label="E-mail:"
                            keyboardType="email-address"
                            value={email}            // O valor vem do estado
                            onChangeText={setEmail}  // Ao digitar, atualiza o estado
                            autoCapitalize="none"
                        />

                        {/* 4. CONECTADO: Input de Senha */}
                        <Input
                            label="Senha:"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
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

                        {/* 5. CONECTADO: O Botão agora chama o handleLogin */}
                        <Button
                            title={loading ? "Entrando..." : "Entrar"}
                            textColor="white"
                            borderRadius={10}
                            width={270}
                            onPress={handleLogin} // <--- AQUI ESTAVA FALTANDO!
                            disabled={loading}    // Evita clique duplo
                        />
                    </View>

                    <View style={Styles.containerRegister}>
                        <Text style={Styles.registerText}>
                            Não tem uma conta ainda?{" "}
                            <Text
                                style={Styles.RegisterUnderline}
                                onPress={() => navigation.navigate("RegisterScreen")} // Confirme se o nome da rota é esse no App.tsx
                            >
                                Cadastre-se.
                            </Text>
                        </Text>
                    </View>
                </View >
            </ScrollView>
        </KeyboardAvoidingView>
    )
}