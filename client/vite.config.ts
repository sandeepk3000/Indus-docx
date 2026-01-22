import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: [
      "313a2eae-d86f-4e46-b8dd-da27c7219c41-00-2igpp3ubm6gg8.sisko.replit.dev",
    ],
    port: 5173,
    strictPort: true,
    host: "0.0.0.0",
  },
});
