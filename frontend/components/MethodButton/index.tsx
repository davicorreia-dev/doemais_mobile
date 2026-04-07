import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import Styles from "./styles";


type MethodButtonProps = {
    icon: string;
    label: string;
    onPress?: () => void;

}



export default function MethodButton({ icon, label, onPress }: MethodButtonProps) {


    return (
        <TouchableOpacity style={Styles.button} onPress={onPress}>
            <Ionicons name={icon as any}
                size={18}
                color="#E0323C"
                style={{ marginRight: 8 }}
            />
            <Text style={Styles.label}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}