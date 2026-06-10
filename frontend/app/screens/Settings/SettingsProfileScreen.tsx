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
import z from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const updateprofile = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    phone: z.string().min(11, "O telefone deve ter pelo menos 11 caracteres"),
    city: z.string().min(1, "A cidade é obrigatória"),
    type_sanguine: z.string().min(1, "O tipo sanguíneo é obrigatório"),
});

type UpdateProfileData = z.infer<typeof updateprofile>;

export default function SettingsProfileScreen() {

    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<UpdateProfileData>({
        resolver: zodResolver(updateprofile),
        defaultValues: {
            name: "",
            phone: "",
            city: "",
            type_sanguine: "",
        }
    });


    useEffect(() => {
        async function loadProfileData() {
            try {
                // Busca os dados completos e REAIS do banco de dados (Render)
                const response = await api('/api/doadores/me', 'GET');

                if (response) {
                    reset({
                        name: response.nome || '',
                        phone: response.telefone || '',
                        type_sanguine: response.tipo_sanguineo || '',
                        city: response.cidade || ''
                    });
                }
            } catch (error) {
                console.error("Erro ao carregar dados do perfil", error);
            }
        }
        loadProfileData();
    }, [reset]);

    const handlePhoneChange = (text: string, onChange: (value: string) => void) => {
        // Remove tudo o que não é dígito
        let v = text.replace(/\D/g, '');

        // Limita a 11 números no máximo
        v = v.substring(0, 11);

        // Aplica a formatação via Regex
        v = v.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca parênteses em volta dos dois primeiros dígitos
        v = v.replace(/(\d)(\d{4})$/, '$1-$2');    // Coloca o hífen antes dos 4 últimos dígitos

        onChange(v);
    };

    const onSubmit = async (data: UpdateProfileData) => {
        setLoading(true);

        try {
            const payload = {
                nome: data.name,
                telefone: data.phone,
                cidade: data.city,
                tipo_sanguineo: data.type_sanguine
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

                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Nome Completo"
                                        value={value}
                                        onChangeText={onChange}
                                        error={errors.name?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="phone"
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Numero de celular"
                                        keyboardType="numeric"
                                        value={value}
                                        onChangeText={(text) => handlePhoneChange(text, onChange)}
                                        error={errors.phone?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="city"
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Cidade"
                                        value={value}
                                        onChangeText={onChange}
                                        error={errors.city?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="type_sanguine"
                                render={({ field: { onChange, value } }) => (
                                    <View>
                                        <SelectInput
                                            label="Grupo sanguíneo"
                                            options={BLOOD_TYPES}
                                            value={value}
                                            onChange={onChange}
                                        />
                                        {errors.type_sanguine && (
                                            <Text style={{ color: 'red', fontSize: 12, marginLeft: 12, marginTop: -8, marginBottom: 8 }}>{errors.type_sanguine.message}</Text>
                                        )}
                                    </View>
                                )}
                            />

                            <Button
                                title={loading ? 'Salvando...' : 'Salvar'}
                                onPress={handleSubmit(onSubmit)}
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