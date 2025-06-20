import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import vercel from 'vite-plugin-vercel';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
    // Add server configuration for development server
    proxy: {
      // Proxy requests starting with /auzan-proteinmart to the backend server
      "/auzan-proteinmart": {
        target: "http://localhost:5000", // Your backend server address
        changeOrigin: true, // Change the origin of the host header to the target URL
        // The rewrite rule is not strictly necessary here if the backend path is the same,
        // but keeping it doesn't hurt and is good practice for clarity.
        // It means a request to /auzan-proteinmart/products will be forwarded as /auzan-proteinmart/products
        rewrite: (path) =>
          path.replace(/^\/auzan-proteinmart/, "/auzan-proteinmart"),
      },
    },
  },
  plugins: [vercel()],
});
