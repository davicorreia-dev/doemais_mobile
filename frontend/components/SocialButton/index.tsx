import { Text, TouchableOpacity, View, Image } from "react-native"
import styles from "./styles";

type SocialButtonProps = {
    title?: string;
    iconSource?: any;
    onPress?: () => void; 
}

export default function SocialButton({ 
    title,
    iconSource,
    onPress
}: SocialButtonProps) {

    if (!title) {
        return (
            <TouchableOpacity 
                style={[
                    styles.SocialButton, 
                    { 
                        width: 56, 
                        height: 56, 
                        borderRadius: 28, 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: '#FFFFFF',
                        elevation: 3,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                    }
                ]} 
                onPress={onPress}
            >
                {iconSource && (
                    <Image
                        source={iconSource}
                        style={{ width: 24, height: 24 }}
                        resizeMode="contain" 
                    />
                )}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={styles.SocialButton} onPress={onPress}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }}>
                {iconSource && (
                    <Image
                        source={iconSource}
                        style={{ width: 21, height: 21 }}
                        resizeMode="contain" />
                )}
                <Text style={styles.text}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}