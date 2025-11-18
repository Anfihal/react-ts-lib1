import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/react-ts-lib1/',
  server: {
    // Для разработки - редирект с базового пути
    open: '/react-ts-lib1/'
  }
})
