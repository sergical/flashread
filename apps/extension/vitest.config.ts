import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/__tests__/**'],
    },
    setupFiles: ['src/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@flashread/core': path.resolve(__dirname, '../../packages/core/src'),
      'webextension-polyfill': path.resolve(__dirname, 'src/__tests__/mocks/browser.ts'),
    },
  },
});
