export default defineAppConfig({
  ui: {
    // flower-shop-ui-spec.md — 1-bo'lim: @nuxt/ui rang nomlarini
    // main.css'dagi --color-primary-* / --color-neutral-* tokenlariga bog'laydi
    colors: {
      primary: "primary",
      neutral: "neutral",
    },
    button: {
      slots: {
        base: "rounded-full",
      },
    },
  },
});
