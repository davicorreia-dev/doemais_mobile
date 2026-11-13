import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

declare const process: { env: Record<string, string | undefined> };

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5174,
        strictPort: true,
        // No Docker (bind mount no Windows/macOS) os eventos de arquivo nem sempre chegam; o compose liga o polling.
        watch: process.env.VITE_USE_POLLING ? { usePolling: true } : undefined,
        proxy: {
            '/hemocentro-api': {
                target: process.env.ADMIN_API_URL || 'http://localhost:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/hemocentro-api/, '/api/doadores/integracoes/hemocentros'),
                headers: process.env.HEMOCENTRO_SERVICE_API_KEY
                    ? { 'x-hemocentro-service-key': process.env.HEMOCENTRO_SERVICE_API_KEY }
                    : undefined,
            },
        },
    },
});
