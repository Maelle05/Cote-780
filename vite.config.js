import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import hotEnvMap from './src/config/hotEnvMap/hotEnvMap';
import hotShaders from './src/config/hotShaders/hotShadersRollupPlugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    hotShaders({ isDev: true }),
		hotEnvMap({ isDev: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
