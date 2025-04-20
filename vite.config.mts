import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), reactRefresh()],

  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },

  server: {
    port: 7001,
    proxy: {
      '/api/passport': {
        target: 'http://localhost:7003',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: 'build',
  },
})
