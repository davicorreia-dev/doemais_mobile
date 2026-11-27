import {
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    clearStoredSession,
    getSessionToken,
    getStoredUser,
    setSessionToken,
    setStoredUser,
} from './session';
import { Platform } from 'react-native';

// Configuração da API do Render com suporte para variáveis de ambiente locais
// EXPO_PUBLIC_API_URL_OVERRIDE é definida pelo docker-compose (./run.sh --local | --render) e tem prioridade
const API_URL = process.env.EXPO_PUBLIC_API_URL_OVERRIDE || process.env.EXPO_PUBLIC_API_URL || 'https://doemais-mobile.onrender.com';

export const clearSession = clearStoredSession;

let refreshInFlight: Promise<boolean> | null = null;

const refreshSession = async (): Promise<boolean> => {
    const refreshToken = await getSessionToken(REFRESH_TOKEN_KEY);
    const user = await getStoredUser();

  if (Platform.OS !== 'web' && (!refreshToken || !user)) {
        await clearSession();
        return false;
    }

    const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: refreshToken ? JSON.stringify({ refreshToken }) : undefined,
    });

    if (!refreshResponse.ok) {
        await clearSession();
        return false;
    }

    const refreshData = await refreshResponse.json();
    const refreshedSession = refreshData?.data ?? refreshData;
    const newAccessToken = refreshedSession?.accessToken;
    const newRefreshToken = refreshedSession?.refreshToken;

    if (!newAccessToken) {
        await clearSession();
        return false;
    }

    await setSessionToken(ACCESS_TOKEN_KEY, newAccessToken);
    if (newRefreshToken) {
        await setSessionToken(REFRESH_TOKEN_KEY, newRefreshToken);
    }
    if (refreshedSession?.doador) {
      await setStoredUser(JSON.stringify(refreshedSession.doador));
    }
    return true;
};

/**
 * Compartilha a renovação em andamento. O backend rotaciona o refresh token;
 * sem isso, duas respostas 401 simultâneas poderiam usar o mesmo token antigo
 * e a segunda acabaria limpando uma sessão que já foi renovada pela primeira.
 */
export const refreshStoredSession = (): Promise<boolean> => {
    if (!refreshInFlight) {
        refreshInFlight = refreshSession().finally(() => {
            refreshInFlight = null;
        });
    }

    return refreshInFlight;
};

/**
 * Serviço centralizado para requisições HTTP
 */
export const api = async (endpoint: string, method: string = 'GET', body?: any, isRetry: boolean = false, silent: boolean = false): Promise<any> => {
    const url = `${API_URL}${endpoint}`;

    // Recuperar o JWT salvo no dispositivo
    const token = await getSessionToken(ACCESS_TOKEN_KEY);

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
            credentials: 'include',
            body: body ? JSON.stringify(body) : undefined,
        });

        const responseText = await response.text();

        if (!response.ok) {
            // Se o token expirou (401), tentamos renovar usando o refreshToken
            if (response.status === 401 && !isRetry && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
                try {
                    console.log(`[API_LOG] Token expirado. Tentando renovar com refresh token...`);
                    if (await refreshStoredSession()) {
                        console.log(`[API_LOG] Token renovado! Refazendo a requisição original para ${endpoint}...`);
                        return await api(endpoint, method, body, true);
                    }
                } catch (refreshErr) {
                    console.error('Erro de rede ao tentar renovar token:', refreshErr);
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
        if (!silent) {
            console.error(`Erro na API (${endpoint}):`, error.message);
        }
        throw error;
    }
};
