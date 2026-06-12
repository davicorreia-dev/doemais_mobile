import { useState, useMemo, useCallback } from 'react';
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View, Alert } from 'react-native';
import { NavigationProp, ParamListBase, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QUIZ_MODULES, type FormGender, type QuizModule } from '../app/QuizFlow/quizData';
import styles from './StylesEligibily';
import { api } from '../../services/api';

const normalizeGender = (value: string | null | undefined): FormGender => {
    if (!value) return 'ALL';
    const upper = value.toUpperCase();
    if (upper === 'M' || upper === 'MALE' || upper === 'MASCULINO') {
        return 'M';
    }

    if (upper === 'F' || upper === 'FEMALE' || upper === 'FEMININO') {
        return 'F';
    }

    return 'ALL';
};

const isVisibleForGender = (module: QuizModule, gender: FormGender) => module.visibleFor === 'ALL' || module.visibleFor === gender;

const DISPLAY_ORDER = [
    'GRAVIDEZ',
    'AMAMENTACAO',
    'SITUACAO_DE_RISCO',
    'GRIPE',
    'TATUAGEM',
    'PIERCING',
    'VIAGEM',
    'ESTADOS_COM_MALARIA',
    'TRIAGEM_HOMEM',
    'TRIAGEM_MULHER',
    'IMPEDIMENTOS_DEFINITIVOS',
] as const;

// Prazos de carência/janela de segurança de acordo com a ANVISA/Ministério da Saúde
const SAFETY_WINDOWS: Record<string, number> = {
    IMPEDIMENTOS_DEFINITIVOS: 99999, // Permanente
    GRAVIDEZ: 180, // 180 dias
    AMAMENTACAO: 365, // 365 dias
    GRIPE: 7, // 7 dias
    SITUACAO_DE_RISCO: 365, // 365 dias
    TATUAGEM: 365, // 365 dias
    PIERCING: 180, // 180 dias
    VIAGEM: 365, // 365 dias
    ESTADOS_COM_MALARIA: 365, // 365 dias
    TRIAGEM_HOMEM: 60, // 60 dias (homem)
    TRIAGEM_MULHER: 90, // 90 dias (mulher)
};

const checkDbBlock = (moduleId: string, form: any): boolean => {
    if (!form) return false;
    switch (moduleId) {
        case 'IMPEDIMENTOS_DEFINITIVOS':
            return !!(form.teve_hepatite || form.usou_drogas_injetaveis || form.teve_malaria);
        case 'GRAVIDEZ':
            return !!form.esta_gravida;
        case 'AMAMENTACAO':
            return !!form.esta_amamentando;
        case 'GRIPE':
            return !!form.teve_resfriado;
        case 'TATUAGEM':
            return !!form.fez_tatuagem;
        case 'PIERCING':
            return !!form.fez_piercing;
        case 'ESTADOS_COM_MALARIA':
            return !!form.esteve_area_malaria || !!form.teve_malaria;
        case 'SITUACAO_DE_RISCO':
            return !!form.usou_drogas_injetaveis;
        default:
            return false;
    }
};

type ModuleStateInfo = {
    status: 'approved' | 'blocked' | 'neutral';
    remainingDays?: number;
    message?: string;
};

const getModuleState = (moduleId: string, latestForm: any, localHistory: any): ModuleStateInfo => {
    const local = localHistory?.[moduleId];
    const safetyWindow = SAFETY_WINDOWS[moduleId] || 0;

    // 1. Verifica histórico local (resposta recente nesta sessão)
    if (local) {
        const elapsed = Math.floor((Date.now() - local.date) / (1000 * 60 * 60 * 24));
        if (local.status === 'blocked' && elapsed < safetyWindow) {
            const remaining = safetyWindow - elapsed;
            return {
                status: 'blocked',
                remainingDays: remaining,
                message: safetyWindow === 99999 ? 'Impedimento definitivo' : `Inapto temporário. Restam ${remaining} dias.`
            };
        }
        if (local.status === 'approved' && elapsed < 30) {
            // Aprovado vale por 30 dias antes de voltar a ficar neutro para atualização
            return { status: 'approved' };
        }
    }

    // 2. Verifica dados carregados do banco de dados (persistência entre aparelhos)
    if (latestForm) {
        const isDbBlocked = checkDbBlock(moduleId, latestForm);
        const dataPreenchimento = new Date(latestForm.data_preenchimento);
        const elapsed = Math.floor((Date.now() - dataPreenchimento.getTime()) / (1000 * 60 * 60 * 24));

        if (isDbBlocked && elapsed < safetyWindow) {
            const remaining = safetyWindow - elapsed;
            return {
                status: 'blocked',
                remainingDays: remaining,
                message: safetyWindow === 99999 ? 'Impedimento definitivo' : `Inapto temporário. Restam ${remaining} dias.`
            };
        }
    }

    return { status: 'neutral' };
};

