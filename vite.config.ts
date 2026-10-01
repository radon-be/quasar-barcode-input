import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        components: "src/components.ts",
        "boot/register": "src/boot/register.ts",
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ["vue", "quasar", "quasar/wrappers", "@vueuse/core"],
    },
  },
});
