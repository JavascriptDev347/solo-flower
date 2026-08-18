// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8080/api/v1",
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  modules: ["@nuxt/ui", "@pinia/nuxt", "nuxt-auth-utils"],
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "light",
    fallback: "light",
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "uz",
        dir: "ltr", // Asl (arabcha/fors) versiya RTL edi — bizniki chapdan o'ngga
      },
      title: "Shukufa — Gullar do'koni",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },
  devServer: {
    host: "0.0.0.0",
  },
});
