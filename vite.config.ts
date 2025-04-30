import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/test_1_guesthouse/', // 👈 リポジトリ名に置き換えてください
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});