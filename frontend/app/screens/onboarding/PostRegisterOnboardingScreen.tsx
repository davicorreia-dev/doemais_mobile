import { useState } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    const [currentIndex, setCurrentIndex] = useState(0);
    const { height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const currentSlide = slides[currentIndex];
    const progressPercent = ((currentIndex + 1) / slides.length) * 100;

    const handleContinue = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex((index) => index + 1);
            return;
        }

        navigation.reset({
            index: 1,
            routes: [{ name: 'AuthChoice' }, { name: 'Login' }],
        });
    };

    return (
        <View style={styles.container}>
            <StatusBarBackground color="#fff" />
            <View style={[styles.topBar, { height: clamp(height * 0.03, 18, 34), marginTop: topInset(insets.top) }]} />

            <View style={styles.content}>
                <Text style={styles.title}>{currentSlide.title}</Text>
                <View style={styles.iconWrap}>
                    <Ionicons name={currentSlide.icon} size={104} color="#E0323C" />
                </View>
                <Text style={styles.description}>{currentSlide.description}</Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressValue, { width: `${progressPercent}%` }]} />
                </View>
                <Button
                    title={currentIndex === slides.length - 1 ? 'Ir para o login' : 'Próximo'}
                    textColor="#FFF"
                    borderRadius={25}
                    onPress={handleContinue}
                />
            </View>
        </View>
    );
}
