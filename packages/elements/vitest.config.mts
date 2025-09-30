import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.ts'],
    include: ['__tests__/**/*.test.{ts,tsx}'],
    server: {
      deps: {
        inline: ['streamdown', 'katex'],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '__tests__/setup.ts',
        '*.config.{ts,js}',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@repo/shadcn-ui/lib/utils': path.resolve(__dirname, '../shadcn-ui/lib/utils.ts'),
      '@repo/shadcn-ui/components': path.resolve(__dirname, '../shadcn-ui/components'),
      'katex/dist/katex.min.css': path.resolve(__dirname, './__tests__/styleMock.js'),
    },
  },
});