// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  ssr: false,

  css: ['~/assets/scss/app.scss'],

  modules: ['@nuxt/icon', '@nuxtjs/supabase'],

  supabase: {
    url: process.env.VUE_APP_SUPABASE_URL,
    key: process.env.VUE_APP_SUPABASE_KEY,
    redirect: false,
  },

  devServer: {
    host: '0.0.0.0', // default: localhost, 0.0.0.0 means using local IP
    port: 3000
  }
})