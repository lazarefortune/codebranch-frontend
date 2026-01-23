import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    env: {
        NODE_ENV: process.env.NODE_ENV || "test",
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_API_MODE: process.env.NEXT_PUBLIC_API_MODE,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
