/// <reference types="vitest/config" />

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode, command }) => {
  const isTest = mode === 'test'
  const isViteDev = command === 'serve' && mode === 'development'

  return {
    plugins: [
      ...(isTest
        ? []
        : [
            tanstackStart({
              server: {
                entry: 'ssr',
              },
              vite: {
                // Nitro's FetchableDevEnvironment breaks SSR module loading in dev; use TanStack's middleware instead.
                installDevServerMiddleware: isViteDev,
              },
            }),
            react(),
            // Nitro is for production builds and preview; dev SSR is handled by TanStack Start.
            ...(isViteDev ? [] : [nitro()]),
          ]),
      ...(isTest ? [react()] : []),
    ],
    server: {
      port: 3000,
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
    },
  }
})
