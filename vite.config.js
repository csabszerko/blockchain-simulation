import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  root: "ui/",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  // extensions: [".ts", ".tsx", ".js", ".jsx"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./ui/src"),
    },
  },
});
