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
    },
});
