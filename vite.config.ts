
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/build-a-rhythm/' : '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        teamRhythms: path.resolve(__dirname, 'team-rhythms/index.html'),
        visualizer: path.resolve(__dirname, 'visualizer/index.html'),
        builder: path.resolve(__dirname, 'builder/index.html'),
      },
    },
  },
  assetsInclude: ['**/*.md']
}));
