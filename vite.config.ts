import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

// Safe, universal __dirname resolution compatible with Node.js 22 (import.meta.dirname),
// standard Node ESM (fileURLToPath(import.meta.url)), and legacy environments.
const __dirname =
  typeof import.meta.dirname === 'string'
    ? import.meta.dirname
    : typeof import.meta.url === 'string'
      ? path.dirname(fileURLToPath(import.meta.url))
      : path.resolve(process.cwd());

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: true,
    },
  };
});
