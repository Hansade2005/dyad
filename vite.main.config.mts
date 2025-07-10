import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: ".vite/build",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      formats: ["cjs"],
      fileName: () => "main.js",
    },
    rollupOptions: {
      external: [
        "better-sqlite3",
        "node:fs",
        "node:fs/promises",
        "node:path",
        "fs-extra",
        "default-shell",
        "node:os",
        "worker_threads",
        "node:worker_threads",
        "util",
        "node:util"
      ],
      output: {
        sourcemap: true,
      },
    },
  },
  plugins: [
    {
      name: "restart",
      closeBundle() {
        process.stdin.emit("data", "rs");
      },
    },
  ],
});