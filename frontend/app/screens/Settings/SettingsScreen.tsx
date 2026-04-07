import { View } from 'react-native';

import Button from '../../../components/Button';


export default function SettingsSCreen({ navigation }: any) {
    return (
        <View >
            <Button
                title="Faça seu Login"
                backgroundColor="#FFFFFF"
                textColor="#E0323C"
                onPress={() => navigation.navigate("Login")}

            />
        </View>
    )
}