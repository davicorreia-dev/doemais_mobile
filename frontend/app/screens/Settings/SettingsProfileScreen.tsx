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
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadProfileData() {
            try {
                // Busca os dados completos e REAIS do banco de dados (Render)
                const response = await api('/api/doadores/me', 'GET');

                if (response) {
                    setName(response.nome || '');
                    setPhone(response.telefone || '');
                    setValue(response.tipo_sanguineo || '');
                    setCity(response.cidade || '');
                }
            } catch (error) {
                console.error("Erro ao carregar dados do perfil", error);
            }
        }
        loadProfileData();
    }, []);

    const handlePhoneChange = (text: string) => {
        // Remove tudo o que não é dígito
        let v = text.replace(/\D/g, ''); 
        
        // Limita a 11 números no máximo
        v = v.substring(0, 11);

        // Aplica a formatação via Regex
        v = v.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca parênteses em volta dos dois primeiros dígitos
        v = v.replace(/(\d)(\d{4})$/, '$1-$2');    // Coloca o hífen antes dos 4 últimos dígitos
        
        setPhone(v);
    };

    const handleSave = async () => {

        //Validação
        if (!name || !phone || !city || !value) {
            Alert.alert("Atenção", "Falta preencher os campos");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                nome: name,
                telefone: phone,
                cidade: city,
                tipo_sanguineo: value
            };

            await api('/api/doadores/me', 'PUT', payload);
            Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
            navigation.goBack();
        } catch (error: any) {
            console.error("Erro ao salvar o perfil", error);
            Alert.alert("Erro", error.message || "Não foi possível salvar o perfil.", error);
        } finally {
            setLoading(false);
        }

    }

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

                            <Input
                                label="Cidade"
                                value={city}
                                onChangeText={setCity}
                            />

                            <SelectInput
                                label="Grupo sanguíneo"
                                options={BLOOD_TYPES}
                                value={value}
                                onChange={setValue}
                            />

                            <Button
                                title={loading ? 'Salvando...' : 'Salvar'}
                                onPress={handleSave}
                                textColor="#fff"
                                disabled={loading}
                            />
                        </View>

                    </ScrollView>
                </View>
            </KeyboardAvoidingView>

        </View>
    );
}