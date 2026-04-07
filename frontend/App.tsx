import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// --- IMPORTS DAS TELAS ---
import AuthChoiceScreen from './app/screens/AuthChoiceScreen/AuthChoiceScreen';
import LoginScreen from './app/screens/LoginScreen/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen/RegisterScreen';
import ForgotPasswordCodeScreen from './app/screens/ForgotPasswordCodeScreen/ForgotPasswordCodeScreen';
import ForgetPasswordScreen from './app/screens/ForgetPasswordScreen/ForgetPasswordScreen';
import ForgetPasswordChoiceScreen from './app/screens/ForgetPasswordChoiceScreen/ForgetPasswordChoiceScreen';
import NewPasswordScreen from './app/screens/NewPasswordScreen/NewPasswordScreen';
import PasswordResetSuccessScreen from './app/screens/PasswordResetSuccessScreen/PasswordResetSuccessScreen';
import LgpdScreen from './app/screens/LgpdScreen/LgpdScreen';
import RegisterSuccessScreen from './app/screens/RegisterSuccessScreen/RegisterSuccessScreen';
import CompleteProfileScreen from './app/screens/CompleteProfileScreen/CompleteProfileScreen';
import OnboardingScreen from './app/screens/OnboardingScreen/OnboardingScreen';
import QuizScreen from './app/screens/QuizFlow/QuizScreen';

// IMPORTANTE: Este é o seu MENU NOVO (Vermelho)
// Ele já é um TabNavigator por dentro, então não precisamos criar outro aqui.
import MainTabsScreen from './app/screens/MainTabs/MainTabs'; 

// Se você quiser usar a tela de Settings depois, importe ela aqui, 
// mas ela deve ser adicionada lá dentro do arquivo MainTabs.tsx se quiser que apareça no menu.
// import SettingsScreen from './app/screens/Settings/SettingsScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      
      <Stack.Navigator 
        initialRouteName="AuthChoice" 
        screenOptions={{ headerShown: false }}
      >
        {/* --- FLUXO DE AUTENTICAÇÃO --- */}
        <Stack.Screen name="AuthChoice" component={AuthChoiceScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordCodeScreen} />
        <Stack.Screen name="ForgetPasswordChoiceScreen" component={ForgetPasswordChoiceScreen} />
        <Stack.Screen name="NewPasswordScreen" component={NewPasswordScreen} />
        <Stack.Screen name="PasswordResetSuccessScreen" component={PasswordResetSuccessScreen} />
        <Stack.Screen name="LgpdScreen" component={LgpdScreen} />
        <Stack.Screen name="CompleteProfileScreen" component={CompleteProfileScreen} />
        
        {/* Telas sem Header */}
        <Stack.Screen name="RegisterSuccessScreen" component={RegisterSuccessScreen} />
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        <Stack.Screen name="QuizScreen" component={QuizScreen} />
        
        {/* --- O GRANDE MOMENTO --- */}
        {/* Aqui nós chamamos direto o arquivo MainTabsScreen (O menu vermelho) */}
        {/* Removemos a função intermediária que criava o menu duplicado */}
        <Stack.Screen name="MainTabs" component={MainTabsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});