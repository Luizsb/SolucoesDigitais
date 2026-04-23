import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({command}) => ({
  // Project is published on GitHub Pages under /SolucoesDigitais.
  base: command === 'build' ? '/SolucoesDigitais/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not remove without checking AI Studio deployment.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
}));
