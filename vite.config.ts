import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true,
    port: 43123,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 43123,
    strictPort: true,
  },
});
