import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import { Text, View } from 'react-native';
import Styles from './styles';

export default function CheckboxInput() {
    const [isChecked, setChecked] = useState(false);

    return (
        <View style={Styles.ContainerCheck}>
            <Checkbox
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? '#E3464F' : undefined}
            />
            <Text style={Styles.paragraph}>Concordo com os<Text style={{ color: '#E3464F' }}> Termos de uso do {"\n"}
                aplicativo e Política de privacidade </Text></Text>

        </View>
    );
}
