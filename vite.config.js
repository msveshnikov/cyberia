import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Cyberia',
                short_name: 'Cyberia',
                description: 'AI-powered MMO property game with infinite 3D map',
                start_url: '/app',
                scope: '/app',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#1a237e',
                icons: [
                    {
                        src: '/favicon.ico',
                        sizes: '64x64 32x32 24x24 16x16',
                        type: 'image/x-icon'
                    },
                    {
                        src: '/logo192.png',
                        type: 'image/png',
                        sizes: '192x192'
                    },
                    {
                        src: '/logo512.png',
                        type: 'image/png',
                        sizes: '512x512'
                    }
                ],
                screenshots: [
                    {
                        src: '/hero3.jpg',
                        type: 'image/jpeg',
                        sizes: '1920x1080'
                    },
                    {
                        src: '/hero4.jpg',
                        type: 'image/jpeg',
                        sizes: '1920x1080'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}']
            }
        })
    ]
});
