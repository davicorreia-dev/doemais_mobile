import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Button from '../../../components/Button';
import Styles from './Styles';

export default function RegisterSuccessScreen() {
    const navigation = useNavigation<any>();

    const handleStart = () => {
        // Redireciona para o Login por enquanto
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }], 
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
                Entenda um pouco da missão da Doe+ antes de começar.
            </Text>

            <Button
                title="Começar"
                textColor="#FFFFFF"
                onPress={handleStart}
            />
        </View>
    );
}