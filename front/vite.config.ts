import path from 'node:path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import checker from 'vite-plugin-checker'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'default',
      },
    }),
    // basicSsl(), // Отключено для разработки, чтобы избежать Mixed Content (HTTPS -> HTTP)
    checker({
      typescript: {
        tsconfigPath: './tsconfig.app.json',
        buildMode: false, // проверка только в dev режиме
      },
      // ESLint отключен из-за несовместимости с ESLint 9.x
      // Используйте отдельную команду 'npm run lint' для проверки ESLint
      overlay: {
        initialIsOpen: false,
        position: 'tl',
        badgeStyle: 'position: fixed; top: 20px; right: 20px; z-index: 9999;',
      },
      terminal: true, // Выводить ошибки в терминал
      enableBuild: false,
    }),
  ],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Выводим все предупреждения и ошибки
        warn(warning);
      },
    },
  },
  logLevel: 'info', // Увеличиваем уровень логирования
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3006,
    https: false, // Отключено для разработки, чтобы избежать Mixed Content (HTTPS -> HTTP)
    // Для production можно включить обратно: https: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/shared/styles/bp" as bp;
@use "@/shared/styles/globals" as *;`,
      },
    },
  },
})
