import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StatusBar, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { api } from '../../services/api';
import StatusBarBackground from '../../../components/StatusBarBackground';
import Styles from './StylesVirtualCard';

type Profile = {
    nome?: string;
    tipo_sanguineo?: string;
};

type QuizHistory = Record<string, { status?: string; date?: number }>;

const FINAL_TRIAGE_IDS = ['TRIAGEM_HOMEM', 'TRIAGEM_MULHER'];

const formatApprovalDate = (timestamp?: number) => {
    if (!timestamp) return '';

    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(timestamp));
};

export default function VirtualCardScreen() {
    const [profile, setProfile] = useState<Profile>({});
    const [approvalDate, setApprovalDate] = useState<number | null>(null);
    const [underReview, setUnderReview] = useState(false);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let active = true;

            const loadCard = async () => {
                setLoading(true);

                try {
                    const savedUserRaw = await AsyncStorage.getItem('@doemais:user');
                    const savedUser = savedUserRaw ? JSON.parse(savedUserRaw) : null;
                    const userId = savedUser?.id;

                    if (active && savedUser) {
                        setProfile({
                            nome: savedUser.nome,
                            tipo_sanguineo: savedUser.tipo_sanguineo,
                        });
                    }

                    if (userId) {
                        const historyRaw = await AsyncStorage.getItem(`@doemais:quiz_history:${userId}`);
                        const history: QuizHistory = historyRaw ? JSON.parse(historyRaw) : {};
                        const approvedTriage = FINAL_TRIAGE_IDS
                            .map((id) => history[id])
                            .find((item) => item?.status === 'approved');

                        if (active) {
                            setApprovalDate(approvedTriage?.date ?? null);
                        }
                    } else if (active) {
                        setApprovalDate(null);
                    }

                    try {
                        const [profileResponse, triageResponse, correctionsResponse] = await Promise.all([
                            api('/api/doadores/me', 'GET'),
                            api('/api/doadores/triagens/atual', 'GET', undefined, false, true),
                            api('/api/doadores/correcoes', 'GET', undefined, false, true),
                        ]);
                        const remoteProfile = profileResponse.data || profileResponse;
                        const latestTriages = triageResponse.data || triageResponse;
                        const corrections = correctionsResponse.data || correctionsResponse;
                        const persistedFinalTriage = FINAL_TRIAGE_IDS
                            .map((id) => latestTriages?.[id])
                            .find((result) => result?.status === 'approved');

                        if (active && remoteProfile) {
                            setProfile({
                                nome: remoteProfile.nome || savedUser?.nome,
                                tipo_sanguineo: remoteProfile.tipo_sanguineo || savedUser?.tipo_sanguineo,
                            });
                        }

                        if (active && persistedFinalTriage?.data_preenchimento) {
                            setApprovalDate(new Date(persistedFinalTriage.data_preenchimento).getTime());
                        }
                        if (active) {
                            setUnderReview(Array.isArray(corrections) && corrections.some((item: any) =>
                                item.status === 'PENDING_REVIEW' && FINAL_TRIAGE_IDS.includes(item.modulo)
                            ));
                        }
                    } catch (error) {
                        console.error('Erro ao carregar perfil para a carteirinha:', error);
                    }
                } catch (error) {
                    console.error('Erro ao carregar a carteirinha:', error);
                } finally {
                    if (active) setLoading(false);
                }
            };

            loadCard();

            return () => {
                active = false;
            };
        }, [])
    );

    if (loading) {
        return (
            <SafeAreaView style={Styles.centered} edges={['top']}>
                <ActivityIndicator color="#E0323C" size="large" />
            </SafeAreaView>
        );
    }

    if (!approvalDate) {
        return (
            <SafeAreaView style={Styles.emptyScreen} edges={['top']}>
                <StatusBar barStyle="light-content" />
                <StatusBarBackground color="#E0323C" />
                <View style={Styles.hero} />
                <View style={Styles.emptyIcon}>
                    <Ionicons name="card-outline" size={42} color="#E0323C" />
                </View>
                <Text style={Styles.emptyTitle}>Sua carteirinha estará aqui</Text>
                <Text style={Styles.emptyText}>
                    Conclua a triagem final com sucesso para liberar sua carteirinha virtual.
                </Text>
            </SafeAreaView>
        );
    }

    const bloodType = profile.tipo_sanguineo && profile.tipo_sanguineo !== 'NDA'
        ? profile.tipo_sanguineo
        : '—';

    return (
        <SafeAreaView style={Styles.screen} edges={['top']}>
            <StatusBar barStyle="light-content" />
            <StatusBarBackground color="#E0323C" />
            <View style={Styles.hero} />
            <ScrollView contentContainerStyle={Styles.content} showsVerticalScrollIndicator={false}>
                <Text style={Styles.title}>Carteirinha virtual</Text>
                <Text style={Styles.subtitle}>Seu resultado de triagem DoeMais</Text>

                <View style={Styles.card}>
                    <View style={Styles.cardAccent} />
                    <View style={Styles.brandRow}>
                            <View style={Styles.brandLogoWrap}>
                                <Image
                                    source={require('../../../assets/images/doe-logo.png')}
                                    style={Styles.brandLogo}
                                    resizeMode="contain"
                                />
                        </View>
                        <Text style={Styles.cardType}>CARTEIRINHA DIGITAL</Text>
                    </View>

                    <View style={Styles.cardMain}>
                        <View>
                            <Text style={Styles.fieldLabel}>DOADOR(A)</Text>
                            <Text style={Styles.name} numberOfLines={2}>{profile.nome || 'Doador(a)'}</Text>
                        </View>
                        <View style={Styles.bloodBadge}>
                            <Ionicons name="water" size={19} color="#E0323C" />
                            <Text style={Styles.bloodType}>{bloodType}</Text>
                        </View>
                    </View>

                    <View style={Styles.divider} />

                    <View style={Styles.cardFooter}>
                        <View>
                            <Text style={Styles.fieldLabel}>TRIAGEM CONCLUÍDA EM</Text>
                            <Text style={Styles.date}>{formatApprovalDate(approvalDate)}</Text>
                        </View>
                        <View style={[Styles.approvedSeal, underReview && Styles.reviewSeal]}>
                            <Ionicons name={underReview ? "time" : "checkmark-circle"} size={18} color={underReview ? "#8A5A13" : "#22753A"} />
                            <Text style={[Styles.approvedText, underReview && Styles.reviewText]}>{underReview ? 'EM REVISÃO' : 'APTO(A)'}</Text>
                        </View>
                    </View>
                </View>

                <View style={Styles.notice}>
                    <Ionicons name="information-circle-outline" size={21} color="#A12C34" />
                    <Text style={Styles.noticeText}>
                        {underReview
                            ? 'Uma correção foi enviada. Aguarde a revisão do hemocentro antes de usar esta carteirinha.'
                            : 'Esta carteirinha registra a aprovação no questionário de triagem e não substitui a avaliação presencial do hemocentro.'}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
