import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import path from "path";

export default ({ mode }: { mode: string }) => {
  const isProduction = mode === "production";
  const outDir = isProduction ? "../../ui/src" : "../../ui/src";

  return defineConfig({
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    define: {
      "process.env": process.env,
    },
    build: {
      outDir,
      emptyOutDir: false,
      cssCodeSplit: false,
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        formats: ["iife"],
        name: "LinkView",
        fileName: (format) => `link-view.${format}.js`,
      },
      sourcemap: false,
    },
  });
};
