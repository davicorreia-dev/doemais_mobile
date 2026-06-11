import { useEffect, useState, useMemo } from 'react';
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QUIZ_MODULES, type FormGender, type QuizModule } from '../app/QuizFlow/quizData';
import styles from './StylesEligibily';

const normalizeGender = (value: string | null | undefined): FormGender => {
    if (!value) return 'M';
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

export default function EligibilityFormsScreen() {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    
    const [gender, setGender] = useState<FormGender>('M');

    useEffect(() => {
        async function loadUserGender() {
            try {
                const userData = await AsyncStorage.getItem('@doemais:user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setGender(normalizeGender(parsedUser.genero));
                }
            } catch (error) {
                console.error("Erro ao carregar usuário do AsyncStorage:", error);
            }
        }
        loadUserGender();
    }, []);

    const visibleForms = useMemo(() => {
        return DISPLAY_ORDER
            .map((key) => QUIZ_MODULES[key])
            .filter((module): module is QuizModule => Boolean(module))
            .filter((module) => isVisibleForGender(module, gender));
    }, [gender]);

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
                    {visibleForms.map((module) => (
                        <TouchableOpacity key={module.id} style={styles.card} activeOpacity={0.85} onPress={() => navigation.navigate('QuizScreen', { moduleId: module.id })}>
                            <View style={styles.cardIconWrap}>
                                <Image source={module.image} style={styles.cardIcon} resizeMode="contain" />
                            </View>

                            <View style={styles.cardBody}>
                                <Text style={styles.cardTitle}>{module.title}</Text>
                                <Text style={styles.cardDescription}>{module.description}</Text>
                            </View>

                            <Ionicons name="chevron-forward" size={24} color="#E0323C" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}