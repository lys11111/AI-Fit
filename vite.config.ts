import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const httpsKeyPath = process.env.VITE_HTTPS_KEY
const httpsCertPath = process.env.VITE_HTTPS_CERT
const proxyBackend = process.env.VITE_PROXY_BACKEND

const https =
  httpsKeyPath && httpsCertPath
    ? {
        key: fs.readFileSync(httpsKeyPath),
        cert: fs.readFileSync(httpsCertPath),
      }
    : undefined

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['.trycloudflare.com', 'localhost', '127.0.0.1'],
    https,
    proxy: proxyBackend
      ? {
          '/api': {
            target: proxyBackend,
            changeOrigin: true,
            secure: false,
          },
        }
      : undefined,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
