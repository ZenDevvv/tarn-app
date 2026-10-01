import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
// defineConfig comes from vitest/config, not vite, so the `test` block typechecks.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    // DESIGN.md §11 requires screen-reader-friendly controls and jsdom gives a
    // DOM but no layout engine, so responsive *visual* claims are still verified
    // manually or in Playwright — not here.
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});