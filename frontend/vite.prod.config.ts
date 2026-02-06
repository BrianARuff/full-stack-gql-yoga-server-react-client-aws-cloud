import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { exposedEnvVars } from "./vite.define.env.ts";

export const prodViteConfig = defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  define: exposedEnvVars,
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
    },
  },
  server: {
    port: 4173,
    host: "0.0.0.0",
  },
});
