import { useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { useNavigation, useRoute } from '@react-navigation/native';

import Button from '../../../components/Button';
import Styles from './StylesLgpd';
import { decodeRegistrationData, encodeRegistrationData } from '../../utils/registrationParams';

export default function LgpdScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute();

    const routeParams = (route.params as { basicData?: Record<string, string>; basicDataJson?: string } | undefined) ?? {};
    const basicData = decodeRegistrationData(routeParams.basicDataJson ?? routeParams.basicData);

    const [isChecked, setChecked] = useState(false);

    const handleContinue = () => {
        if (!isChecked) {
            Alert.alert("Atenção", "Você precisa concordar com a política de privacidade para continuar.");
            return;
        }

        navigation.navigate("CompleteProfileScreen", {
            basicDataJson: basicData ? encodeRegistrationData(basicData) : undefined,
        });
    };

    return (
        <ScrollView contentContainerStyle={Styles.container}>
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
                    accessibilityLabel="Aceitar política de privacidade"
                    accessibilityState={{ checked: isChecked }}
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
        </ScrollView>
    );
}
