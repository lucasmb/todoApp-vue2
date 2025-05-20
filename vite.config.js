import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import vue2 from "@vitejs/plugin-vue2";

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue2(),

      legacy({
        targets: ["ie >= 11"],
        additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    // --- Crucial: Add or modify the 'base' option ---
    base: "./", // <-- Most common fix for relative path deployment
    build: {
      // Optional: for better browser compatibility in Vue 2 apps if needed
      target: "es2015",
      // Ensure the output directory is 'dist' (which is the default)
      outDir: "dist",
      // Other build options if you have them
    },
    envDir: process.cwd(),
    // envPrefix: ["VITE_", "CUSTOM_PREFIX_"], // Optional: Add custom prefixes
  };
});
