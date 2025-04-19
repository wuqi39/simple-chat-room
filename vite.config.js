import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      'tim-js-sdk': path.resolve(__dirname, './node_modules/tim-js-sdk')
    }
  }
})
