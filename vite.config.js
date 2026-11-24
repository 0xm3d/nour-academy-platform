import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  // Relative paths, so the build works on Vercel or any other host.
  base: "./",
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        // Space A: parent portal
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        // Space B: secretary and director back office
        dashboard: fileURLToPath(new URL("./dashboard.html", import.meta.url)),
        statistics: fileURLToPath(new URL("./statistics.html", import.meta.url)),
        // Space C: teacher area
        teacher: fileURLToPath(new URL("./teacher/index.html", import.meta.url))
      }
    }
  }
});
