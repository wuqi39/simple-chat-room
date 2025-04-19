import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      // 添加更明确的路径映射
      'tim-js-sdk': path.resolve(__dirname, 'node_modules/tim-js-sdk/index.js')
    }
  },
  build: {
    // 确保构建时包含 SDK
    rollupOptions: {
      external: ['tim-js-sdk'] 
    }
  }
})
