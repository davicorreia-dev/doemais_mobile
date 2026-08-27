import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { useFonts, Lexend_100Thin, Lexend_200ExtraLight, Lexend_300Light, Lexend_400Regular, Lexend_500Medium, Lexend_600SemiBold, Lexend_700Bold } from "@expo-google-fonts/lexend";
import { Ionicons } from "@expo/vector-icons";
import { barHeight, clamp, headerHeight, topInset } from "../../app/utils/responsive";

//props do header
type HeaderProps = {
    marginTop?: number;
    title?: string;
    subtitle?: string;
    onBack?(): void;
    titleColor?: string;
    subtitleColor?: string;
    titleSize?: number;
    subtitleSize?: number;
    icon?: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    minHeight?: number;
    containerStyle?: any;
}


export default function Header({ title, onBack, subtitle, titleColor, subtitleColor, titleSize, icon, iconColor, subtitleSize, marginTop, minHeight, containerStyle }: HeaderProps) {

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

    // Responsividade: a barra acompanha o tamanho da tela e a área do sistema (notch/status bar)
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const safeTop = topInset(insets.top);

    // Sem título/subtítulo é a faixa vermelha simples; com texto vira o header alto
    const isBarOnly = !title && !subtitle;
    const contentHeight = minHeight ?? (isBarOnly ? barHeight(height) : headerHeight(height));
    const iconSize = clamp(width * 0.065, 22, 30);

    return (
        <View
            style={[
                styles.header,
                {
                    // a faixa cresce por trás da status bar em vez de usar margem fixa
                    paddingTop: safeTop + (marginTop ?? 0),
                    minHeight: safeTop + contentHeight,
                    paddingHorizontal: clamp(width * 0.03, 10, 24),
                },
                containerStyle,
            ]}
        >
            <TouchableOpacity onPress={() => {
                if (onBack) {
                    onBack();
                } else if (navigation.canGoBack()) {
                    navigation.goBack();
                }
            }}
                style={styles.iconBack}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >

                <Ionicons
                    name={icon || "arrow-back"}
                    size={iconSize}
                    color={iconColor || "#E0323C"}
                />
            </TouchableOpacity>

            {!isBarOnly && (
                <View style={styles.textContainer}>
                    <Text

                        // Props das cores do titulo 
                        style={[
                            styles.title,
                            {
                                color: titleColor || styles.title.color,
                                fontSize: titleSize || clamp(width * 0.055, 18, 26),
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
                                fontSize: subtitleSize || clamp(width * 0.04, 14, 18),
                            },
                        ]}
                    >
                        {subtitle}
                    </Text>
                </View>
            )}


        </View>

    );
}
