import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/C02_QT_demo/" ,
  plugins: [react()],
});
