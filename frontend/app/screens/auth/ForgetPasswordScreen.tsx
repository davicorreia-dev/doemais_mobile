import { Image, Text, View, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import Header from "../../../components/Header";
import Styles from "./ForgetPasswordStyles";
import { useNavigation } from "@react-navigation/native";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useKeyboardBehavior } from '../../hooks/useKeyboardBehavior';

export default function ForgetPasswordScreen() {
    const navigation = useNavigation<any>();
    const keyboardBehavior = useKeyboardBehavior();

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Header
                onBack={() => navigation.navigate("LoginScreen")}
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

                        <Input
                            label="E-mail"
                        />

                        <Button title="Redefinir senha"
                            textColor="#ffff" />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}