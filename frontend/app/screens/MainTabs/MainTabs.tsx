import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

import HomeScreen from '../HomeScreen/HomeScreen';

const PlaceholderScreen = ({ name }: { name: string }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#666' }}>{name}</Text>
        <Text>Em desenvolvimento</Text>
    </View>
);

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#E0323C',
                tabBarInactiveTintColor: '#666',
                tabBarStyle: {
                    paddingBottom: 5,
                    height: 60,
                    backgroundColor: '#F9F9F9',
                    borderTopWidth: 0,
                    elevation: 10,
                },
                // Correção aqui: Definimos o tipo explícito do ícone
                tabBarIcon: ({ focused, color, size }) => {
                    // keyof typeof Ionicons.glyphMap garante que só usaremos nomes válidos
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';

                    if (route.name === 'Início') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Elegibilidade') {
                        iconName = focused ? 'clipboard' : 'clipboard-outline';
                    } else if (route.name === 'Mais') {
                        iconName = focused ? 'grid' : 'grid-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Início" component={HomeScreen} />
            
            <Tab.Screen 
                name="Elegibilidade" 
                children={() => <PlaceholderScreen name="Formulário de Elegibilidade" />} 
            />
            
            <Tab.Screen 
                name="Mais" 
                children={() => <PlaceholderScreen name="Mais Opções" />} 
            />
        </Tab.Navigator>
    );
}