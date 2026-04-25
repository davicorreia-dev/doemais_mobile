import { Image, Text, View } from "react-native";
import Header from "../../../components/Header";
import Styles from "./ForgetPasswordStyles";
import { useNavigation } from "@react-navigation/native";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

export default function ForgetPasswordScreen() {
    const navigation = useNavigation<any>();

    return (
        <View>
            <Header
                onBack={() => navigation.navigate("LoginScreen")}
                title="Esqueceu sua senha"
                subtitle="Por favor, insira seu e-mail para redefinir a senha."
            />


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

        </View>
    )
}