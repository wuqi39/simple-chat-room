import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      // 指向 SDK 目录而非具体文件
      'tim-js-sdk': path.resolve(__dirname, 'node_modules/tim-js-sdk')
    }
  }
});