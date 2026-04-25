import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Styles from './StylesProfileSetupPhoto';
import Header from '../../../components/Header';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileSetupPhotoScreen({ navigation }: any) {
    const [image, setImage] = useState<string | null>(null);

    // Carrega a foto salva quando a tela for aberta
    React.useEffect(() => {
        async function loadSavedImage() {
            try {
                const savedUri = await AsyncStorage.getItem('@profile_image');
                if (savedUri) {
                    // Verifica se o arquivo ainda existe no sistema
                    const fileInfo = await FileSystem.getInfoAsync(savedUri);
                    if (fileInfo.exists) {
                        setImage(savedUri);
                    } else {
                        // Se não existe, limpa o storage
                        await AsyncStorage.removeItem('@profile_image');
                    }
                }
            } catch (error) {
                console.log("Erro ao carregar imagem:", error);
            }
        }
        loadSavedImage();
    }, []);

    async function handlePickImage() {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert('Permissão necessária', 'Precisamos acessar sua galeria.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.7,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    async function handleNext() {
        if (image) {
            try {
                // Se a imagem não estiver no diretório permanente (ex: recém selecionada da galeria)
                if (!image.includes(FileSystem.documentDirectory!)) {
                    const filename = image.split('/').pop();
                    const destinationUri = FileSystem.documentDirectory! + filename;

                    // Copia o arquivo do cache temporário para a pasta permanente
                    await FileSystem.copyAsync({
                        from: image,
                        to: destinationUri,
                    });

                    // Salva o caminho permanente no AsyncStorage
                    await AsyncStorage.setItem('@profile_image', destinationUri);
                    navigation.navigate('MainTabs', { image: destinationUri });
                } else {
                    // Se já estiver no diretório permanente (foi carregada do AsyncStorage)
                    navigation.navigate('MainTabs', { image });
                }
            } catch (error) {
                console.error("Erro ao salvar a imagem localmente:", error);
                Alert.alert("Erro", "Não foi possível salvar a imagem.");
                return;
            }
        } else {
            // Caso o usuário não tenha selecionado uma imagem (opcional)
            navigation.navigate('MainTabs', { image: null });
        }
    }

    async function removeimage() {
        setImage(null);
        await AsyncStorage.removeItem('@profile_image');
    }

    return (
        <View style={Styles.container}>
            <Header
                marginTop={30}
                minHeight={50}
                icon="arrow-back-outline"
                iconColor="#FFF"
                containerStyle={{ backgroundColor: '#E0323C' }}
            />

            <View style={{ flex: 1, paddingTop: 20 }}>
                <View style={Styles.containerTitle}>
                    <Text style={Styles.title}>Configuração do Perfil</Text>
                    <Text style={Styles.subtitle}>
                        É opcional. Você pode preencher depois. Vá para a próxima etapa clicando no botão Próximo.
                    </Text>
                </View>

                <View style={{ flex: 1, justifyContent: 'center' }}>

                    <TouchableOpacity onPress={removeimage}>
                        <Ionicons style={Styles.removeimage} name="trash" size={20} marginBottom={10} color="#E0323C" />
                    </TouchableOpacity>


                    <TouchableOpacity style={Styles.imageContainer} onPress={handlePickImage}>
                        {image ? (
                            <Image source={{ uri: image }} style={Styles.image} />
                        ) : (
                            <Text style={Styles.placeholder}>Selecionar foto</Text>
                        )}
                    </TouchableOpacity>


                </View>

                <View style={{ paddingBottom: 40 }}>
                    <TouchableOpacity style={Styles.button} onPress={handleNext}>
                        <Text style={Styles.buttonText}>Próximo</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}