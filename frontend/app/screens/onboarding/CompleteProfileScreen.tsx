import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Modal, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';

import Header from '../../../components/Header';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Styles from './StylesCompleteProfile';
import { api } from '../../services/api';
import { isValidAge, isValidWeight } from '../../utils/validators';

const BLOOD_TYPES = ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'];

export default function CompleteProfileScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute();

    //Recebe os dados da RegisterScreen 
    const { basicData } = (route.params as any) || {};

    const [date, setDate] = useState(new Date());
    const [dobLabel, setDobLabel] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [weight, setWeight] = useState('');
    const [selectedBlood, setSelectedBlood] = useState<string | null>(null);
    const [unknownBlood, setUnknownBlood] = useState(false);

    const [gender, setGender] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    //Estado para controlar o carregamento da requisição
    const [loading, setLoading] = useState(false);

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (event.type === 'dismissed' || !selectedDate) {
            return;
        }
        if (selectedDate) {
            setDate(selectedDate);
            const formattedDate = selectedDate.toLocaleDateString('pt-BR');
            setDobLabel(formattedDate);
            console.log("Data Mobile selecionada:", formattedDate);
        }
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
        console.log("Botão clicado. Estado atual:", { dobLabel, date, gender, weight });

        //Campos Vazios
        if (!dobLabel || !gender || !weight) {
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

        //Validação de Peso Mínimo 50kg
        if (!isValidWeight(weight)) {
            Alert.alert(
                "Peso insuficiente",
                "Para doar sangue, é necessário pesar no mínimo 50kg."
            );
            return;
        }

        //Validação se o basicData chegou
        if (!basicData) {
            Alert.alert("Erro", "Dados do cadastro não encontrados. Volte ao início.");
            navigation.navigate("RegisterScreen");
            return;
        }

        setLoading(true);

        try {
            // Objeto Final Payload para o Backend
            const payload = {
                ...basicData,
                data_nascimento: date.toISOString(),
                peso_kg: Number(weight),
                genero: gender,
                tipo_sanguineo: unknownBlood ? 'Nao sei' : selectedBlood
            };

            console.log("Enviando dados:", payload);

            await api('/api/auth/register', 'POST', payload);

            Alert.alert("Sucesso", "Conta criada com sucesso!");
            navigation.navigate("RegisterSuccessScreen");

        } catch (error: any) {
            console.error(error);
            Alert.alert("Erro ao criar conta", error.message || "Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={Styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Header
                    icon="arrow-back-outline"
                    title="Criar uma conta"
                    subtitle="Requisitos Básicos"
                    onBack={() => navigation.goBack()}
                />

                <View style={Styles.content}>

                    {/* Data */}
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
                        <View pointerEvents="none">
                            <Input
                                label="Data de Nascimento*"
                                placeholder="DD/MM/AAAA"
                                value={dobLabel}
                            />
                        </View>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date || new Date()}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                            maximumDate={new Date()}
                        />
                    )}

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
    );
}