import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../HomeScreen';
import EligibilityFormsScreen from '../../onboarding/EligibilityFormsScreen';
import VirtualCardScreen from '../VirtualCardScreen';
import ProfileMenuScreen from '../ProfileMenuScreen';
import { QUIZ_MODULES, type FormGender } from '../QuizFlow/quizData';
import { api } from '../../../services/api';
import styles from './Styles';

const Tab = createBottomTabNavigator();
const FINAL_TRIAGE_IDS = ['TRIAGEM_HOMEM', 'TRIAGEM_MULHER'];

const normalizeGender = (value?: string | null): FormGender => {
    const gender = value?.toUpperCase();
    if (gender === 'M' || gender === 'MALE' || gender === 'MASCULINO') return 'M';
    if (gender === 'F' || gender === 'FEMALE' || gender === 'FEMININO') return 'F';
    return 'ALL';
};

type TabIconProps = {
    routeName: string;
    focused: boolean;
    color: string;
    size: number;
    cardUnlocked: boolean;
};

function TabIcon({ routeName, focused, color, size, cardUnlocked }: TabIconProps) {
    const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;
    const isEligibility = routeName === 'Elegibilidade';
    const isLockedCard = routeName === 'Carteirinha' && !cardUnlocked;

    useEffect(() => {
        Animated.spring(progress, {
            toValue: focused ? 1 : 0,
            speed: 18,
            bounciness: 7,
            useNativeDriver: true,
        }).start();
    }, [focused, progress]);

    let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
    if (routeName === 'Início') iconName = focused ? 'home' : 'home-outline';
    if (routeName === 'Elegibilidade') iconName = focused ? 'clipboard' : 'clipboard-outline';
    if (routeName === 'Carteirinha') iconName = isLockedCard ? 'lock-closed-outline' : focused ? 'card' : 'card-outline';
    if (routeName === 'Mais') iconName = focused ? 'settings' : 'settings-outline';

    const iconColor = isLockedCard ? '#A8A29A' : focused ? '#FFF' : color;
    const animatedStyle = {
        transform: [
            { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) },
            { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) },
        ],
    };

    return (
        <Animated.View style={[
            styles.iconWrap,
            isEligibility && styles.primaryIconWrap,
            focused && styles.iconWrapActive,
            isEligibility && focused && styles.primaryIconWrapActive,
            isLockedCard && styles.iconWrapLocked,
            animatedStyle,
        ]}>
            <Ionicons name={iconName} size={isEligibility ? 23 : size} color={iconColor} />
        </Animated.View>
    );
}

export default function MainTabs() {
    const [remainingForms, setRemainingForms] = useState(0);
    const [hasPendingReview, setHasPendingReview] = useState(false);
    const [cardUnlocked, setCardUnlocked] = useState(false);

    const loadTabStatus = useCallback(async () => {
        try {
            const savedUserRaw = await AsyncStorage.getItem('@doemais:user');
            const savedUser = savedUserRaw ? JSON.parse(savedUserRaw) : null;
            const historyRaw = savedUser?.id
                ? await AsyncStorage.getItem(`@doemais:quiz_history:${savedUser.id}`)
                : null;
            const localTriages = historyRaw ? JSON.parse(historyRaw) : {};
            const [profileResponse, triageResponse, correctionsResponse] = await Promise.all([
                api('/api/doadores/me', 'GET', undefined, false, true).catch(() => null),
                api('/api/doadores/triagens/atual', 'GET', undefined, false, true).catch(() => null),
                api('/api/doadores/correcoes', 'GET', undefined, false, true).catch(() => null),
            ]);

            const profile = profileResponse?.data || profileResponse || savedUser;
            const triages = { ...localTriages, ...(triageResponse?.data || triageResponse || {}) };
            const corrections = correctionsResponse?.data || correctionsResponse || [];
            const gender = normalizeGender(profile?.genero);
            const visibleModules = Object.values(QUIZ_MODULES).filter((module) => module.visibleFor === 'ALL' || module.visibleFor === gender);

            setRemainingForms(visibleModules.filter((module) => !triages?.[module.id]).length);
            setCardUnlocked(FINAL_TRIAGE_IDS.some((id) => triages?.[id]?.status === 'approved'));
            setHasPendingReview(Array.isArray(corrections) && corrections.some((item: any) =>
                item.status === 'PENDING_REVIEW' && FINAL_TRIAGE_IDS.includes(item.modulo)
            ));
        } catch (error) {
            console.error('Erro ao carregar o status das abas:', error);
        }
    }, []);

    useFocusEffect(useCallback(() => {
        void loadTabStatus();
    }, [loadTabStatus]));

    return (
        <Tab.Navigator
            screenListeners={{ state: () => { void loadTabStatus(); } }}
            screenOptions={({ route }) => ({
                headerShown: false,
                animation: 'fade',
                tabBarActiveTintColor: '#E0323C',
                tabBarInactiveTintColor: '#77716A',
                tabBarLabel: ({ focused, color }) => (
                    <Text style={[
                        styles.label,
                        route.name === 'Elegibilidade' && styles.primaryLabel,
                        route.name === 'Carteirinha' && !cardUnlocked && styles.lockedLabel,
                        { color: route.name === 'Carteirinha' && !cardUnlocked ? '#A8A29A' : color },
                    ]}>
                        {route.name}
                    </Text>
                ),
                tabBarStyle: styles.tabBar,
                tabBarIcon: ({ focused, color, size }) => (
                    <TabIcon routeName={route.name} focused={focused} color={color} size={size} cardUnlocked={cardUnlocked} />
                ),
                tabBarBadge: route.name === 'Elegibilidade' && remainingForms > 0
                    ? remainingForms
                    : route.name === 'Carteirinha' && hasPendingReview
                        ? '!'
                        : undefined,
                tabBarBadgeStyle: route.name === 'Carteirinha' && hasPendingReview ? styles.reviewBadge : styles.badge,
                tabBarItemStyle: route.name === 'Elegibilidade' ? styles.primaryTabItem : undefined,
            })}
        >
            <Tab.Screen name="Início" component={HomeScreen} />
            <Tab.Screen name="Elegibilidade" component={EligibilityFormsScreen} />
            <Tab.Screen name="Carteirinha" component={VirtualCardScreen} />
            <Tab.Screen name="Mais" component={ProfileMenuScreen} />
        </Tab.Navigator>
    );
}
