import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Button from '../../../components/Button';
import Styles from './StylesPasswordResetSucess';

export default function PasswordResetSuccessScreen() {
    const navigation = useNavigation<any>();

    const handleGoToLogin = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <View style={Styles.container}>
            <View style={Styles.card}>

                <View style={Styles.iconContainer}>
                    <Ionicons name="checkmark-circle" size={80} color="#00C247" />
                </View>

                <Text style={Styles.title}>Senha redefinida com sucesso!</Text>

                <Text style={Styles.subtitle}>
                    Sua senha foi redefinida com sucesso. Agora você já pode acessar sua conta.
                </Text>

                <Button
                    title="Ir Para Login"
                    textColor="#FFFFFF"
                    onPress={handleGoToLogin}
                />
            </View>
        </View>
    );
}