import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  const gasUpstream = env.GAS_REVISAO_UPSTREAM_URL?.trim();

  /** Em `npm run dev`, encaminha POST para a Web App e evita CORS em `script.google.com`. */
  const gasRevisaoProxy: Record<
    string,
    {target: string; changeOrigin: boolean; rewrite: (path: string) => string}
  > = {};
  if (command === 'serve' && gasUpstream) {
    try {
      const u = new URL(gasUpstream);
      const targetPath = u.pathname + u.search;
      gasRevisaoProxy['/__gas_revisao'] = {
        target: u.origin,
        changeOrigin: true,
        rewrite: () => targetPath,
      };
    } catch {
      /* URL inválida em GAS_REVISAO_UPSTREAM_URL */
    }
  }

  return {
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
      proxy: {
        '/api': {
          target: 'http://localhost:8787',
          changeOrigin: true,
        },
        ...gasRevisaoProxy,
      },
    },
  };
});
