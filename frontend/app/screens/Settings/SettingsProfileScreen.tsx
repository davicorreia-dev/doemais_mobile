import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../../../components/Header';
import Styles from './Styles';
import { clamp } from '../../utils/responsive';
import Input from '../../../components/Input';
import SelectInput from '../../../components/SelectInput/SelectInput';
import Button from '../../../components/Button';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../services/api';
import z from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useKeyboardBehavior } from '../../hooks/useKeyboardBehavior';

const updateprofile = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    phone: z.string().min(11, "O telefone deve ter pelo menos 11 caracteres"),
    city: z.string().min(1, "A cidade é obrigatória"),
    type_sanguine: z.string().min(1, "O tipo sanguíneo é obrigatório"),
});

type UpdateProfileData = z.infer<typeof updateprofile>;

export default function SettingsProfileScreen() {

    const navigation = useNavigation<any>();

    // A tela acompanha a largura disponível em vez de larguras fixas
    const { width } = useWindowDimensions();
    const gutter = clamp(width * 0.05, 16, 28);
    const titleSize = clamp(width * 0.062, 20, 28);
    const subtitleSize = clamp(width * 0.037, 13, 16);
    const [loading, setLoading] = useState(false);
    const [cep, setCep] = useState('');
    const keyboardBehavior = useKeyboardBehavior();

    const handleCepChange = async (text: string, onChangeCity: (value: string) => void) => {
        let clean = text.replace(/\D/g, '');
        clean = clean.substring(0, 8);

        let masked = clean;
        if (clean.length > 5) {
            masked = `${clean.substring(0, 5)}-${clean.substring(5)}`;
        }
        setCep(masked);

        if (clean.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
                if (response.ok) {
                    const data = await response.json();
                    if (!data.erro && data.localidade && data.uf) {
                        onChangeCity(`${data.localidade} - ${data.uf}`);
                    } else {
                        Alert.alert("Atenção", "CEP não encontrado.");
                    }
                }
            } catch (err) {
                console.error("Erro ao buscar CEP:", err);
            }
        }
    };

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
                const userData = response.data || response;

                if (userData) {
                    reset({
                        name: userData.nome || '',
                        phone: userData.telefone || '',
                        type_sanguine: userData.tipo_sanguineo || '',
                        city: userData.cidade || ''
                    });

                    if (userData.cep) {
                        setCep(userData.cep);
                    }
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
                cep: cep,
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
        <View style={Styles.screen}>

            <StatusBar style="light" />
            <Header
                icon="arrow-back-outline"
                iconColor="#FFF"
                containerStyle={{ backgroundColor: '#E0323C' }}

            />


            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={keyboardBehavior}
            >
                <View style={{ flex: 1, backgroundColor: '#FDFCFC' }}>
                    <ScrollView
                        contentContainerStyle={[Styles.scrollContent, { paddingHorizontal: gutter }]}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >

                        <Text style={[Styles.title, { fontSize: titleSize }]}>Configuração do perfil</Text>

                        <Text style={[Styles.subtitle, { fontSize: subtitleSize }]}>
                            Quase pronto para configurar seu perfil, preencha as informações abaixo.
                            Apenas 3 etapas.
                        </Text>
                        
                        <View style={Styles.profileCard}>
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
                                        <View style={Styles.fieldGroup}>
                                            <Input
                                                label="CEP (Para auto-preencher)"
                                                keyboardType="numeric"
                                                value={cep}
                                                placeholder="Ex: 50000-000"
                                                onChangeText={(text) => handleCepChange(text, onChange)}
                                            />
                                            <Input
                                                label="Cidade"
                                                value={value}
                                                onChangeText={onChange}
                                                error={errors.city?.message}
                                            />
                                        </View>
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="type_sanguine"
                                    render={({ field: { onChange, value } }) => (
                                        <View style={Styles.fieldGroup}>
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
                            </View>
                        </View>

                        <View style={[Styles.actionRow, { marginTop: 10, marginBottom: 20 }]}>
                            <Button
                                title={loading ? "Salvando..." : "Salvar"}
                                textColor="#FFF"
                                borderRadius={10}
                                onPress={handleSubmit(onSubmit)}
                                disabled={loading}
                            />
                        </View>

                    </ScrollView>
                </View>
            </KeyboardAvoidingView>

        </View>
    );
}