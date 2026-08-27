import { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StatusBar, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveModuleResult = async (moduleId: string, status: 'approved' | 'blocked') => {
    try {
        const userRaw = await AsyncStorage.getItem('@doemais:user');
        if (!userRaw) return;
        const user = JSON.parse(userRaw);
        const userId = user.id;
        
        const key = `@doemais:quiz_history:${userId}`;
        const historyRaw = await AsyncStorage.getItem(key);
        const history = historyRaw ? JSON.parse(historyRaw) : {};
        history[moduleId] = {
            status,
            date: Date.now(),
        };
        await AsyncStorage.setItem(key, JSON.stringify(history));
    } catch (e) {
        console.error("Erro ao salvar histórico do quiz no AsyncStorage:", e);
    }
};

const isMonthWithinDays = (monthValue: string, daysLimit: number): boolean => {
    const monthsMap: Record<string, number> = {
        JAN: 0, FEV: 1, MAR: 2, ABR: 3, MAI: 4, JUN: 5,
        JUL: 6, AGO: 7, SET: 8, OUT: 9, NOV: 10, DEZ: 11
    };
    
    const selectedMonth = monthsMap[monthValue];
    if (selectedMonth === undefined) return false;

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    let year = currentYear;
    if (selectedMonth > currentMonth) {
        year = currentYear - 1;
    }
    
    const selectedDate = new Date(year, selectedMonth, today.getDate());
    const diffTime = today.getTime() - selectedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays < daysLimit;
};

import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import Styles from './Styles';
import { QUIZ_MODULES, type QuizQuestion } from './quizData';
import { api } from '../../../services/api'; // <-- Adicionado o import da API
import { clamp, topInset } from '../../../utils/responsive';

type RouteParams = {
    moduleId?: string;
};

function getBlockMessage(question: QuizQuestion, fallback: string) {
    return question.blockMessage || fallback;
}

export default function QuizScreen() {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();

    // Topo vermelho responsivo: acompanha a tela e respeita o notch
    const { width: winWidth, height: winHeight } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const safeTop = topInset(insets.top);
    const headerSize = clamp(winHeight * 0.28, 190, 280);
    const headerRadius = winWidth * 0.42;
    const circleSize = clamp(winWidth * 0.32, 96, 140);
    const navSize = clamp(winWidth * 0.14, 44, 60);
    const route = useRoute();
    const { moduleId } = (route.params as RouteParams | undefined) ?? {};

    const module = useMemo(() => {
        if (!moduleId) {
            return null;
        }

        return QUIZ_MODULES[moduleId];
    }, [moduleId]);

    const [questionIndex, setQuestionIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [blockVisible, setBlockVisible] = useState(false);
    const [blockMessage, setBlockMessage] = useState('');
    const [selectExpanded, setSelectExpanded] = useState(false);
    const [selectedMonthLabel, setSelectedMonthLabel] = useState('');
    
    // Acumulador de respostas!
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false); // Para evitar duplo clique no final...
    // Opção tocada no momento: fica destacada por um instante antes de avançar,
    // para o usuário enxergar o que escolheu (a tela trocava rápido demais).
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    useEffect(() => {
        setInputValue('');
        setSelectExpanded(false);
    }, [questionIndex]);

    useEffect(() => {
        if (!module) {
            navigation.goBack();
        }
    }, [module, navigation]);

    if (!module) {
        return null;
    }

    const currentQuestion = module.questions[questionIndex];

    if (!currentQuestion) {
        return null;
    }

   // Nova função auxiliar: Apenas traduz e envia
    const submitAnswersToAPI = async (finalAnswers: Record<string, any>) => {
        console.log("🛠️ RESPOSTAS BRUTAS COM OS IDs REAIS:", finalAnswers);

        // O nosso Avaliador Inteligente:
        const evaluate = (...keys: string[]) => {
            const values = keys.map(k => finalAnswers[k]).filter(v => v !== undefined);
            if (values.length === 0) return undefined; 
            
            // Verifica se a pessoa respondeu 'SIM' ou true em alguma das perguntas perigosas
            return values.includes(true) || values.includes('SIM'); 
        };

        const payloadDoBanco = {
            teve_resfriado: evaluate('s1', 's2', 's3', 's4', 's5'), // GRIPE
            esta_gravida: evaluate('g1', 'g2', 'g4', 'g5'), // GRAVIDEZ (Inclui aborto)
            esta_amamentando: evaluate('a1', 'a2', 'a3', 'a4', 'a5'), // AMAMENTAÇÃO
            fez_tatuagem: evaluate('t1', 't2', 't3', 't5'), // TATUAGEM (t4 é ignorado porque 'false' é o bloqueio nele)
            fez_piercing: evaluate('p1', 'p2', 'p3', 'p4', 'p5'), // PIERCING
            esteve_area_malaria: evaluate('m1', 'm2', 'm3', 'm4', 'm5'), // ESTADOS_COM_MALARIA
            teve_hepatite: evaluate('d1', 'd2'), // IMPEDIMENTOS_DEFINITIVOS (Hepatites)
            usou_drogas_injetaveis: evaluate('d4', 'r4'), // IMPEDIMENTOS/SITUAÇÃO DE RISCO (Drogas injetáveis)
            teve_malaria: evaluate('d3', 'm4'), // IMPEDIMENTOS/MALARIA
        };

        const payloadLimpo = Object.fromEntries(
            Object.entries(payloadDoBanco).filter(([_, value]) => value !== undefined)
        );

        if (Object.keys(payloadLimpo).length > 0) {
            console.log("Enviando JSON para o banco:", payloadLimpo);
            try {
                await api('/api/doadores/elegibilidade', 'POST', payloadLimpo);
            } catch (err) {
                 console.error("Erro na API de elegibilidade:", err);
            }
        }
    };

    const finishFlow = async (finalAnswers: Record<string, any>) => {
        setIsSubmitting(true);
        try {
            // Usa a nossa nova função!
            await submitAnswersToAPI(finalAnswers);
            
            // Grava a aprovação localmente no AsyncStorage
            await saveModuleResult(module.id, 'approved');
            
            Alert.alert(module.successTitle, module.successMessage, [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error("Erro ao salvar triagem:", error);
            Alert.alert("Erro", "Ocorreu um erro ao salvar o questionário. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const exitToMenu = () => {
        setBlockVisible(false);
        setBlockMessage('');
        setQuestionIndex(0);
        setInputValue('');
        setSelectedMonthLabel('');
        setAnswers({}); // Limpa as respostas ao sair
        navigation.goBack();
    };

    const openBlock = (message: string) => {
        setBlockVisible(true);
        setBlockMessage(message || module.blockMessage);
        
        // Grava o bloqueio localmente no AsyncStorage
        saveModuleResult(module.id, 'blocked').catch(e => console.error(e));
    };

    const validateQuestion = (answer: boolean | string | number | null) => {
        const rule = currentQuestion.blockRule;

        if (!rule) {
            return { blocked: false, message: '' };
        }

        switch (rule.kind) {
            case 'boolean': {
                if (typeof answer !== 'boolean') {
                    return { blocked: true, message: 'Selecione uma resposta para continuar.' };
                }

                return answer === rule.blockWhen
                    ? { blocked: true, message: getBlockMessage(currentQuestion, module.blockMessage) }
                    : { blocked: false, message: '' };
            }

            case 'choice': {
                if (typeof answer !== 'string') {
                    return { blocked: true, message: 'Selecione uma opção para continuar.' };
                }

                // Validação customizada para triagem de meses de doação anterior (h3 e w3)
                if (currentQuestion.id === 'h3' || currentQuestion.id === 'w3') {
                    const limit = currentQuestion.id === 'h3' ? 60 : 90;
                    if (isMonthWithinDays(answer, limit)) {
                        return { 
                            blocked: true, 
                            message: `A sua última doação foi há menos de ${limit} dias. É necessário aguardar o intervalo mínimo.` 
                        };
                    }
                }

                return rule && rule.blockValues.includes(answer)
                    ? { blocked: true, message: getBlockMessage(currentQuestion, module.blockMessage) }
                    : { blocked: false, message: '' };
            }

            case 'number': {
                if (typeof answer !== 'number' || Number.isNaN(answer)) {
                    return { blocked: true, message: 'Informe um valor numérico válido.' };
                }

                if (typeof rule.min === 'number' && answer < rule.min) {
                    return { blocked: true, message: getBlockMessage(currentQuestion, module.blockMessage) };
                }

                if (typeof rule.max === 'number' && answer > rule.max) {
                    return { blocked: true, message: getBlockMessage(currentQuestion, module.blockMessage) };
                }

                return { blocked: false, message: '' };
            }

            default:
                return { blocked: false, message: '' };
        }
    };

    const handleAdvance = (answer: boolean | string | number | null) => {
        const result = validateQuestion(answer);

        // SEMPRE salvamos a resposta atual no acumulador (mesmo se for reprovado)
        const newAnswers = { ...answers, [currentQuestion.id]: answer };
        setAnswers(newAnswers);

        // Se a resposta for ELIMINATÓRIA:
        if (result.blocked) {
            // Mandamos para o banco em "background" para registrar a falha
            submitAnswersToAPI(newAnswers).catch(e => console.error("Erro ao registrar bloqueio:", e));
            // E exibimos a tela de bloqueio
            openBlock(result.message);
            return;
        }

        // Se responder 'Não' (false) na primeira pergunta de triagem (h1 ou w1),
        // significa que não doou nos últimos 60/90 dias. Portanto, está aprovado e não precisa detalhar o mês!
        if ((currentQuestion.id === 'h1' || currentQuestion.id === 'w1') && answer === false) {
            finishFlow(newAnswers);
            return;
        }

        // Se for a última pergunta (Aprovado)
        if (questionIndex >= module.questions.length - 1) {
            finishFlow(newAnswers);
            return;
        }

        setQuestionIndex((value) => value + 1);
    };

    // Destaca a opção escolhida e só então avança
    const chooseAnswer = (optionKey: string, answer: boolean | string | number | null, onSelect?: () => void) => {
        if (isSubmitting || selectedOption) return;

        setSelectedOption(optionKey);
        onSelect?.();

        setTimeout(() => {
            setSelectedOption(null);
            handleAdvance(answer);
        }, 280);
    };

    const handlePrevious = () => {
        if (questionIndex > 0) {
            setQuestionIndex((value) => value - 1);
            return;
        }

        navigation.goBack();
    };

    const renderQuestionBody = () => {
        const isEligibilityTriagem = module.id === 'TRIAGEM_HOMEM' || module.id === 'TRIAGEM_MULHER';

        if (currentQuestion.answerType === 'boolean') {
            return (
                <View style={Styles.booleanActions}>
                    <TouchableOpacity
                        style={[Styles.answerButton, selectedOption === 'sim' && Styles.answerButtonSelected]}
                        activeOpacity={0.8}
                        onPress={() => chooseAnswer('sim', true)}
                        disabled={isSubmitting}
                    >
                        <Text style={[Styles.answerButtonText, selectedOption === 'sim' && Styles.answerButtonTextSelected]}>Sim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[Styles.answerButton, selectedOption === 'nao' && Styles.answerButtonSelected]}
                        activeOpacity={0.8}
                        onPress={() => chooseAnswer('nao', false)}
                        disabled={isSubmitting}
                    >
                        <Text style={[Styles.answerButtonText, selectedOption === 'nao' && Styles.answerButtonTextSelected]}>Não</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (currentQuestion.answerType === 'choice' && currentQuestion.options) {
            if (currentQuestion.presentation === 'select' && isEligibilityTriagem) {
                return (
                    <View style={Styles.choiceSelectBlock}>
                        <View style={Styles.choiceSelectIconRow}>
                            <Ionicons name="calendar-outline" size={22} color="#444" />
                        </View>

                        <TouchableOpacity style={Styles.choiceSelectField} onPress={() => setSelectExpanded((value) => !value)}>
                            <Text style={Styles.choiceSelectFieldText}>
                                Selecione um mês
                            </Text>
                            <Ionicons name={selectExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#444" />
                        </TouchableOpacity>

                        {selectExpanded ? (
                            <View style={Styles.choiceSelectDropdown}>
                                {currentQuestion.options.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={[Styles.choiceSelectItem, selectedOption === option.value && Styles.choiceSelectItemSelected]}
                                        activeOpacity={0.8}
                                        onPress={() => chooseAnswer(String(option.value), option.value, () => setSelectedMonthLabel(option.label))}
                                    >
                                        <Text style={Styles.choiceSelectItemText}>{option.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : null}
                    </View>
                );
            }

            if (currentQuestion.presentation === 'buttons' && isEligibilityTriagem) {
                const text = selectedMonthLabel
                    ? currentQuestion.questionText.replace('{{month}}', selectedMonthLabel)
                    : currentQuestion.questionText.replace(' ({{month}})', '');

                return (
                    <View style={Styles.inputArea}>
                        <Text style={Styles.monthConfirmText}>{text}</Text>
                        <View style={Styles.radioList}>
                            <TouchableOpacity
                                style={[Styles.radioRow, selectedOption === 'SIM' && Styles.radioRowSelected]}
                                activeOpacity={0.8}
                                onPress={() => chooseAnswer('SIM', 'SIM')}
                            >
                                <View style={[Styles.radioCircle, selectedOption === 'SIM' && Styles.radioCircleActive]} />
                                <Text style={Styles.radioLabel}>Sim</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[Styles.radioRow, selectedOption === 'NAO_TENHO_CERTEZA' && Styles.radioRowSelected]}
                                activeOpacity={0.8}
                                onPress={() => chooseAnswer('NAO_TENHO_CERTEZA', 'NAO_TENHO_CERTEZA')}
                            >
                                <View style={[Styles.radioCircle, selectedOption === 'NAO_TENHO_CERTEZA' && Styles.radioCircleActive]} />
                                <Text style={Styles.radioLabel}>Não tenho certeza</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            }

            return (
                <View style={Styles.choiceList}>
                    {currentQuestion.options.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[Styles.choiceButton, selectedOption === String(option.value) && Styles.choiceButtonSelected]}
                            activeOpacity={0.8}
                            onPress={() => chooseAnswer(String(option.value), option.value)}
                            disabled={isSubmitting}
                        >
                            <Text style={[Styles.choiceButtonText, selectedOption === String(option.value) && Styles.choiceButtonTextSelected]}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        }

        return (
            <View style={Styles.inputArea}>
                <Input
                    label=""
                    value={inputValue}
                    onChangeText={setInputValue}
                    placeholder={currentQuestion.inputPlaceholder}
                    keyboardType={currentQuestion.inputKeyboardType}
                />
                <TouchableOpacity
                    style={Styles.nextButton}
                    disabled={isSubmitting}
                    onPress={() => {
                        if (inputValue.trim() === '') {
                            Alert.alert('Atenção', 'Preencha a resposta para continuar.');
                            return;
                        }

                        const typedValue = currentQuestion.answerType === 'number'
                            ? Number(inputValue.replace(',', '.'))
                            : inputValue;

                        if (currentQuestion.answerType === 'number' && Number.isNaN(typedValue)) {
                            Alert.alert('Atenção', 'Informe um número válido.');
                            return;
                        }

                        handleAdvance(typedValue);
                    }}
                >
                    <Text style={Styles.nextButtonText}>{isSubmitting ? 'Aguarde...' : 'Próximo'}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={Styles.container}>
            <StatusBar translucent barStyle="light-content" />

            <View style={[Styles.header, { height: safeTop + headerSize, paddingTop: safeTop + 18, borderBottomLeftRadius: headerRadius, borderBottomRightRadius: headerRadius }]}>
                <TouchableOpacity style={[Styles.navButton, Styles.navButtonLeft, { top: safeTop + 20, width: navSize, height: navSize }]} onPress={handlePrevious} disabled={isSubmitting}>
                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity style={[Styles.navButton, Styles.navButtonRight, { opacity: 0.35, top: safeTop + 20, width: navSize, height: navSize }]} disabled>
                    <Ionicons name="chevron-forward" size={28} color="rgba(255,255,255,0.35)" />
                </TouchableOpacity>

                <View style={[Styles.headerIconContainer, { width: circleSize, height: circleSize, borderRadius: circleSize / 2, marginTop: clamp(winHeight * 0.05, 28, 60) }]}>
                    <Image source={module.image} style={[Styles.headerImage, { width: circleSize * 0.56, height: circleSize * 0.56 }]} resizeMode="contain" />
                </View>
            </View>

            <View style={Styles.content}>
                <ScrollView contentContainerStyle={Styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={Styles.questionCard}>
                        <Text style={Styles.questionIndex}>{questionIndex + 1}.</Text>
                        <Text style={Styles.questionText}>{currentQuestion.questionText.replace('{{month}}', selectedMonthLabel || 'o mês selecionado')}</Text>
                        {renderQuestionBody()}
                    </View>
                </ScrollView>
            </View>

            <Modal visible={blockVisible} transparent animationType="fade" onRequestClose={exitToMenu}>
                <View style={Styles.modalBackdrop}>
                    <View style={Styles.modalCard}>
                        <Ionicons name="alert-circle-outline" size={60} color="#E0323C" />
                        <Text style={Styles.modalTitle}>{module.blockTitle}</Text>
                        <Text style={Styles.modalMessage}>{blockMessage || module.blockMessage}</Text>
                        <Button title="Voltar ao menu" textColor="#FFF" width="100%" onPress={exitToMenu} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}