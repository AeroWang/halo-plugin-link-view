import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";

export default defineConfig({
    server: {
        port: 3007,
        proxy: {
            "/link-view/api": {
                target: "http://localhost:8090",
                changeOrigin: true,
            }
        }
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },

});
