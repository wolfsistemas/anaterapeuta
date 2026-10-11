import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE || process.env.VITE_BASE || '/'

  return {
    plugins: [react()],
    base,
    server: {
      host: true,
      port: 5173,
      allowedHosts: ['.monkeycode-ai.live', 'localhost'],
      proxy: {
        '/api': {
          target: process.env.VITE_API_PROXY || 'http://localhost:54321',
          changeOrigin: true,
        },
      },
    },
    preview: {
      host: true,
      port: 4173,
      allowedHosts: ['.monkeycode-ai.live', 'localhost'],
    },
  }
})
