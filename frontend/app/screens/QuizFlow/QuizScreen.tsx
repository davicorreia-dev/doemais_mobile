import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Styles from './Styles';
import Button from '../../../components/Button';
import { QUIZ_MODULES } from './quizData';

export default function QuizScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute();
    
    // Recebe o ID do módulo via parâmetro: 'GRIPE', 'IMPEDIMENTOS_DEFINITIVOS'...
    const { moduleId } = route.params as { moduleId: string } || { moduleId: 'IMPEDIMENTOS_DEFINITIVOS' };
    
    const module = QUIZ_MODULES[moduleId];
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showBlockModal, setShowBlockModal] = useState(false);

    if (!module) {
        navigation.goBack();
        return null;
    }

    const currentQuestion = module.questions[currentIndex];

    const [modalData, setModalData] = useState({ title: '', message: '' });

    const handleResponse = (isBlocker: boolean) => {
        if (isBlocker) {
            const title = currentQuestion.rejectionTitle || module.defaultRejectionTitle;
            const message = currentQuestion.rejectionMessage || module.defaultRejectionMessage;
            setModalData({ title, message });
            setShowBlockModal(true);
        } else {
            if (currentIndex < module.questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                alert("Módulo concluído!"); 
                // navigation.goBack();
            }
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            if (navigation.canGoBack()) {
                navigation.goBack();
            }
        }
    };

    const handleExit = () => {
        setShowBlockModal(false);
        navigation.navigate('HomeScreen');
    };

    return (
        <View style={Styles.container}>
            <StatusBar backgroundColor="#E0323C" barStyle="light-content" />

            {/* Cabeçalho Vermelho */}
            <View style={Styles.header}>
                {/* Navegação topo */}
                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, position: 'absolute', top: 50}}>
                    
                    {/* Botão navegação */}
                    <TouchableOpacity onPress={handleBack}>
                        <Ionicons name="chevron-back" size={28} color="#FFF" />
                    </TouchableOpacity>

                    {/* Botão navegação
                    <TouchableOpacity>
                         <Ionicons name="chevron-forward" size={28} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity> */}
                </View>

                {/* Círculo Branco com o Ícone PNG do Módulo */}
                <View style={Styles.headerIconContainer}>
                    <Image 
                        source={module.icon} 
                        style={Styles.headerImage}
                        resizeMode="contain"
                    />
                </View>
            </View>
            
            <View style={Styles.card}>
                <View style={{width: '100%'}}>
                    <Text style={{textAlign: 'left', fontWeight: 'bold', marginBottom: 10}}>
                        {currentIndex + 1}.
                    </Text>
                    <Text style={Styles.questionText}>
                        {currentQuestion.text}
                    </Text>
                </View>

                {/* Card da Pergunta */}
                <View style={Styles.buttonGroup}>
                    {currentQuestion.options ? (
                        currentQuestion.options.map((option) => (
                            <TouchableOpacity 
                                key={option.value}
                                style={[Styles.optionButton, { marginBottom: 10 }]} 
                                onPress={() => handleResponse(option.isBlocker)}
                            >
                                <Text style={Styles.optionText}>{option.label}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <>
                            <TouchableOpacity 
                                style={Styles.optionButton} 
                                onPress={() => handleResponse(currentQuestion.safeAnswer !== 'SIM')}
                            >
                                <Text style={Styles.optionText}>Sim</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[Styles.optionButton, { marginTop: 15 }]} 
                                onPress={() => handleResponse(currentQuestion.safeAnswer !== 'NAO')}
                            >
                                <Text style={Styles.optionText}>Não</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            {/* Modal de Bloqueio */}
            <Modal
                visible={showBlockModal}
                transparent={true}
                animationType="fade"
                onRequestClose={handleExit}
            >
                <View style={Styles.blockContainer}>
                    <View style={Styles.blockCard}>
                        <Ionicons name="alert-circle-outline" size={60} color="#E0323C" style={Styles.blockIcon} />
                        
                        {/* Título */}
                        <Text style={Styles.blockTitle}>
                            {modalData.title}
                        </Text>
                        
                        {/* Mensagem */}
                        <Text style={Styles.blockMessage}>
                            {modalData.message}
                        </Text>
                        
                        <Text style={{fontSize: 12, color: '#999', marginBottom: 20, textAlign: 'center'}}>
                            Aguarde o período necessário. A DOE+ agradece a sua intenção!
                        </Text>

                        <Button 
                            title="Retornar ao início" 
                            textColor="#FFF" 
                            width="100%"
                            onPress={handleExit}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}