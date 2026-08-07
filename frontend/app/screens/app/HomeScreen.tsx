import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // Usando ícones padrão por enquanto
import Styles from './StylesHome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';

interface NewsItem {
    id: string;
    title: string;
    description: string;
    location: string;
    bloodTypeNeeded?: string;
    date: string;
    category: 'Pedido' | 'Notícia';
    source?: string;
}

const NEWS_DATABASE: NewsItem[] = [
    {
        id: '1',
        title: 'Urgente: Pedido para cirurgia cardíaca',
        description: 'Paciente internado no IMIP necessita de doadores de qualquer tipo sanguíneo, preferencialmente O- e O+.',
        location: 'IMIP - Recife, PE',
        bloodTypeNeeded: 'O-',
        date: 'Hoje',
        category: 'Pedido',
        source: 'Família do Paciente'
    },
    {
        id: '2',
        title: 'Estoque do HEMOPE em estado crítico',
        description: 'O hemocentro de Pernambuco convoca doadores de todos os tipos sanguíneos para repor estoques antes do feriado.',
        location: 'HEMOPE - Recife, PE',
        bloodTypeNeeded: 'Todos',
        date: 'Ontem',
        category: 'Pedido',
        source: 'HEMOPE'
    },
    {
        id: '3',
        title: 'Campanha de Doação para o Instituto do Câncer',
        description: 'Estamos recebendo doações de plaquetas e sangue total para pacientes em tratamento oncológico.',
        location: 'ICESP - São Paulo, SP',
        bloodTypeNeeded: 'A+ / B-',
        date: 'Hoje',
        category: 'Pedido',
        source: 'Instituto do Câncer'
    },
    {
        id: '4',
        title: 'Pedido de sangue A- para recém-nascido',
        description: 'Necessitamos de doadores de sangue tipo A Negativo para transfusão em bebê na UTI Neonatal do Pro Matre.',
        location: 'Maternidade Pro Matre - São Paulo, SP',
        bloodTypeNeeded: 'A-',
        date: 'Ontem',
        category: 'Pedido',
        source: 'Maternidade Pro Matre'
    },
    {
        id: '5',
        title: 'Hemorio realiza coleta externa na Cinelândia',
        description: 'Unidade móvel do Hemorio estará na praça recolhendo doações para a campanha de inverno.',
        location: 'Hemorio - Rio de Janeiro, RJ',
        bloodTypeNeeded: 'Todos',
        date: 'Hoje',
        category: 'Pedido',
        source: 'Hemorio'
    },
    {
        id: '6',
        title: 'Campanha de Doação para o Hospital Copa D’Or',
        description: 'Paciente necessita urgentemente de doações de sangue tipo AB+ para cirurgia de grande porte.',
        location: 'Hospital Copa D’Or - Rio de Janeiro, RJ',
        bloodTypeNeeded: 'AB+',
        date: '2 dias atrás',
        category: 'Pedido',
        source: 'Família do Paciente'
    },
    {
        id: '7',
        title: 'Estoque de sangue no Hemominas atinge nível de alerta',
        description: 'O Hemocentro de Minas Gerais solicita a presença de doadores de tipo O- para atendimento emergencial.',
        location: 'Hemominas - Belo Horizonte, MG',
        bloodTypeNeeded: 'O-',
        date: 'Hoje',
        category: 'Pedido',
        source: 'Hemominas'
    },
    {
        id: '100',
        title: 'Como se preparar para a sua primeira doação de sangue',
        description: 'Dicas de alimentação, sono e hidratação para garantir que sua experiência de doação seja tranquila e segura.',
        location: 'Nacional',
        date: '3 dias atrás',
        category: 'Notícia',
        source: 'Ministério da Saúde'
    },
    {
        id: '101',
        title: 'Benefícios de doar sangue para a saúde do doador',
        description: 'Estudos indicam que doar sangue ajuda na renovação das células sanguíneas e reduz riscos de doenças cardíacas.',
        location: 'Nacional',
        date: '4 dias atrás',
        category: 'Notícia',
        source: 'OMS'
    },
    {
        id: '102',
        title: 'Importância da doação regular: por que doar mais de uma vez?',
        description: 'O sangue doado tem prazo de validade curto. Para plaquetas, dura apenas 5 dias. Por isso, a regularidade salva vidas.',
        location: 'Nacional',
        date: '5 dias atrás',
        category: 'Notícia',
        source: 'Campanha Nacional'
    }
];


