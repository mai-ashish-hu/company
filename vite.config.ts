import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const appBasePath = process.env.APP_BASE_PATH || '/';

export default defineConfig({
  plugins: [remix({ ssr: true, basename: appBasePath }), tsconfigPaths()],
  ssr: { noExternal: ['@careernest/ui', '@careernest/lib', '@careernest/shared'] },
  server: {
    port: 3004,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
      '/ws': { target: 'ws://localhost:4000', ws: true, changeOrigin: true },
    },
  },
});
