import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Header from '../../../components/Header';
import Styles from './Styles';
import Input from '../../../components/Input';
import SelectInput from '../../../components/SelectInput/SelectInput';
import Button from '../../../components/Button';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsProfileScreen() {

    const navigation = useNavigation<any>();
    const [value, setValue] = useState(''); // blood type
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [city, setCity] = useState('');

    useEffect(() => {
        async function loadProfileData() {
            try {
                const savedData = await AsyncStorage.getItem('@user_profile_data');
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    setName(parsedData.name || '');
                    setPhone(parsedData.phone || '');
                    setValue(parsedData.bloodType || '');
                    setCity(parsedData.city || '');
                }
            } catch (error) {
                console.error("Erro ao carregar dados do perfil", error);
            }
        }
        loadProfileData();
    }, []);

    const handlePhoneChange = (text: string) => {
        let v = text.replace(/\D/g, '');
        v = v.substring(0, 11);

        if (v.length > 2) {
            v = `(${v.substring(0, 2)}) ${v.substring(2)}`;
        }
        if (v.length > 9) {
            v = `${v.substring(0, 10)}-${v.substring(10)}`;
        }
        setPhone(v);
    };

    const handleSubmit = async () => {
        const payload = {
            name,
            phone,
            bloodType: value,
            city
        };

        console.log('Dados prontos para salvar localmente:', payload);

        try {
            // Salva os dados no AsyncStorage
            await AsyncStorage.setItem('@user_profile_data', JSON.stringify(payload));

            // Depois do envio/salvamento correto, navega para a próxima tela:
            navigation.navigate('ProfileSetupPhotoScreen');

        } catch (error) {
            console.error("Erro ao salvar os dados", error);
            Alert.alert("Erro", "Não foi possível salvar os dados do perfil.");
        }
    };

    const BLOOD_TYPES = [
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' },
    ];

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>

            <Header
                marginTop={30}
                minHeight={50}
                icon="arrow-back-outline"
                iconColor="#FFF"
                containerStyle={{ backgroundColor: '#E0323C' }}
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={{ flex: 1, backgroundColor: '#FDFCFC' }}>
                    <ScrollView
                        contentContainerStyle={{ padding: 20 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >

                        <Text style={Styles.title}>Configuração do perfil</Text>

                        <Text style={Styles.subtitle}>
                            Quase pronto para configurar seu perfil, preencha as informações abaixo.
                            Apenas 3 etapas.
                        </Text>

                        <View style={Styles.containerInputs}>
                            <Input
                                label="Nome Completo"
                                value={name}
                                onChangeText={setName}
                            />

                            <Input
                                label="Numero de celular"
                                keyboardType="numeric"
                                value={phone}
                                onChangeText={handlePhoneChange}
                            />

                            <SelectInput
                                label="Grupo sanguíneo"
                                options={BLOOD_TYPES}
                                value={value}
                                onChange={setValue}
                            />

                            <Input
                                label="Cidade"
                                value={city}
                                onChangeText={setCity}
                            />

                            <Button
                                title="Próximo"
                                onPress={handleSubmit}
                                textColor="white"
                                borderRadius={10}
                                width={270}
                                style={{ alignSelf: 'center' }}

                            />
                        </View>

                    </ScrollView>
                </View>
            </KeyboardAvoidingView>

        </View>
    );
}