export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const [userName, setUserName] = useState<string>('Carregando...');
    const [bloodType, setBloodType] = useState<string>('-');
    const [userCity, setUserCity] = useState<string>('');
    const [externalNews, setExternalNews] = useState<NewsItem[]>([]);

    useEffect(() => {
        async function fetchExternalNews() {
            try {
                const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://g1.globo.com/rss/g1/ciencia-e-saude/');
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === 'ok' && Array.isArray(data.items)) {
                        const parsedItems: NewsItem[] = data.items.slice(0, 5).map((item: any, idx: number) => {
                            const cleanDesc = item.description 
                                ? item.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() 
                                : 'Acesse a notícia completa para saber mais.';
                            return {
                                id: `g1-${idx}`,
                                title: item.title,
                                description: cleanDesc,
                                location: 'G1 Saúde',
                                date: 'Recente',
                                category: 'Notícia',
                                source: 'G1'
                            };
                        });
                        setExternalNews(parsedItems);
                    }
                }
            } catch (err) {
                console.log("Erro ao buscar notícias externas do G1:", err);
            }
        }
        fetchExternalNews();
    }, []);

    const filteredNews = useMemo(() => {
        const allRequests = NEWS_DATABASE.filter(item => item.category === 'Pedido');
        const globalNews = externalNews.length > 0 ? externalNews : NEWS_DATABASE.filter(item => item.category === 'Notícia');

        if (!userCity) {
            return [...allRequests, ...globalNews];
        }

        const cityPrefix = userCity.split(' - ')[0].toLowerCase().trim();
        const localRequests = allRequests.filter(item => 
            item.location.toLowerCase().includes(cityPrefix)
        );

        const otherRequests = allRequests.filter(item => 
            !item.location.toLowerCase().includes(cityPrefix)
        );

        if (localRequests.length > 0) {
            return [...localRequests, ...globalNews, ...otherRequests];
        } else {
            return [...otherRequests, ...globalNews];
        }
    }, [userCity, externalNews]);


    useFocusEffect(
        useCallback(() => {
            async function loadProfileData() {
                try {
                    // 1. Carrega a imagem
                    const savedUri = await AsyncStorage.getItem('@profile_image');
                    if (savedUri) {
                        setProfileImage(savedUri);
                    } else {
                        setProfileImage(null);
                    }

                    // 2. Busca os dados reais do backend (igual na tela de configurações)
                    const response = await api('/api/doadores/me', 'GET');

                    // A API retorna os dados dentro da propriedade 'data'
                    const userData = response.data || response;

                    if (userData) {
                        if (userData.nome) {
                            setUserName(userData.nome);
                        }

                        if (userData.tipo_sanguineo) {
                            setBloodType(userData.tipo_sanguineo);
                        }

                        if (userData.cidade) {
                            setUserCity(userData.cidade);
                        }
                    }
                } catch (error) {
                    console.log("Erro ao carregar dados do perfil:", error);
                }
            }
            loadProfileData();
        }, [])
    );

    // Dados mocados para o layout
    const bloodTypes = ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'];
    const stats = [
        { label: 'Doadores', value: '2K+', color: '#E0323C' },
        { label: 'Vidas Salvas', value: '13', color: '#999' },
        { label: 'Post diário', value: '20', color: '#8C6E6E' },
        { label: 'Doadores', value: '1K+', color: '#E0323C' },
        { label: 'Vidas Salvas', value: '7', color: '#555' },
        { label: 'Publicações', value: '20', color: '#3E2C2C' },
    ];


    const handleLogout = async () => {
        try {
            const refreshToken = await AsyncStorage.getItem('@doemais:refreshToken');
            if (refreshToken) {
                // Invalida o token no backend
                await api('/api/auth/logout', 'POST', { refreshToken });
            }
        } catch (error) {
            console.error("Erro ao fazer logout no servidor:", error);
        } finally {
            // Limpa tudo localmente independentemente do sucesso da API
            await AsyncStorage.removeItem('@doemais:token');
            await AsyncStorage.removeItem('@doemais:refreshToken');
            await AsyncStorage.removeItem('@doemais:user');

            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle="light-content" backgroundColor="#E0323C" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{}}>

                {/* --- HEADER VERMELHO --- */}
                <View style={Styles.headerContainer}>
                    <View style={Styles.headerTop}>
                        <View style={Styles.userInfo}>
                            {/* Placeholder para Foto ou Foto Real com navegação */}
                            <TouchableOpacity onPress={() => navigation.navigate('SettingsProfileScreen')}>
                                {profileImage ? (
                                    <Image source={{ uri: profileImage }} style={Styles.avatarPlaceholder} />
                                ) : (
                                    <View style={Styles.avatarPlaceholder}>
                                        <Ionicons name="person" size={20} color="#E0323C" />
                                    </View>
                                )}
                            </TouchableOpacity>
                            <View>
                                <Text style={Styles.userName}>{userName}</Text>
                                <View style={Styles.bloodTypeTag}>
                                    <Text style={Styles.bloodTypeText}>{bloodType}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={Styles.headerIcons}>
                            <TouchableOpacity><Ionicons name="mail-outline" size={24} color="#333" style={{ marginRight: 0 }} /></TouchableOpacity>
                            <TouchableOpacity onPress={handleLogout}><Ionicons name="log-out-outline" size={24} color="#333" style={{ marginRight: 0 }} />
                            </TouchableOpacity>

                        </View>
                    </View>

                    {/* Barra de Busca */}
                    <View style={Styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
                        <TextInput
                            placeholder="Buscar Sangue"
                            style={Styles.searchInput}
                        />
                    </View>
                </View>

                {/* --- CONTEÚDO --- */}
                <View style={Styles.contentContainer}>

                    {/* Seção Atividades */}
                    <Text style={Styles.sectionTitle}>Atividades</Text>
                    <View style={Styles.activitiesGrid}>
                        <ActivityCard icon="water" label="Doador de Sangue" />
                        <ActivityCard icon="hand-holding-heart" label="Receber Sangue" />
                        <ActivityCard icon="tint" label="Criar publicação" color="#E0323C" />
                        <ActivityCard icon="notes-medical" label="Sangue Doado" />
                    </View>

                    {/* Seção Grupo Sanguíneo */}
                    <Text style={Styles.sectionTitle}>Grupo sanguíneo</Text>
                    <View style={Styles.bloodGrid}>
                        {bloodTypes.map((type) => (
                            <TouchableOpacity key={type} style={Styles.bloodButton}>
                                <Text style={Styles.bloodButtonText}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Seção de Notícias e Pedidos de Sangue */}
                    <Text style={Styles.sectionTitle}>Notícias e Pedidos de Sangue</Text>
                    {userCity ? (
                        <Text style={{ fontSize: 12, color: '#666', marginTop: -10, marginBottom: 12 }}>
                            Pedidos em: <Text style={{ fontWeight: 'bold', color: '#E0323C' }}>{userCity}</Text>
                        </Text>
                    ) : (
                        <Text style={{ fontSize: 12, color: '#999', marginTop: -10, marginBottom: 12 }}>
                            Defina seu CEP no Perfil para ver pedidos da sua região.
                        </Text>
                    )}

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 10, gap: 15 }}
                    >
                        {filteredNews.map((item) => (
                            <View key={item.id} style={Styles.newsCard}>
                                <View style={Styles.newsHeader}>
                                    <View style={[
                                        Styles.categoryBadge,
                                        { backgroundColor: item.category === 'Pedido' ? '#FFF0F0' : '#E8F5E9' }
                                    ]}>
                                        <Text style={[
                                            Styles.categoryText,
                                            { color: item.category === 'Pedido' ? '#E0323C' : '#2E7D32' }
                                        ]}>
                                            {item.category}
                                        </Text>
                                    </View>
                                    {item.bloodTypeNeeded && (
                                        <View style={Styles.bloodBadge}>
                                            <Text style={Styles.bloodBadgeText}>{item.bloodTypeNeeded}</Text>
                                        </View>
                                    )}
                                </View>

                                <Text style={Styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                                <Text style={Styles.newsDescription} numberOfLines={3}>{item.description}</Text>
                                
                                <View style={Styles.newsFooter}>
                                    <Text style={Styles.newsLocation}>📍 {item.location}</Text>
                                    <Text style={Styles.newsDate}>🕒 {item.date}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Seção Nossa Contribuição */}
                    <Text style={Styles.sectionTitle}>Nossa Contribuição</Text>
                    <View style={Styles.statsGrid}>
                        {stats.map((stat, index) => (
                            <View key={index} style={[Styles.statCard, { backgroundColor: stat.color }]}>
                                <Text style={Styles.statValue}>{stat.value}</Text>
                                <Text style={Styles.statLabel}>{stat.label}</Text>
                            </View>
                        ))}
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Pequeno componente auxiliar para os botões de atividade
const ActivityCard = ({ icon, label, color = '#f5f5f5' }: any) => (
    <TouchableOpacity style={Styles.activityCard}>
        <View style={[Styles.activityIconContainer, { backgroundColor: color === '#E0323C' ? '#FFF' : '#FFF0F0' }]}>
            <FontAwesome5 name={icon} size={20} color={color === '#E0323C' ? '#E0323C' : '#E0323C'} />
        </View>
        <Text style={Styles.activityLabel}>{label}</Text>
    </TouchableOpacity>
);