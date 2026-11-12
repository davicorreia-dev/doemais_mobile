import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../components/Header';
import Styles from './StylesProfileSetupPhoto';

/**
 * Implementa a foto de perfil no navegador sem depender do sistema de arquivos
 * do aparelho. Nesta primeira versao a imagem fica somente no armazenamento do
 * navegador; quando houver upload no backend, este e o ponto para trocar por URL.
 */
export default function ProfileSetupPhotoScreen({ navigation }: any) {
    const [image, setImage] = useState<string | null>(null);

    React.useEffect(() => {
        AsyncStorage.getItem('@profile_image')
            .then(setImage)
            .catch(() => undefined);
    }, []);

    async function handlePickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.7,
            allowsEditing: true,
            aspect: [1, 1],
            base64: true,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            // Data URL continua disponivel depois que o usuario fecha o seletor
            // do navegador, ao contrario de uma URL temporaria de arquivo.
            const persistentUri = asset.base64 && asset.mimeType
                ? `data:${asset.mimeType};base64,${asset.base64}`
                : asset.uri;
            setImage(persistentUri);
        }
    }

    async function handleNext() {
        try {
            if (image) await AsyncStorage.setItem('@profile_image', image);
            navigation.navigate('MainTabs', { image });
        } catch {
            Alert.alert('Erro', 'Não foi possível salvar a imagem neste navegador.');
        }
    }

    async function removeImage() {
        setImage(null);
        await AsyncStorage.removeItem('@profile_image');
    }

    return (
        <View style={Styles.container}>
            <StatusBar style="light" />
            <Header icon="arrow-back-outline" iconColor="#FFF" containerStyle={{ backgroundColor: '#E0323C' }} />
            <View style={{ flex: 1, paddingTop: 20 }}>
                <View style={Styles.containerTitle}>
                    <Text style={Styles.title}>Configuração do Perfil</Text>
                    <Text style={Styles.subtitle}>É opcional. Você pode preencher depois.</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <TouchableOpacity onPress={removeImage} accessibilityLabel="Remover foto de perfil">
                        <Ionicons style={Styles.removeimage} name="trash" size={20} marginBottom={10} color="#E0323C" />
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.imageContainer} onPress={handlePickImage} accessibilityRole="button">
                        {image ? <Image source={{ uri: image }} style={Styles.image} /> : <Text style={Styles.placeholder}>Selecionar foto</Text>}
                    </TouchableOpacity>
                </View>
                <View style={{ paddingBottom: 40 }}>
                    <TouchableOpacity style={Styles.button} onPress={handleNext} accessibilityRole="button">
                        <Text style={Styles.buttonText}>Próximo</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
