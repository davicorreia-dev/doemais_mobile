import { Image, Text, View } from "react-native";
import Button from "../../../components/Button";
import Styles from "./AuthChoiceStyles"
import StylesButton from "../../../components/SocialButton/styles";
import { CommonActions } from "@react-navigation/native";
import SocialButton from "../../../components/SocialButton";

import { useFonts, Lexend_100Thin, Lexend_200ExtraLight, Lexend_300Light, Lexend_400Regular, Lexend_500Medium, Lexend_600SemiBold, Lexend_700Bold } from "@expo-google-fonts/lexend";
import { useRoute } from "@react-navigation/native";



export default function AuthChoiceScreen({ navigation }: any) {

    return (

        <View style={Styles.container}>

            <Image style={Styles.image} source={require("../../../assets/images/Logo - Horizontal.png")} />


            {/* props de cada button de login e register*/}
            <Button
                title="Faça seu Login"
                backgroundColor="#FFFFFF"
                textColor="#E0323C"
                onPress={() => navigation.navigate("Login")}

            />


            {/* <Button
                title="Faça seu Login"
                backgroundColor="#FFFFFF"
                textColor="#E0323C"
                onPress={() => navigation.navigate("MainTabs")}

            /> */}


            <Button
                title="Cadastre-se"
                backgroundColor="#E0323C"
                textColor="#FFFFFF"
                onPress={() => navigation.navigate("Register")}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 25 }}>
                <SocialButton
                    iconSource={require("../../../assets/images/googleicon.png")}
                />

                <SocialButton
                    iconSource={require("../../../assets/images/facebook 1.png")}
                />
            </View>

        </View>
    )
}