import { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Styles from './Styles';
import { QUIZ_MODULES, type QuizQuestion } from './quizData';

type RouteParams = {
    moduleId?: string;
};

function getBlockMessage(question: QuizQuestion, fallback: string) {
    return question.blockMessage || fallback;
}

export default function QuizScreen() {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
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

    const finishFlow = () => {
        Alert.alert(module.successTitle, module.successMessage, [
            { text: 'OK', onPress: () => navigation.goBack() },
        ]);
    };

    const exitToMenu = () => {
        setBlockVisible(false);
        setBlockMessage('');
        setQuestionIndex(0);
        setInputValue('');
        setSelectedMonthLabel('');
        navigation.goBack();
    };

    const openBlock = (message: string) => {
        setBlockVisible(true);
        setBlockMessage(message || module.blockMessage);
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

                return rule.blockValues.includes(answer)
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

        if (result.blocked) {
            openBlock(result.message);
            return;
        }

        if (questionIndex >= module.questions.length - 1) {
            finishFlow();
            return;
        }

        setQuestionIndex((value) => value + 1);
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
                    <TouchableOpacity style={Styles.answerButton} onPress={() => handleAdvance(true)}>
                        <Text style={Styles.answerButtonText}>Sim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.answerButton} onPress={() => handleAdvance(false)}>
                        <Text style={Styles.answerButtonText}>Não</Text>
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
                                        style={Styles.choiceSelectItem}
                                        onPress={() => {
                                            setSelectedMonthLabel(option.label);
                                            handleAdvance(option.value);
                                        }}
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
                            <TouchableOpacity style={Styles.radioRow} onPress={() => handleAdvance('SIM')}>
                                <View style={Styles.radioCircle} />
                                <Text style={Styles.radioLabel}>Sim</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={Styles.radioRow} onPress={() => handleAdvance('NAO_TENHO_CERTEZA')}>
                                <View style={Styles.radioCircle} />
                                <Text style={Styles.radioLabel}>Não tenho certeza</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            }

            return (
                <View style={Styles.choiceList}>
                    {currentQuestion.options.map((option) => (
                        <TouchableOpacity key={option.value} style={Styles.choiceButton} onPress={() => handleAdvance(option.value)}>
                            <Text style={Styles.choiceButtonText}>{option.label}</Text>
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
                    <Text style={Styles.nextButtonText}>Próximo</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={Styles.container}>
            <StatusBar backgroundColor="#E0323C" barStyle="light-content" />

            <View style={Styles.header}>
                <TouchableOpacity style={[Styles.navButton, Styles.navButtonLeft]} onPress={handlePrevious}>
                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity style={[Styles.navButton, Styles.navButtonRight, { opacity: 0.35 }]} disabled>
                    <Ionicons name="chevron-forward" size={28} color="rgba(255,255,255,0.35)" />
                </TouchableOpacity>

                <View style={Styles.headerIconContainer}>
                    <Image source={module.image} style={Styles.headerImage} resizeMode="contain" />
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
