import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Modal, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';

import Header from '../../../components/Header';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Styles from './StylesCompleteProfile';
import { api } from '../../services/api';
import { isValidAge, isValidWeight } from '../../utils/validators';
import { mapRegisterServerError } from '../../utils/registerErrors';
import { useKeyboardBehavior } from '../../hooks/useKeyboardBehavior';
import DateOfBirthInput from '../../../components/DateOfBirthInput/DateOfBirthInput';

const BLOOD_TYPES = ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'];

export default function CompleteProfileScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const keyboardBehavior = useKeyboardBehavior();

    //Recebe os dados da RegisterScreen 
    const { basicData } = (route.params as any) || {};

    const [birthDate, setBirthDate] = useState('');
    const [birthDateError, setBirthDateError] = useState('');

    const [weight, setWeight] = useState('');
    const [selectedBlood, setSelectedBlood] = useState<string | null>(null);
    const [unknownBlood, setUnknownBlood] = useState(false);

    const [gender, setGender] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    //Estado para controlar o carregamento da requisição
    const [loading, setLoading] = useState(false);

    const parseBirthDate = (value: string): Date | null => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
        const [year, month, day] = value.split('-').map(Number);
        const parsed = new Date(year, month - 1, day);
        return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day ? parsed : null;
    };

    const handleSelectBlood = (type: string) => {
        if (unknownBlood) setUnknownBlood(false);
        setSelectedBlood(type);
    };

    const handleUnknownChange = (value: boolean) => {
        setUnknownBlood(value);
        if (value) setSelectedBlood(null);
    };

    const selectGender = (selected: string) => {
        setGender(selected);
        setModalVisible(false);
    };


    const handleFinish = async () => {
        const date = parseBirthDate(birthDate);
        console.log("Botão clicado. Estado atual:", { birthDate, gender, weight });

        //Campos Vazios
        if (!birthDate || !gender || !weight) {
            if (!birthDate) setBirthDateError('Informe sua data de nascimento.');
            Alert.alert("Atenção", "Preencha os campos obrigatórios (Data, Gênero, Peso).");
            return;
        }

        // Se o dobLabel tem texto, mas o objeto 'date' ainda é null
        if (!date) {
            Alert.alert("Data Inválida", "Por favor, verifique a data de nascimento.");
            return;
        }

        //Validação de Sangue
        if (!selectedBlood && !unknownBlood) {
            Alert.alert("Atenção", "Selecione seu tipo sanguíneo ou marque 'Não sei'.");
            return;
        }

        //Validação de Idade (16 a 69 anos)
        if (!isValidAge(date)) {
            Alert.alert(
                "Idade não permitida",
                "Para se cadastrar como doador, você deve ter entre 16 e 69 anos."
            );
            return;
        }

        //Validação de Peso Mínimo 50kg e Máximo 150kg
        if (!isValidWeight(weight)) {
            Alert.alert(
                "Peso inválido",
                "Para doar sangue, é necessário pesar entre 50kg e 150kg."
            );
            return;
        }

        //Validação se o basicData chegou
        if (!basicData) {
            Alert.alert("Erro", "Dados do cadastro não encontrados. Volte ao início.");
            navigation.navigate("Register");
            return;
        }

        setLoading(true);

        try {
            const mappedGender = gender === 'Masculino' ? 'M' : gender === 'Feminino' ? 'F' : gender;

            // Ajuste de Fuso Horário (Timezone):
            // Extraímos o ano, mês e dia locais exatos que o usuário escolheu e montamos a string ISO.
            const isoDateWithoutTimezoneShift = `${birthDate}T00:00:00.000Z`;

            // Objeto Final Payload para o Backend
            const payload = {
                ...basicData,
                data_nascimento: isoDateWithoutTimezoneShift,
                peso_kg: Number(weight),
                genero: mappedGender,
                tipo_sanguineo: unknownBlood ? 'NDA' : selectedBlood
            };

            console.log("Enviando dados:", payload);

            await api('/api/auth/register', 'POST', payload);

            Alert.alert("Sucesso", "Conta criada com sucesso!");
            navigation.navigate("RegisterSuccessScreen");

        } catch (error: any) {
            console.error(error);

            const errorMessage = error.message ?? '';
            if (/data de nascimento|doador deve ter/i.test(errorMessage)) {
                setBirthDateError(errorMessage);
                Alert.alert('Revise seus dados', errorMessage);
                return;
            }

            // Erros sobre nome, e-mail, CPF, telefone ou senha são da RegisterScreen:
            // devolvemos o usuário para lá com os dados preenchidos e o erro no campo.
            const fieldErrors = mapRegisterServerError(errorMessage);

            if (Object.keys(fieldErrors).length > 0) {
                Alert.alert(
                    "Revise seus dados",
                    Object.values(fieldErrors).join('\n'),
                    [{
                        text: "Corrigir",
                        onPress: () => navigation.navigate("Register", { prefill: basicData, fieldErrors })
                    }]
                );
                return;
            }

            Alert.alert("Erro ao criar conta", errorMessage || "Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={Styles.container}>
            <StatusBar style="light" />
            <Header
                icon="arrow-back-outline"
                iconColor="#FFF"
                onBack={() => {
                    if (navigation.canGoBack()) {
                        navigation.goBack();
                    } else {
                        navigation.navigate("AuthChoice");
                    }
                }}
                containerStyle={{ backgroundColor: '#E0323C' }}
            />


            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={keyboardBehavior}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

                    <View style={Styles.content}>

                        <DateOfBirthInput
                            value={birthDate}
                            onChange={(value) => { setBirthDate(value); setBirthDateError(''); }}
                            error={birthDateError}
                        />

                        {/* Gênero */}
                        <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.8}>
                            <View pointerEvents="none">
                                <Input
                                    label="Gênero*"
                                    placeholder="Selecione"
                                    value={gender}
                                />
                            </View>
                        </TouchableOpacity>

                        {/* Peso */}
                        <Text style={Styles.weightLabel}>Peso (kg)*</Text>
                        <View style={Styles.weightInputContainer}>
                            <TextInput
                                style={Styles.weightTextInput}
                                placeholder="Ex: 70"
                                placeholderTextColor="#C4C4C4"
                                keyboardType="numeric"
                                value={weight}
                                onChangeText={setWeight}
                            />
                            <Text style={Styles.kgText}>kg</Text>
                        </View>

                        {/* Sangue */}
                        <View style={Styles.sectionHeader}>
                            <Text style={Styles.sectionTitle}>Qual é o seu tipo sanguíneo?</Text>
                        </View>

                        <View style={Styles.bloodGrid}>
                            {BLOOD_TYPES.map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        Styles.bloodButton,
                                        selectedBlood === type && Styles.bloodButtonSelected
                                    ]}
                                    onPress={() => handleSelectBlood(type)}
                                >
                                    <Text style={[
                                        Styles.bloodText,
                                        selectedBlood === type && Styles.bloodTextSelected
                                    ]}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Não sei */}
                        <View style={Styles.checkboxContainer}>
                            <Checkbox
                                value={unknownBlood}
                                onValueChange={handleUnknownChange}
                                color={unknownBlood ? '#E0323C' : undefined}
                            />
                            <Text style={Styles.checkboxText}>Não sei meu tipo sanguíneo</Text>
                        </View>

                        <View style={Styles.buttonContainer}>
                            <Button
                                title={loading ? "Enviando..." : "Finalizar Cadastro"}
                                textColor="#fff"
                                onPress={handleFinish}
                                disabled={loading}
                            />
                        </View>
                    </View>

                    {/* Modal gênero */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={Styles.modalOverlay}>
                            <View style={Styles.modalContent}>
                                <Text style={Styles.modalTitle}>Selecione o Gênero</Text>
                                <TouchableOpacity style={Styles.modalOption} onPress={() => selectGender('Masculino')}>
                                    <Text style={Styles.modalOptionText}>Masculino</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={Styles.modalOption} onPress={() => selectGender('Feminino')}>
                                    <Text style={Styles.modalOptionText}>Feminino</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={Styles.modalClose} onPress={() => setModalVisible(false)}>
                                    <Text style={Styles.modalCloseText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
