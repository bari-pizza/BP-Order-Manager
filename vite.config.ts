/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { qrcode } from 'vite-plugin-qrcode';

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        include: ['@emotion/styled', '@emotion/react', '@mui/material/Tooltip'],
        // https://stackoverflow.com/questions/72097831/popper-styled-default-is-not-a-function-mui-5-6-0-material-ui
    },
    plugins: [react(), qrcode()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
    },
});
