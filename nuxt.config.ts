export default defineNuxtConfig({
  compatibilityDate: "2025-02-02",
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",
    "nuxt-gtag"
  ],
  gtag: {
    id: 'G-B9ZJ5SK8JE'
  }
})