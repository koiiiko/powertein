import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import vercel from 'vite-plugin-vercel';

export default defineConfig({
  plugins: [react(), vercel()],
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: process.env.PORT,
    proxy: {
      // Proxy requests starting with /auzan-proteinmart to the backend server
      "/auzan-proteinmart": {
        target: "http://localhost:5000", // Your backend server address
        changeOrigin: true, 
        rewrite: (path) =>
          path.replace(/^\/auzan-proteinmart/, "/auzan-proteinmart"),
      },
    },
  },
});
