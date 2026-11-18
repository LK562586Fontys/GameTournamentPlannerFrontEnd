import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      deny: ['dockerfile', 'sonar-project.properties', '.env', '.gitignore', 'README.md', 'LICENSE', 'package.json', 'package-lock.json', 'vite.config.js', 'playwright.config.js'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',

    coverage: {
      all: false,
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
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
