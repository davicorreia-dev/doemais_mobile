import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Button from '../../../components/Button';
import Styles from './StylesResgisterSucess';

export default function RegisterSuccessScreen() {
    const navigation = useNavigation<any>();

    const handleStart = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'PostRegisterOnboarding' }],
        });
    };

    return (
        <View style={Styles.container}>
            <View style={Styles.iconContainer}>
                <Ionicons name="heart" size={60} color="#fff" />
            </View>

            <Text style={Styles.title}>Conta criada com sucesso!</Text>

            <Text style={Styles.subtitle}>
                Obrigado por se cadastrar no Doe+. Sua atitude já é o primeiro passo para salvar vidas.{'\n\n'}
                Antes de entrar, conheça os próximos passos para preencher sua triagem e acessar sua carteirinha.
            </Text>

            <Button
                title="Ver como funciona"
                textColor="#FFFFFF"
                onPress={handleStart}
            />
        </View>
    );
}