export default function EligibilityFormsScreen() {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    
    const [gender, setGender] = useState<FormGender>('ALL');
    const [loading, setLoading] = useState(true);
    const [latestForm, setLatestForm] = useState<any>(null);
    const [localHistory, setLocalHistory] = useState<any>({});

    useFocusEffect(
        useCallback(() => {
            async function loadData() {
                try {
                    // 1. Carrega histórico local
                    const historyRaw = await AsyncStorage.getItem('@doemais:quiz_history');
                    if (historyRaw) {
                        setLocalHistory(JSON.parse(historyRaw));
                    }

                    // 2. Carrega gênero do cache local
                    const userData = await AsyncStorage.getItem('@doemais:user');
                    if (userData) {
                        const parsedUser = JSON.parse(userData);
                        if (parsedUser.genero) {
                            setGender(normalizeGender(parsedUser.genero));
                            setLoading(false);
                        }
                    }

                    // 3. Carrega perfil e formulário mais recente em paralelo
                    const [profileResponse, formResponse] = await Promise.all([
                        api('/api/doadores/me', 'GET').catch(() => null),
                        api('/api/doadores/elegibilidade', 'GET').catch(() => null)
                    ]);

                    if (profileResponse) {
                        const userDataApi = profileResponse.data || profileResponse;
                        if (userDataApi && userDataApi.genero !== undefined && userDataApi.genero !== null) {
                            const freshGender = normalizeGender(userDataApi.genero);
                            setGender(freshGender);
                            // Atualiza AsyncStorage
                            if (userData) {
                                const parsedUser = JSON.parse(userData);
                                parsedUser.genero = userDataApi.genero;
                                await AsyncStorage.setItem('@doemais:user', JSON.stringify(parsedUser));
                            } else {
                                await AsyncStorage.setItem('@doemais:user', JSON.stringify(userDataApi));
                            }
                        }
                    }

                    if (formResponse) {
                        const formData = formResponse.data || formResponse;
                        setLatestForm(formData);
                    } else {
                        setLatestForm(null);
                    }
                } catch (error) {
                    console.error("Erro ao carregar dados da triagem:", error);
                } finally {
                    setLoading(false);
                }
            }
            loadData();
        }, [])
    );

    const visibleForms = useMemo(() => {
        return DISPLAY_ORDER
            .map((key) => QUIZ_MODULES[key])
            .filter((module): module is QuizModule => Boolean(module))
            .filter((module) => isVisibleForGender(module, gender));
    }, [gender]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDFCFC' }}>
                <StatusBar backgroundColor="#E0323C" barStyle="light-content" />
                <Text style={{ fontSize: 16, color: '#999' }}>Carregando formulários...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#E0323C" barStyle="light-content" />
            <View style={styles.hero} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Antes de doar, precisamos de algumas informações importantes.</Text>

                <View style={styles.bulletRow}>
                    <Ionicons name="create-outline" size={22} color="#E0323C" />
                    <Text style={styles.bulletText}>Um breve questionário de elegibilidade.</Text>
                </View>

                <View style={styles.bulletRow}>
                    <Ionicons name="shield-outline" size={22} color="#E0323C" />
                    <Text style={styles.bulletText}>Sua segurança é nossa prioridade.</Text>
                </View>

                <Text style={styles.sectionLabel}>Formulários disponíveis</Text>

                <View style={styles.list}>
                    {visibleForms.map((module) => {
                        const stateInfo = getModuleState(module.id, latestForm, localHistory);
                        
                        let cardBg = '#FFF';
                        let cardBorderColor = 'transparent';
                        let textColor = '#333';
                        let descColor = '#666';
                        let rightIcon = <Ionicons name="chevron-forward" size={24} color="#E0323C" />;
                        let tintColor = '#E0323C';
                        let iconBg = '#FFF2F3';

                        if (stateInfo.status === 'blocked') {
                            cardBg = '#FDECEF';
                            cardBorderColor = '#EF9A9A';
                            textColor = '#C62828';
                            descColor = '#D32F2F';
                            tintColor = '#C62828';
                            iconBg = '#FFEBEE';
                            rightIcon = <Ionicons name="close-circle" size={24} color="#C62828" />;
                        } else if (stateInfo.status === 'approved') {
                            cardBg = '#E8F8EE';
                            cardBorderColor = '#A5D6A7';
                            textColor = '#2E7D32';
                            descColor = '#388E3C';
                            tintColor = '#2E7D32';
                            iconBg = '#E8F5E9';
                            rightIcon = <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />;
                        }

                        const handlePress = () => {
                            if (stateInfo.status === 'blocked') {
                                Alert.alert(
                                    "Aguarde o prazo",
                                    `Você foi classificado como inapto nesta triagem.\n\nMotivo: ${stateInfo.message || 'Período de segurança ativo.'}`
                                );
                                return;
                            }
                            if (stateInfo.status === 'approved') {
                                Alert.alert(
                                    "Apto",
                                    "Você já foi aprovado nesta triagem recente. Deseja refazer as respostas?",
                                    [
                                        { text: "Voltar", style: "cancel" },
                                        { text: "Refazer", onPress: () => navigation.navigate('QuizScreen', { moduleId: module.id }) }
                                    ]
                                );
                                return;
                            }
                            navigation.navigate('QuizScreen', { moduleId: module.id });
                        };

                        return (
                            <TouchableOpacity 
                                key={module.id} 
                                style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorderColor, borderWidth: cardBorderColor !== 'transparent' ? 1 : 0 }]} 
                                activeOpacity={0.85} 
                                onPress={handlePress}
                            >
                                <View style={[styles.cardIconWrap, { backgroundColor: iconBg }]}>
                                    <Image source={module.image} style={[styles.cardIcon, { tintColor: tintColor }]} resizeMode="contain" />
                                </View>

                                <View style={styles.cardBody}>
                                    <Text style={[styles.cardTitle, { color: textColor }]}>{module.title}</Text>
                                    <Text style={[styles.cardDescription, { color: descColor }]}>
                                        {stateInfo.status === 'blocked' ? stateInfo.message : module.description}
                                    </Text>
                                </View>

                                {rightIcon}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}