import { useRef, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Header from '../../../components/Header';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { formColumn } from '../../utils/responsive';
import { useKeyboardBehavior } from '../../hooks/useKeyboardBehavior';
import Styles from './RegisterAddressStyles';

const addressSchema = z.object({
    cep: z.string()
        .min(1, 'O CEP é obrigatório.')
        .regex(/^\d{5}-?\d{3}$/, 'Informe um CEP válido.'),
    cidade: z.string()
        .trim()
        .min(2, 'A cidade é obrigatória.')
        .max(50, 'A cidade deve ter no máximo 50 caracteres.'),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function RegisterAddressScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const keyboardBehavior = useKeyboardBehavior();
    const { basicData } = (route.params as { basicData?: Record<string, string> } | undefined) ?? {};
    const [lookingUpCep, setLookingUpCep] = useState(false);
    const cepRequestId = useRef(0);

    const { control, handleSubmit, setValue, setError, clearErrors, formState: { errors } } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: { cep: basicData?.cep ?? '', cidade: basicData?.cidade ?? '' },
    });

    const handleCepChange = async (value: string, onChange: (nextValue: string) => void) => {
        const digits = value.replace(/\D/g, '').slice(0, 8);
        const formatted = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
        onChange(formatted);
        clearErrors('cep');
        setValue('cidade', '', { shouldDirty: true, shouldValidate: false });
        clearErrors('cidade');

        if (digits.length !== 8) return;

        const requestId = ++cepRequestId.current;
        setLookingUpCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
            const data = await response.json();

            if (requestId !== cepRequestId.current) return;

            if (data.erro) {
                setError('cep', { type: 'manual', message: 'CEP não encontrado.' });
                return;
            }

            const city = data.uf ? `${data.localidade} - ${data.uf}` : data.localidade;
            setValue('cidade', city, { shouldValidate: true, shouldDirty: true });
        } catch {
            if (requestId !== cepRequestId.current) return;
            setError('cep', { type: 'manual', message: 'Não foi possível consultar o CEP. Informe a cidade manualmente.' });
        } finally {
            if (requestId === cepRequestId.current) setLookingUpCep(false);
        }
    };

    const onSubmit = (data: AddressFormData) => {
        if (!basicData) {
            navigation.navigate('Register');
            return;
        }

        navigation.navigate('LgpdScreen', {
            basicData: {
                ...basicData,
                cep: data.cep.replace(/\D/g, ''),
                cidade: data.cidade.trim(),
            },
        });
    };

    return (
        <View style={Styles.container}>
            <StatusBar style="light" />
            <Header
                icon="arrow-back-outline"
                iconColor="#FFF"
                onBack={() => navigation.goBack()}
                containerStyle={{ backgroundColor: '#E0323C' }}
            />

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={keyboardBehavior}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={Styles.heading}>
                        <Text style={Styles.title}>Onde você mora?</Text>
                        <Text style={Styles.subtitle}>Precisamos do seu endereço para encontrar oportunidades de doação perto de você.</Text>
                        <View
                            style={Styles.progressTrack}
                            accessibilityRole="progressbar"
                            accessibilityLabel="Progresso do cadastro"
                            accessibilityValue={{ min: 0, max: 100, now: 100, text: '100%' }}
                        >
                            <View style={[Styles.progressFill, { width: '100%' }]} />
                        </View>
                    </View>

                    <View style={Styles.inputContainer}>
                        <Text style={Styles.requiredHint}>* Campos obrigatórios</Text>

                        <Controller
                            control={control}
                            name="cep"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="CEP*"
                                    placeholder="00000-000"
                                    keyboardType="numeric"
                                    value={value}
                                    onChangeText={(nextValue) => void handleCepChange(nextValue, onChange)}
                                    error={errors.cep?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="cidade"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Cidade*"
                                    placeholder={lookingUpCep ? 'Consultando CEP...' : 'Digite sua cidade'}
                                    autoCapitalize="words"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.cidade?.message}
                                />
                            )}
                        />
                    </View>

                    <View style={[formColumn, Styles.buttonContainer]}>
                        <Button
                            title={lookingUpCep ? 'Consultando CEP...' : 'Continuar'}
                            textColor="#fff"
                            borderRadius={10}
                            onPress={handleSubmit(onSubmit)}
                            disabled={lookingUpCep}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
