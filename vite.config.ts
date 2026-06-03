/// <reference types="vitest" />

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
  plugins: [
    ...(mode === 'test'
      ? []
      : [
          tanstackStart({
            server: {
              entry: 'ssr',
            },
          }),
          nitro(),
        ]),
    react(),
  ],
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
}))
