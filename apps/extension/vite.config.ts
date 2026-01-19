import { defineConfig } from 'vite';
import webExtension from 'vite-plugin-web-extension';
import path from 'path';

export default defineConfig({
  plugins: [
    webExtension({
      manifest: 'public/manifest.json',
      watchFilePaths: ['public/manifest.json'],
      additionalInputs: [
        'src/popup/popup.html',
        'src/options/options.html',
      ],
      // Disable auto-opening browser in dev mode (set to true to enable)
      browser: process.env.OPEN_BROWSER === 'true' ? 'chrome' : undefined,
      disableAutoLaunch: process.env.OPEN_BROWSER !== 'true',
    }),
  ],
  resolve: {
    alias: {
      '@flashread/core': path.resolve(__dirname, '../../packages/core/src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === 'development',
  },
});
