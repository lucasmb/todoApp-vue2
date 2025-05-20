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

    envDir: process.cwd(),
    // envPrefix: ["VITE_", "CUSTOM_PREFIX_"], // Optional: Add custom prefixes
  };
});
