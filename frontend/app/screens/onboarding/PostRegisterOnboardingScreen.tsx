import { useRef, useState } from 'react';
import { Animated, Easing, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Button from '../../../components/Button';
import StatusBarBackground from '../../../components/StatusBarBackground';
import { clamp, topInset } from '../../utils/responsive';
import styles from './StylesPostRegisterOnboarding';

const slides = [
    {
        title: 'Preencha seus\nformulários',
        description: 'Responda à triagem com atenção. Se precisar ajustar algo, você poderá solicitar uma revisão das respostas.',
        icon: 'clipboard-outline' as const,
    },
    {
        title: 'Acompanhe sua\ncarteirinha virtual',
        description: 'Após concluir a triagem final, sua carteirinha ficará disponível no app e indicará quando houver uma revisão em andamento.',
        icon: 'card-outline' as const,
    },
];

export default function PostRegisterOnboardingScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const transition = useRef(new Animated.Value(1)).current;
    const { height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const currentSlide = slides[currentIndex];
    const progressPercent = ((currentIndex + 1) / slides.length) * 100;

    const finishOnboarding = async () => {
        const onboardingKey = route.params?.onboardingKey as string | undefined;
        if (onboardingKey) {
            await AsyncStorage.setItem(onboardingKey, 'true');
        }

        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    };

    const handleContinue = () => {
        if (currentIndex < slides.length - 1) {
            setIsTransitioning(true);
            Animated.timing(transition, {
                toValue: 0,
                duration: 160,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }).start(() => {
                setCurrentIndex((index) => index + 1);
                Animated.timing(transition, {
                    toValue: 1,
                    duration: 240,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }).start(() => setIsTransitioning(false));
            });
            return;
        }

        finishOnboarding();
    };

    const animatedSlideStyle = {
        opacity: transition,
        transform: [{ translateX: transition.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
    };

    return (
        <View style={styles.container}>
            <StatusBarBackground color="#fff" />
            <View style={[styles.topBar, { height: clamp(height * 0.03, 18, 34), marginTop: topInset(insets.top) }]} />

            <Animated.View style={[styles.content, animatedSlideStyle]}>
                <Text style={styles.title}>{currentSlide.title}</Text>
                <View style={styles.iconWrap}>
                    <Ionicons name={currentSlide.icon} size={104} color="#E0323C" />
                </View>
                <Text style={styles.description}>{currentSlide.description}</Text>
            </Animated.View>

            <View style={styles.footer}>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressValue, { width: `${progressPercent}%` }]} />
                </View>
                <Button
                    title={currentIndex === slides.length - 1 ? 'Ir para o app' : 'Próximo'}
                    textColor="#FFF"
                    borderRadius={25}
                    onPress={handleContinue}
                    disabled={isTransitioning}
                />
            </View>
        </View>
    );
}
