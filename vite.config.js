
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // необходимо для относительных путей
  plugins: [vue()],
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),
      '@composables': resolve(__dirname, 'src/composables'),
      '@components': resolve(__dirname, 'src/components'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@constants': resolve(__dirname, 'src/constants'),
      '@directives': resolve(__dirname, 'src/directives'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "@src/assets/styles/variables" as *;
        @use "@src/assets/styles/mixins/index" as *;
      `
      }
    }
  },

})