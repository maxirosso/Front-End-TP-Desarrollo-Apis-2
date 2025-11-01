import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
        all: false,
    },
    setupFiles: './src/setupTests.js', // si tienes setupTests.js
  },
});