import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    // ✅ Reduce bundle size
    chunkSizeWarningLimit: 800,   // optional: remove warning

    // ✅ Code-splitting & better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          // split vendor libraries
          if (id.includes("node_modules")) {
            return "vendor";
          }

          // ✅ optional: separate heavy libraries
          if (id.includes("react")) return "react";
          if (id.includes("@mui")) return "mui";
          if (id.includes("lodash")) return "lodash";
        },
      },
    },

    // ✅ Compress output files
    minify: "esbuild",

    // ✅ Smaller output for images & JS
    assetsInlineLimit: 0,
  },
});
