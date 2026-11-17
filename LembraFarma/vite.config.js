import { cpSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const staticDirectories = [
  "assets",
  "css",
];

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      },

    },
  },
  plugins: [
    {
      name: "copy-static-assets",
      apply: "build",
      closeBundle() {
        const outputDirectory = resolve(process.cwd(), "dist");
        for (const directory of staticDirectories) {
          cpSync(
            resolve(process.cwd(), directory),
            resolve(outputDirectory, directory),
            { recursive: true },
          );
        }
      },
    },
  ],
});
