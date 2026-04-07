import { Text, TouchableOpacity, View, Image } from "react-native"
import styles from "./styles";

type SocialButtonProps = {
    title: string;
    iconSource?: any;
    onPress?: () => void; 
}

export default function SocialButton({ 
    title,
    iconSource,
    onPress
}: SocialButtonProps) {

    return (
        <TouchableOpacity style={styles.SocialButton} onPress={onPress}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }}>
                {iconSource && (
                    <Image
                        source={iconSource}
                        style={{ width: 21, height: 21, }}
                        resizeMode="contain" />
                )}
                <Text style={styles.text}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}