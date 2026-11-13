import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/lexend/400.css';
import '@fontsource/lexend/500.css';
import '@fontsource/lexend/600.css';
import '@fontsource/lexend/700.css';
import '@fontsource/lexend/800.css';
import './styles.css';
import App from './App';
import { StoreProvider } from './state/store';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <StoreProvider>
                <App />
            </StoreProvider>
        </BrowserRouter>
    </StrictMode>,
);
