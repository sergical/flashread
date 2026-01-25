import { defineConfig } from 'vite';
import webExtension from 'vite-plugin-web-extension';
import path from 'path';

// Target browser: 'chrome' or 'firefox'
const targetBrowser = process.env.TARGET_BROWSER || 'chrome';
const isFirefox = targetBrowser === 'firefox';

export default defineConfig({
  plugins: [
    webExtension({
      manifest: 'public/manifest.json',
      watchFilePaths: ['public/manifest.json'],
      additionalInputs: [
        'src/popup/popup.html',
        'src/options/options.html',
      ],
      // Target browser for build output
      browser: process.env.OPEN_BROWSER === 'true' ? targetBrowser : (targetBrowser as 'chrome' | 'firefox'),
      disableAutoLaunch: process.env.OPEN_BROWSER !== 'true',
      // Transform manifest for Firefox compatibility
      transformManifest: (manifest) => {
        if (isFirefox && manifest.background?.service_worker) {
          // Firefox MV3 uses background.scripts instead of service_worker
          const serviceWorker = manifest.background.service_worker;
          manifest.background = {
            scripts: [serviceWorker],
            type: 'module',
          };
        }
        return manifest;
      },
    }),
  ],
  resolve: {
    alias: {
      '@flashread/core': path.resolve(__dirname, '../../packages/core/src'),
    },
  },
  build: {
    outDir: targetBrowser === 'firefox' ? 'dist-firefox' : 'dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === 'development',
  },
});
