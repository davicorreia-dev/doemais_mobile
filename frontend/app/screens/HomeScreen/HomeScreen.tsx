import React from 'react';
import { View, Text, ScrollView, TextInput, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // Usando ícones padrão por enquanto
import Styles from './Styles';

export default function HomeScreen() {
    
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle="light-content" backgroundColor="#E0323C" />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                
                {/* --- HEADER VERMELHO --- */}
                <View style={Styles.headerContainer}>
                    <View style={Styles.headerTop}>
                        <View style={Styles.userInfo}>
                            {/* Placeholder para Foto */}
                            <View style={Styles.avatarPlaceholder}>
                                <Ionicons name="person" size={20} color="#E0323C" />
                            </View>
                            <View>
                                <Text style={Styles.userName}>João Souza</Text>
                                <View style={Styles.bloodTypeTag}>
                                    <Text style={Styles.bloodTypeText}>A+</Text>
                                </View>
                            </View>
                        </View>
                        <View style={Styles.headerIcons}>
                            <TouchableOpacity><Ionicons name="mail-outline" size={24} color="#333" style={{marginRight: 15}} /></TouchableOpacity>
                            <TouchableOpacity><Ionicons name="notifications-outline" size={24} color="#333" /></TouchableOpacity>
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