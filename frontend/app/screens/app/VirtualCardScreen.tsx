import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { api } from '../../services/api';
import StatusBarBackground from '../../../components/StatusBarBackground';
import VirtualDonorCard from '../../../components/VirtualDonorCard';
import VirtualCardNotice from '../../../components/VirtualCardNotice';
import DesktopAppSidebar from '../../../components/DesktopAppSidebar';
import DesktopPageHeader from '../../../components/DesktopPageHeader';
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
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;
    const navigation = useNavigation<any>();
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
            <SafeAreaView style={[Styles.centered, isDesktop && Styles.desktopScreen]} edges={['top']}>
                {isDesktop && <DesktopAppSidebar name="Doador(a)" activeRoute="Carteirinha" onNavigate={(route) => navigation.navigate(route)} />}
                <View style={Styles.loadingBody}><ActivityIndicator color="#E0323C" size="large" /></View>
            </SafeAreaView>
        );
    }

    if (!approvalDate) {
        return (
            <SafeAreaView style={[Styles.emptyScreen, isDesktop && Styles.desktopScreen]} edges={['top']}>
                <StatusBar barStyle="light-content" />
                <StatusBarBackground color="#E0323C" />
                {!isDesktop && <View style={Styles.hero} />}
                {isDesktop && <DesktopAppSidebar name={profile.nome || 'Doador(a)'} activeRoute="Carteirinha" onNavigate={(route) => navigation.navigate(route)} />}
                <View style={[Styles.emptyBody, isDesktop && Styles.emptyBodyDesktop]}>
                    <View style={Styles.emptyIcon}>
                        <Ionicons name="card-outline" size={42} color="#E0323C" />
                    </View>
                    <Text style={Styles.emptyTitle}>Sua carteirinha estará aqui</Text>
                    <Text style={Styles.emptyText}>
                        Conclua a triagem final com sucesso para liberar sua carteirinha virtual.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const bloodType = profile.tipo_sanguineo && profile.tipo_sanguineo !== 'NDA'
        ? profile.tipo_sanguineo
        : '—';

    return (
        <SafeAreaView style={[Styles.screen, isDesktop && Styles.desktopScreen]} edges={['top']}>
            <StatusBar barStyle="light-content" />
            <StatusBarBackground color="#E0323C" />
            {!isDesktop && <View style={Styles.hero} />}
            {isDesktop && <DesktopAppSidebar name={profile.nome || 'Doador(a)'} activeRoute="Carteirinha" onNavigate={(route) => navigation.navigate(route)} />}
            <View style={Styles.mainContent}>
                {isDesktop && <DesktopPageHeader title="Carteirinha virtual" subtitle="Seu resultado de triagem DoeMais" />}
                <ScrollView contentContainerStyle={[Styles.content, isDesktop && Styles.contentDesktop]} showsVerticalScrollIndicator={false}>
                    <View style={[Styles.pageHeading, isDesktop && Styles.pageHeadingDesktop, isDesktop && { display: 'none' }]}>
                        <Text style={[Styles.title, isDesktop && Styles.titleDesktop]}>Carteirinha virtual</Text>
                        <Text style={[Styles.subtitle, isDesktop && Styles.subtitleDesktop]}>Seu resultado de triagem DoeMais</Text>
                    </View>
                    <View style={[Styles.cardColumn, isDesktop && Styles.cardColumnDesktop]}>
                        <VirtualDonorCard
                            name={profile.nome || 'Doador(a)'}
                            bloodType={bloodType}
                            approvalDate={formatApprovalDate(approvalDate)}
                            underReview={underReview}
                            desktop={isDesktop}
                        />
                        <VirtualCardNotice underReview={underReview} desktop={isDesktop} />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
