import { useMemo } from 'react';
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { QUIZ_MODULES, type FormGender, type QuizModule } from '../app/QuizFlow/quizData';
import styles from './StylesEligibily';

type AuthGender = 'M' | 'F' | 'MALE' | 'FEMALE';

const MOCK_USER_GENDER: AuthGender = 'F';

const useAuth = () => ({
    user: {
        genero: MOCK_USER_GENDER,
    },
});

const normalizeGender = (value: AuthGender): FormGender => {
    if (value === 'M' || value === 'MALE') {
        return 'M';
    }

    if (value === 'F' || value === 'FEMALE') {
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
    const { user } = useAuth();
    const gender = normalizeGender(user.genero);

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
