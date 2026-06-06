import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',

    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: 'coverage',
      exclude: [
      'src/tests/**',
      'e2e/**',
      '**/*.test.*',
      '**/*.spec.*',
      '**/__tests__/**',
      '**/node_modules/**',
      ],
    },
  },
})
