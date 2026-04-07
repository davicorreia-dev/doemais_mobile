import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { useFonts, Lexend_100Thin, Lexend_200ExtraLight, Lexend_300Light, Lexend_400Regular, Lexend_500Medium, Lexend_600SemiBold, Lexend_700Bold } from "@expo-google-fonts/lexend";
import { Ionicons } from "@expo/vector-icons";

//props do header
type HeaderProps = {
    title?: string;
    subtitle?: string;
    onBack?(): void;
    titleColor?: string;
    subtitleColor?: string;
    titleSize?: number;
    subtitleSize?: number;
    icon?: string;

}


export default function Header({ title, onBack, subtitle, titleColor, subtitleColor, titleSize, icon, subtitleSize }: HeaderProps) {

    const [fontsLoaded] = useFonts({
        Lexend_100Thin,
        Lexend_200ExtraLight,
        Lexend_300Light,
        Lexend_400Regular,
        Lexend_500Medium,
        Lexend_600SemiBold,
        Lexend_700Bold,
    });



    const navigation = useNavigation<any>();

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}
                style={styles.iconBack}
            >

                <Ionicons
                    name={icon}
                    size={24}
                    color="#E0323C"
                />
            </TouchableOpacity>

            <View style={styles.textContainer}>
                <Text

                    // Props das cores do titulo 
                    style={[
                        styles.title,
                        {
                            color: titleColor || styles.title.color,
                            fontSize: titleSize || styles.title.fontSize,
                        },
                    ]}
                >
                    {title}
                </Text>

                {/* Props de cores dos subtitulo */}
                <Text
                    style={[
                        styles.subtitle,
                        {
                            color: subtitleColor || styles.subtitle.color,
                            fontSize: subtitleSize || styles.subtitle.fontSize,
                        },
                    ]}
                >
                    {subtitle}
                </Text>
            </View>


        </View>

    );
}

