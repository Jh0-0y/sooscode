
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";


export default defineConfig({
  plugins: [react()],
    define: {
        global: 'globalThis',
    },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
