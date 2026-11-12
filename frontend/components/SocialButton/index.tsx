import { Text, TouchableOpacity, View, Image } from "react-native"
import styles from "./styles";

type SocialButtonProps = {
    title?: string;
    iconSource?: any;
    onPress?: () => void; 
    accessibilityLabel?: string;
}

export default function SocialButton({ 
    title,
    iconSource,
    onPress,
    accessibilityLabel,
}: SocialButtonProps) {

    if (!title) {
        return (
            <TouchableOpacity 
                style={styles.iconButton}
                onPress={onPress}
                accessibilityRole="button"
                accessibilityLabel={accessibilityLabel}
            >
                {iconSource && (
                    <Image
                        source={iconSource}
                        style={styles.iconImage}
                        resizeMode="contain" 
                    />
                )}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={styles.SocialButton} onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel || title}>
            <View style={styles.content}>
                {iconSource && (
                    <Image
                        source={iconSource}
                        style={styles.buttonIcon}
                        resizeMode="contain" />
                )}
                <Text style={styles.text}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}
