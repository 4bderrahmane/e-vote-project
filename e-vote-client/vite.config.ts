import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, "src/shared/components"),
      '@features': path.resolve(__dirname, "src/shared/features"),
      '@pages': path.resolve(__dirname, "src/shared/pages"),
      '@types': path.resolve(__dirname, "src/shared/types"),
    },
  },
});