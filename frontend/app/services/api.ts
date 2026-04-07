import { Alert, Platform } from 'react-native';

// Configuração dinâmica do IP da API
let API_URL = '';

if (Platform.OS === 'web') {
    API_URL = 'http://localhost:3000';
} else if (Platform.OS === 'android') {
    // IP da sua rede local, ajuste conforme necessário com o da sua rede
    API_URL = 'http://192.168.1.146:3000'; 
} else {
    API_URL = 'http://localhost:3000';
}

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