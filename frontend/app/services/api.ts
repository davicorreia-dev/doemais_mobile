import { Platform } from 'react-native';
import { clearSession, getAccessToken, getRefreshToken, setAccessToken } from './session';

// Configuração da API do Render com suporte para variáveis de ambiente locais
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://doemais-mobile.onrender.com';

/**
 * Serviço centralizado para requisições HTTP
 */
export const api = async (endpoint: string, method: string = 'GET', body?: any, isRetry: boolean = false): Promise<any> => {
    const url = `${API_URL}${endpoint}`;

    // Recuperar o JWT salvo no dispositivo
    const token = await getAccessToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-client-platform': Platform.OS === 'web' ? 'web' : 'native',
    };

    // Se o token existir, injeta no cabeçalho
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            credentials: 'include',
        });

        const responseText = await response.text();

        if (!response.ok) {
            // Se o token expirou (401), tentamos renovar usando o refreshToken
            if (response.status === 401 && !isRetry && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
                const refreshToken = await getRefreshToken();
                if (refreshToken || Platform.OS === 'web') {
                    try {
                        const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'x-client-platform': Platform.OS === 'web' ? 'web' : 'native' },
                            body: refreshToken ? JSON.stringify({ refreshToken }) : undefined,
                            credentials: 'include',
                        });

                        if (refreshResponse.ok) {
                            const refreshData = await refreshResponse.json();
                            // O backend responde { success, message, data: { accessToken, expiresIn } },
                            // então o token vem dentro de "data" (o fallback cobre respostas planas).
                            const newAccessToken = refreshData?.data?.accessToken ?? refreshData?.accessToken;

                            if (newAccessToken) {
                                // Salva o novo token
                                await setAccessToken(newAccessToken);
                                // Refaz a requisição original com a flag isRetry = true
                                return await api(endpoint, method, body, true);
                            }

                            // Resposta 200 sem token: sessão inutilizável, melhor derrubar do que insistir
                            await clearSession();
                        } else {
                            // Se o refresh falhou (refresh token expirou ou inválido), limpa tudo
                            await clearSession();
                        }
                    } catch (refreshErr) {
                        await clearSession();
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
        throw error;
    }
};
