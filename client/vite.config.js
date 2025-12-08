// vite config for react frontend & proxying api requests to express server
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3001, // dev frontend runs here
        proxy: {
            '/api': {
                target: 'http://localhost:3000', // backend api server
                changeOrigin: true
            }
        }
    }
});