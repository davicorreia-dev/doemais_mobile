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
import { api } from '../../services/api';

export default function SettingsProfileScreen() {

    const navigation = useNavigation<any>();
    const [value, setValue] = useState(''); // blood type
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        async function loadProfileData() {
            try {
                // Busca os dados completos e REAIS do banco de dados (Render)
                const response = await api('/api/doadores/me', 'GET');

                if (response) {
                    setName(response.nome || '');
                    setPhone(response.telefone || '');
                    setValue(response.tipo_sanguineo || '');
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
                                editable={false} // Somente leitura
                            />

                            <Input
                                label="Numero de celular"
                                keyboardType="numeric"
                                value={phone}
                                onChangeText={handlePhoneChange}
                                editable={false} // Somente leitura
                            />

                            <SelectInput
                                label="Grupo sanguíneo"
                                options={BLOOD_TYPES}
                                value={value}
                                onChange={setValue}
                            />
                        </View>

                    </ScrollView>
                </View>
            </KeyboardAvoidingView>

        </View>
    );
}