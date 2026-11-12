import { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StatusBarBackground from '../../../components/StatusBarBackground';
import { api } from '../../services/api';
import styles from './StylesProfileMenu';

type Profile = { nome?: string; email?: string; tipo_sanguineo?: string };

export default function ProfileMenuScreen() {
    const navigation = useNavigation<any>();
    const [profile, setProfile] = useState<Profile>({});

    useFocusEffect(useCallback(() => {
        let active = true;

        const loadProfile = async () => {
            const storedUser = await AsyncStorage.getItem('@doemais:user');
            if (active && storedUser) setProfile(JSON.parse(storedUser));

            try {
                const response = await api('/api/doadores/me', 'GET', undefined, false, true);
                const data = response.data || response;
                if (active && data) setProfile(data);
            } catch {
                // O perfil salvo localmente continua disponível sem conexão.
            }
        };

        void loadProfile();
        return () => { active = false; };
    }, []));

    const initial = profile.nome?.trim().charAt(0).toUpperCase() || 'D';

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            <StatusBarBackground color="#E0323C" />
            <View style={styles.hero} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Mais</Text>
                <Text style={styles.subtitle}>Sua conta e preferências</Text>

                <View style={styles.profileSummary}>
                    <View style={styles.avatar}><Text style={styles.avatarText}>{initial}</Text></View>
                    <View style={styles.profileText}>
                        <Text style={styles.name} numberOfLines={1}>{profile.nome || 'Doador(a)'}</Text>
                        <Text style={styles.email} numberOfLines={1}>{profile.email || 'Gerencie seus dados pessoais'}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>CONTA</Text>
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => navigation.navigate('SettingsProfileScreen')}
                    accessibilityRole="button"
                    accessibilityLabel="Editar informações do perfil"
                >
                    <View style={styles.optionIcon}><Ionicons name="person-outline" size={21} color="#E0323C" /></View>
                    <View style={styles.optionText}>
                        <Text style={styles.optionTitle}>Informações do perfil</Text>
                        <Text style={styles.optionDescription}>Nome, telefone, cidade e tipo sanguíneo</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#A19A92" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.option}
                    onPress={() => navigation.navigate('ProfileSetupPhotoScreen')}
                    accessibilityRole="button"
                    accessibilityLabel="Alterar foto do perfil"
                >
                    <View style={styles.optionIcon}><Ionicons name="camera-outline" size={21} color="#E0323C" /></View>
                    <View style={styles.optionText}>
                        <Text style={styles.optionTitle}>Foto do perfil</Text>
                        <Text style={styles.optionDescription}>Escolha ou atualize sua foto</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#A19A92" />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
