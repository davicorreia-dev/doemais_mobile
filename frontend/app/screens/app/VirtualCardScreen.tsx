import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { api } from '../../services/api';

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
                        const [profileResponse, triageResponse] = await Promise.all([
                            api('/api/doadores/me', 'GET'),
                            api('/api/doadores/triagens/atual', 'GET'),
                        ]);
                        const remoteProfile = profileResponse.data || profileResponse;
                        const latestTriages = triageResponse.data || triageResponse;
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
            <SafeAreaView style={styles.centered} edges={['top']}>
                <ActivityIndicator color="#E0323C" size="large" />
            </SafeAreaView>
        );
    }

    if (!approvalDate) {
        return (
            <SafeAreaView style={styles.emptyScreen} edges={['top']}>
                <View style={styles.emptyIcon}>
                    <Ionicons name="card-outline" size={42} color="#E0323C" />
                </View>
                <Text style={styles.emptyTitle}>Sua carteirinha estará aqui</Text>
                <Text style={styles.emptyText}>
                    Conclua a triagem final com sucesso para liberar sua carteirinha virtual.
                </Text>
            </SafeAreaView>
        );
    }

    const bloodType = profile.tipo_sanguineo && profile.tipo_sanguineo !== 'NDA'
        ? profile.tipo_sanguineo
        : '—';

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Carteirinha virtual</Text>
                <Text style={styles.subtitle}>Seu comprovante de triagem DoeMais</Text>

                <View style={styles.card}>
                    <View style={styles.cardGlowTop} />
                    <View style={styles.cardGlowBottom} />

                    <View style={styles.brandRow}>
                        <View style={styles.brandIcon}>
                            <Ionicons name="water" size={23} color="#E0323C" />
                        </View>
                        <Text style={styles.brand}>DOE+MAIS</Text>
                        <Ionicons name="shield-checkmark" size={24} color="#FFF" />
                    </View>

                    <View style={styles.cardMain}>
                        <View>
                            <Text style={styles.fieldLabel}>DOADOR(A)</Text>
                            <Text style={styles.name} numberOfLines={2}>{profile.nome || 'Doador(a)'}</Text>
                        </View>
                        <View style={styles.bloodBadge}>
                            <Ionicons name="water" size={19} color="#E0323C" />
                            <Text style={styles.bloodType}>{bloodType}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.cardFooter}>
                        <View>
                            <Text style={styles.fieldLabel}>TRIAGEM CONCLUÍDA EM</Text>
                            <Text style={styles.date}>{formatApprovalDate(approvalDate)}</Text>
                        </View>
                        <View style={styles.approvedSeal}>
                            <Ionicons name="checkmark-circle" size={18} color="#22753A" />
                            <Text style={styles.approvedText}>APTO(A)</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.notice}>
                    <Ionicons name="information-circle-outline" size={21} color="#A12C34" />
                    <Text style={styles.noticeText}>
                        Esta carteirinha registra a aprovação no questionário de triagem e não substitui a avaliação presencial do hemocentro.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FDF8F8' },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDF8F8' },
    content: { padding: 24, paddingBottom: 36 },
    title: { color: '#262124', fontSize: 27, fontFamily: 'Lexend_700Bold', marginTop: 12 },
    subtitle: { color: '#746B6D', fontSize: 14, fontFamily: 'Lexend_400Regular', marginTop: 6, marginBottom: 28 },
    card: { minHeight: 280, overflow: 'hidden', borderRadius: 26, backgroundColor: '#E0323C', padding: 24, shadowColor: '#A51620', shadowOpacity: 0.28, shadowOffset: { width: 0, height: 12 }, shadowRadius: 18, elevation: 9 },
    cardGlowTop: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(255,255,255,0.10)', right: -110, top: -135 },
    cardGlowBottom: { position: 'absolute', width: 190, height: 190, borderRadius: 95, backgroundColor: 'rgba(117,0,9,0.16)', left: -85, bottom: -105 },
    brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
    brandIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
    brand: { flex: 1, color: '#FFF', fontSize: 15, letterSpacing: 1.3, fontFamily: 'Lexend_700Bold' },
    cardMain: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 34, gap: 12 },
    fieldLabel: { color: 'rgba(255,255,255,0.76)', fontSize: 10, letterSpacing: 0.9, fontFamily: 'Lexend_500Medium' },
    name: { maxWidth: 210, color: '#FFF', fontSize: 22, lineHeight: 28, fontFamily: 'Lexend_700Bold', marginTop: 7 },
    bloodBadge: { minWidth: 73, minHeight: 73, borderRadius: 21, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
    bloodType: { color: '#D52B35', fontSize: 25, fontFamily: 'Lexend_700Bold', marginTop: 1 },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.32)', marginVertical: 20 },
    cardFooter: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 },
    date: { color: '#FFF', fontSize: 13, fontFamily: 'Lexend_500Medium', marginTop: 6, textTransform: 'capitalize' },
    approvedSeal: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: '#E8F7EB' },
    approvedText: { color: '#22753A', fontSize: 10, letterSpacing: 0.5, fontFamily: 'Lexend_700Bold' },
    notice: { flexDirection: 'row', gap: 10, padding: 16, marginTop: 25, borderRadius: 16, backgroundColor: '#FCE9EA' },
    noticeText: { flex: 1, color: '#752C31', fontSize: 12, lineHeight: 18, fontFamily: 'Lexend_400Regular' },
    emptyScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDF8F8', padding: 34 },
    emptyIcon: { width: 86, height: 86, borderRadius: 43, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FCE9EA', marginBottom: 20 },
    emptyTitle: { color: '#30282A', fontSize: 21, textAlign: 'center', fontFamily: 'Lexend_700Bold' },
    emptyText: { color: '#746B6D', fontSize: 14, lineHeight: 21, textAlign: 'center', fontFamily: 'Lexend_400Regular', marginTop: 9 },
});
