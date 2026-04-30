import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@luxero/api-client": path.resolve(__dirname, "../../packages/shared/api-client/src"),
      "@luxero/auth": path.resolve(__dirname, "../../packages/shared/auth/src"),
      "@luxero/cart": path.resolve(__dirname, "../../packages/shared/cart/src"),
      "@luxero/i18n": path.resolve(__dirname, "../../packages/shared/i18n/src"),
      "@luxero/types": path.resolve(__dirname, "../../packages/shared/types/src"),
      "@luxero/ui": path.resolve(__dirname, "../../packages/shared/ui/src"),
      "@luxero/utils": path.resolve(__dirname, "../../packages/shared/utils/src"),
    },
  },
  server: {
    port: 5173,
    allowedHosts: ["8a8c-213-233-108-194.ngrok-free.app"],
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
