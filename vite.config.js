import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss({
      content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
      ],
    }),
  ],
  resolve: {
    alias: {
      'tim-js-sdk': path.resolve(__dirname, 'node_modules/tim-js-sdk'),
    },
  },
  optimizeDeps: {
    include: ['tim-js-sdk'],
  },
});