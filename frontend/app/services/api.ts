import { Alert, Platform } from 'react-native';

// Configuração da API do Render
const API_URL = 'https://doemais-mobile.onrender.com';

/**
 * Serviço centralizado para requisições HTTP
 */
export const api = async (endpoint: string, method: string = 'GET', body?: any) => {
    const url = `${API_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    try {
        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        const responseText = await response.text(); 
        
        if (!response.ok) {
            let errorMessage = responseText;
            try {
                const jsonError = JSON.parse(responseText);
                errorMessage = jsonError.message || jsonError.error || JSON.stringify(jsonError);
            } catch (e) {
            }
            throw new Error(errorMessage);
        }

        return responseText ? JSON.parse(responseText) : {};

    } catch (error: any) {
        console.error(`Erro na API (${endpoint}):`, error.message);
        throw error; 
    }
};