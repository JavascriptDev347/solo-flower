// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    apiBaseServer:
      process.env.NUXT_API_BASE_SERVER || "http://host.docker.internal:8080",
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8080/api/v1",
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  modules: ["@nuxt/ui", "@pinia/nuxt", "nuxt-auth-utils", "@nuxtjs/i18n"],
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "light",
    fallback: "light",
  },
  i18n: {
    locales: [
      { code: "uz", iso: "uz-UZ", name: "O'zbekcha", file: "uz.json" },
      { code: "eng", iso: "en-US", name: "English", file: "eng.json" },
      { code: "ru", iso: "ru-RU", name: "Русский", file: "ru.json" },
    ],
    langDir: "locales",
    defaultLocale: "uz",
    strategy: "prefix_except_default",
    detectBrowserLanguage: false,
  },
  app: {
    head: {
      htmlAttrs: {
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
