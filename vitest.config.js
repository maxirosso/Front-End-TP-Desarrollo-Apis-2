import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
    },
    setupFiles: './src/setupTests.js', // si tienes setupTests.js
  },
});