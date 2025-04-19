import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    mainFields: ['module', 'main'], // 支持 CommonJS 模块
    alias: {
      'tim-js-sdk': path.resolve(__dirname, 'node_modules/tim-js-sdk/index.js')
    }
  },
  build: {
    rollupOptions: {
      // external: ['tim-js-sdk'] // 完全移除该配置
    }
  }
});