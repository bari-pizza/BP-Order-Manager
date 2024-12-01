/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { qrcode } from 'vite-plugin-qrcode';
import { VitePWA } from 'vite-plugin-pwa';
// https://www.npmjs.com/package/vite-plugin-pwa/v/0.9.1

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        include: ['@emotion/styled', '@emotion/react', '@mui/material/Tooltip'],
        // https://stackoverflow.com/questions/72097831/popper-styled-default-is-not-a-function-mui-5-6-0-material-ui
    },
    plugins: [
        react(),
        qrcode(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Bari Pizza Order Manager',
                short_name: 'BP Order Manager',
                description: 'Allows workers to manage orders on a daily basis',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '/',
                icons: [
                    {
                        src: '/assets/icons/BP logo 192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/assets/icons/BP logo 512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
                screenshots: [
                    {
                        src: '/assets/screenshots/screenshot-wide-1280.png',
                        sizes: '1280x720',
                        type: 'image/png',
                        form_factor: 'wide',
                    },
                    {
                        src: '/assets/screenshots/screenshot-mobile-720.png',
                        sizes: '720x1280',
                        type: 'image/png',
                        form_factor: 'narrow',
                    },
                ],
            },
            workbox: {
                maximumFileSizeToCacheInBytes: 5000000, // 5MB limit
            },
        }),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
    },
});
