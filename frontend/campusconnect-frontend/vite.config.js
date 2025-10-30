import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  // 👇 This ensures React Router paths always resolve to index.html
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
