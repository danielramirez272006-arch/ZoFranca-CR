import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        operaciones: fileURLToPath(new URL('./operaciones.html', import.meta.url)),
        login: fileURLToPath(new URL('./login.html', import.meta.url)),
        recuperar: fileURLToPath(new URL('./recuperar.html', import.meta.url)),
      },
    },
  },
})
