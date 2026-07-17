import { defineConfig } from "vite";
import { resolve } from "node:path";

// Builds the embeddable widget bundle. The IIFE build exposes `window.Loop`
// (self-contained, deps inlined) for the one-line <script> embed; the ES build
// is for `import { init } from "@loop/widget"`.
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/loop/index.ts"),
      name: "Loop",
      formats: ["iife", "es"],
      fileName: (format) => (format === "iife" ? "loop.js" : "loop.mjs"),
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    target: "es2019",
    rollupOptions: { output: { exports: "named" } },
  },
});
