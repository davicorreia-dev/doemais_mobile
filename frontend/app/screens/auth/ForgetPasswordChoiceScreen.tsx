import { Image, Text, View } from "react-native";
import Header from "../../../components/Header";
import Styles from "./ForgetPasswordChoiceStyles"
import { useNavigation } from "@react-navigation/native";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import MethodButton from "../../../components/MethodButton";

export default function ForgetPasswordChoiceScreen() {
    const navigation = useNavigation<any>();

    return (
        <View>
            <Header
                icon="arrow-back-outline"
                onBack={() => navigation.navigate("LoginScreen")}
                title="Esqueceu sua senha"
                subtitle="Escolha como você gostaria de receber o código de redefinição."
            />

            <View style={Styles.Container}>
                <MethodButton
                    icon="mail-outline"
                    label="E-mail"
                />
                <MethodButton
                    icon="call-outline"
                    label="Número de celular"
                />
            </View>


            <View style={{ marginTop: 50, alignItems: 'center' }}>
                <Button title="Avançar"
                    textColor="#fff"
                />
            </View>
        </View>
    )
}