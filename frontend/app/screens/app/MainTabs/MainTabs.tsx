import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

import HomeScreen from '../HomeScreen';
import EligibilityFormsScreen from '../../onboarding/EligibilityFormsScreen';

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
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontFamily: 'Lexend_500Medium',
                    marginBottom: 5,
                },
                tabBarStyle: {
                    paddingBottom: 5,
                    height: 70,
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#F0F0F0',
                    elevation: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.08,
                    shadowRadius: 5,
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

                    if (focused) {
                        return (
                            <View style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: '#E0323C',
                                justifyContent: 'center',
                                alignItems: 'center',
                                shadowColor: '#E0323C',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 5,
                                elevation: 6,
                                transform: [{ translateY: -10 }], // Efeito de flutuar sobrepondo
                            }}>
                                <Ionicons name={iconName} size={24} color="#FFF" />
                            </View>
                        );
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Início" component={HomeScreen} />

            <Tab.Screen
                name="Elegibilidade"
                component={EligibilityFormsScreen}
            />

            <Tab.Screen
                name="Mais"
                children={() => <PlaceholderScreen name="Mais Opções" />}
            />
        </Tab.Navigator>
    );
}