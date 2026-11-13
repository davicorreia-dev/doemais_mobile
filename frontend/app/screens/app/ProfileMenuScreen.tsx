import { useEffect, useState } from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StatusBarBackground from '../../../components/StatusBarBackground';
import DesktopAppSidebar from '../../../components/DesktopAppSidebar';
import DesktopPageHeader from '../../../components/DesktopPageHeader';
import styles from './StylesProfileMenu';

type SettingsOptionProps = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    onPress: () => void;
};

function SettingsOption({ icon, title, description, onPress }: SettingsOptionProps) {
    return (
        <TouchableOpacity style={styles.option} onPress={onPress} accessibilityRole="button" accessibilityLabel={title}>
            <View style={styles.optionIcon}><Ionicons name={icon} size={21} color="#E0323C" /></View>
            <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{title}</Text>
                <Text style={styles.optionDescription}>{description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A19A92" />
        </TouchableOpacity>
    );
}

export default function ProfileMenuScreen({ navigation }: any) {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('@doemais:notifications_enabled')
            .then((value) => setNotificationsEnabled(value !== 'false'))
            .catch(() => undefined);
    }, []);

    const updateNotifications = async (enabled: boolean) => {
        setNotificationsEnabled(enabled);
        await AsyncStorage.setItem('@doemais:notifications_enabled', String(enabled));
    };

    return (
        <SafeAreaView style={[styles.screen, isDesktop && styles.desktopScreen]} edges={['top']}>
            <StatusBarBackground color="#E0323C" />
            {!isDesktop && <View style={styles.hero} />}
            {isDesktop && <DesktopAppSidebar name="Doador(a)" activeRoute="Mais" onNavigate={(route) => navigation.navigate(route)} />}
            <View style={isDesktop && styles.desktopMain}>
                {isDesktop && <DesktopPageHeader title="Configurações" subtitle="Gerencie seu perfil e suas preferências" />}
                <ScrollView contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]} showsVerticalScrollIndicator={false}>
                    {!isDesktop && <><Text style={styles.title}>Configurações</Text><Text style={styles.subtitle}>Gerencie sua conta e preferências</Text></>}

                <Text style={styles.sectionTitle}>CONTA</Text>
                <SettingsOption
                    icon="person-outline"
                    title="Meu perfil"
                    description="Foto, dados pessoais e tipo sanguíneo"
                    onPress={() => navigation.navigate('SettingsProfileScreen')}
                />
                <SettingsOption
                    icon="lock-closed-outline"
                    title="Segurança da conta"
                    description="Redefina sua senha de acesso"
                    onPress={() => navigation.navigate('ForgetPasswordScreen')}
                />

                <Text style={styles.sectionTitle}>PREFERÊNCIAS</Text>
                <View style={styles.option}>
                    <View style={styles.optionIcon}><Ionicons name="notifications-outline" size={21} color="#E0323C" /></View>
                    <View style={styles.optionText}>
                        <Text style={styles.optionTitle}>Notificações</Text>
                        <Text style={styles.optionDescription}>Lembretes e atualizações da triagem</Text>
                    </View>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={updateNotifications}
                        trackColor={{ false: '#DDD7CF', true: '#F2A6AB' }}
                        thumbColor={notificationsEnabled ? '#E0323C' : '#F7F7F7'}
                        accessibilityLabel="Ativar notificações"
                    />
                </View>

                <Text style={styles.sectionTitle}>SUPORTE</Text>
                <SettingsOption
                    icon="help-circle-outline"
                    title="Ajuda e suporte"
                    description="Tire dúvidas sobre doação e o aplicativo"
                    onPress={() => Alert.alert('Ajuda e suporte', 'Em breve você poderá falar diretamente com nossa equipe por aqui.')}
                />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
