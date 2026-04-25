import { useState } from 'react';
import { View, Text, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Button from '../../../components/Button';
import Styles from './Styles';

// Configuração dos Slides
const slides = [
    {
        id: '1',
        title: 'Sua atitude pode\nsalvar vidas!',
        text: 'Doar sangue é um ato simples, seguro e que pode transformar o destino de quem mais precisa.',
        image: require('../../../assets/images/blood-donation.png'),
    },
    {
        id: '2',
        title: 'Encontre locais de\ndoação perto de você.',
        text: 'Utilize nosso mapa para localizar hemocentros e pontos de coleta mais próximos da sua localização.',
        image: require('../../../assets/images/location-tracking.png'),
    },
    {
        id: '3',
        title: 'Cada doação salva\naté 4 vidas!',
        text: 'Vamos juntos fazer a diferença? Clique em Começar agora para iniciar sua jornada de solidariedade.',
        image: require('../../../assets/images/ethnic-friendship.png'),
    },
];

export default function OnboardingScreen() {
    const navigation = useNavigation<any>();
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            navigation.navigate('RegisterScreen');
        }
    };

    const currentSlide = slides[currentIndex];

    // Cálculo da barra de progresso
    const progressPercent = ((currentIndex + 1) / slides.length) * 100;

    return (
        <View style={Styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Faixa Vermelha Superior igual ao design */}
            <View style={Styles.topBar} />

            <View style={Styles.content}>
                <Text style={Styles.title}>{currentSlide.title}</Text>

                <Image
                    source={currentSlide.image}
                    style={Styles.image}
                />

                <Text style={Styles.description}>
                    {currentSlide.text}
                </Text>
            </View>

            <View style={Styles.footer}>
                {/* Barra de Progresso */}
                <View style={Styles.progressBarContainer}>
                    <View style={[Styles.progressBarFill, { width: `${progressPercent}%` }]} />
                </View>

                <Button
                    title={currentIndex === slides.length - 1 ? "Começar agora" : "Próximo"}
                    onPress={handleNext}
                    width="100%"
                    textColor="#fff"
                    borderRadius={25}
                />
            </View>
        </View>
    );
}