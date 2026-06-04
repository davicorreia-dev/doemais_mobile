import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração da API do Render
const API_URL = 'https://doemais-mobile.onrender.com';

/**
 * Serviço centralizado para requisições HTTP
 */
export const api = async (endpoint: string, method: string = 'GET', body?: any, isRetry: boolean = false): Promise<any> => {
    const url = `${API_URL}${endpoint}`;

    // Recuperar o JWT salvo no dispositivo
    const token = await AsyncStorage.getItem('@doemais:token');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    // Se o token existir, injeta no cabeçalho
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        console.log(`[API_LOG] Fazendo requisição para: ${method} ${url}`);
        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        const responseText = await response.text();

        if (!response.ok) {
            // Se o token expirou (401), tentamos renovar usando o refreshToken
            if (response.status === 401 && !isRetry && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
                const refreshToken = await AsyncStorage.getItem('@doemais:refreshToken');
                if (refreshToken) {
                    try {
                        console.log(`[API_LOG] Token expirado. Tentando renovar com refresh token...`);
                        const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ refreshToken }),
                        });

                        if (refreshResponse.ok) {
                            const refreshData = await refreshResponse.json();
                            if (refreshData.accessToken) {
                                // Salva o novo token
                                await AsyncStorage.setItem('@doemais:token', refreshData.accessToken);
                                // Refaz a requisição original com a flag isRetry = true
                                console.log(`[API_LOG] Token renovado! Refazendo a requisição original para ${endpoint}...`);
                                return await api(endpoint, method, body, true);
                            }
                        } else {
                            // Se o refresh falhou (refresh token expirou ou inválido), limpa tudo
                            await AsyncStorage.removeItem('@doemais:token');
                            await AsyncStorage.removeItem('@doemais:refreshToken');
                            await AsyncStorage.removeItem('@doemais:user');
                        }
                    } catch (refreshErr) {
                        console.error('Erro de rede ao tentar renovar token:', refreshErr);
                    }
                }
            }

            let errorMessage = responseText;
            try {
                const jsonError = JSON.parse(responseText);
                errorMessage = jsonError.message || jsonError.error || JSON.stringify(jsonError);
            } catch (e) {
                // Se não for JSON (ex: página HTML de erro 404 do Express)
                if (response.status === 404 || responseText.includes('Cannot PUT')) {
                    errorMessage = 'A rota da API não foi encontrada. O servidor em produção pode estar desatualizado em relação ao código local.';
                } else if (responseText.includes('<!DOCTYPE html>')) {
                    errorMessage = `Erro interno do servidor (Status ${response.status}).`;
                }
            }
            throw new Error(errorMessage);
        }

        return responseText ? JSON.parse(responseText) : {};

    } catch (error: any) {
        console.error(`Erro na API (${endpoint}):`, error.message);
        throw error;
    }
};