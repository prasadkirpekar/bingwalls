export default defineNuxtConfig({
  compatibilityDate: "2025-02-02",
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",
    "nuxt-gtag",
    "@nuxtjs/sitemap"
  ],
  gtag: {
    id: 'G-B9ZJ5SK8JE'
  },
  site: { 
    url: 'https://bingwalls.com',
  },
})