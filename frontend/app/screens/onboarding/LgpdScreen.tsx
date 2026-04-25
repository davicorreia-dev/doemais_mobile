import { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { useNavigation, useRoute } from '@react-navigation/native';

import Button from '../../../components/Button';
import Styles from './StylesLgpd';

export default function LgpdScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute();

    const { basicData } = (route.params as any) || {};

    const [isChecked, setChecked] = useState(false);

    const handleContinue = () => {
        if (!isChecked) {
            Alert.alert("Atenção", "Você precisa concordar com a política de privacidade para continuar.");
            return;
        }

        navigation.navigate("CompleteProfileScreen", {
            basicData: basicData
        });
    };

    return (
        <View style={Styles.container}>
            <View style={Styles.iconContainer}>
                <Ionicons name="lock-closed" size={50} color="#fff" />
            </View>

            <Text style={Styles.title}>Proteção de Dados{'\n'}LGPD</Text>

            <Text style={Styles.subtitle}>
                Seus dados pessoais serão usados apenas para o processo de doação de sangue.
                Você tem o direito de acessar, corrigir ou solicitar a exclusão das suas informações a qualquer momento.
            </Text>

            <View style={Styles.checkboxContainer}>
                <Checkbox
                    value={isChecked}
                    onValueChange={setChecked}
                    color={isChecked ? '#E0323C' : undefined}
                />
                <Text style={Styles.checkboxText}>
                    Li e concordo com a <Text style={Styles.linkText}>política de privacidade.</Text>
                </Text>
            </View>

            <Button
                title="Continuar"
                textColor="#fff"
                onPress={handleContinue}
            />
        </View>
    );
}