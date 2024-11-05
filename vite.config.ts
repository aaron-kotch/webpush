import path from "path"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";
// import basicSsl from "@vitejs/plugin-basic-ssl";

// const manifest = {
//   name: "Melon App",
//   short_name: "melon-app",
//   description: "I am a simple vite app",
//   icons: [
//     {
//       src: "/android-chrome-192x192.png",
//       sizes: "192x192",
//       type: "image/png",
//       purpose: "favicon",
//     },
//     {
//       src: "/android-chrome-512x512.png",
//       sizes: "512x512",
//       type: "image/png",
//       purpose: "favicon",
//     },
//     {
//       src: "/apple-touch-icon.png",
//       sizes: "180x180",
//       type: "image/png",
//       purpose: "apple touch icon",
//     },
//     {
//       src: "/maskable_icon.png",
//       sizes: "512x512",
//       type: "image/png",
//       purpose: "any maskable",
//     },
//   ],
//   theme_color: "#171717",
//   background_color: "#f0e7db",
//   display: "standalone",
//   scope: "/",
//   start_url: "/",
//   orientation: "portrait",
// };

const manifestForPlugIn = {
  // includeAssests: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  // registerType: null,
  // outDir: path.resolve(__dirname, "public"),
  // manifest: manifest,
  // manifestFilename: "manifest.webmanifest",
  injectRegister: "auto",

  // HERE! For custom service worker
  // srcDir: path.resolve(__dirname, "src/"),
  // filename: "serviceWorker.js",
  // strategies: "injectManifest",

  // workbox: {
  //   globDirectory: path.resolve(__dirname, "public"),
  //   globPatterns: [
  //     "{dist,images,sounds,icons}/**/*.{js,css,html,ico,png,jpg,mp4,svg}",
  //   ],
  // },
};

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true as any,
  },
  plugins: [react(), VitePWA(manifestForPlugIn as any), mkcert()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
