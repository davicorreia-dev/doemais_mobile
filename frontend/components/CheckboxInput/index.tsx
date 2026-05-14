import Checkbox from 'expo-checkbox';
import { Text, View } from 'react-native';
import Styles from './styles';

interface CheckboxInputProps {
    label?: string;
    checked: boolean;
    onPress: (value: boolean) => void; // ✅ recebe o boolean do onValueChange
    style?: object;
}

export default function CheckboxInput({ label, checked, onPress, style }: CheckboxInputProps) {
    return (
        <View style={[Styles.ContainerCheck, style]}>
            <Checkbox
                value={checked}
                onValueChange={onPress}
                color={checked ? '#E3464F' : undefined}
            />
            <Text style={Styles.paragraph}>
                Concordo com os
                <Text style={{ color: '#E3464F' }}>
                    {' '}Termos de uso do {'\n'}aplicativo e Política de privacidade
                </Text>
            </Text>
        </View>
    );
}