import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // Usando ícones padrão por enquanto
import Styles from './StylesHome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';


export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const [userName, setUserName] = useState<string>('Carregando...');
    const [bloodType, setBloodType] = useState<string>('-');


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

                    if (response) {
                        if (response.nome) {
                            setUserName(response.nome);
                        }

                        if (response.tipo_sanguineo) {
                            setBloodType(response.tipo_sanguineo);
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

                    {/* Seção Visto Recentemente */}
                    <Text style={Styles.sectionTitle}>Visto Recentemente</Text>
                    <View style={Styles.recentCard}>
                        <View style={Styles.recentBadge}>
                            <Text style={Styles.recentBadgeText}>A+</Text>
                        </View>
                        <View>
                            <Text style={Styles.hospitalName}>Emergência A+ Sangue Urgente</Text>
                            <Text style={Styles.hospitalLocation}>🏥 Hospital Nome</Text>
                            <Text style={Styles.timeText}>🕒 10 Set 2025</Text>
                        </View>
                    </View>

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