export default defineNuxtConfig({
  app: {
    baseURL: '/test_supabase/', // baseURL: '/<repository>/'
    buildAssetsDir: 'docs' // don't use "_" at the begining of the folder name to avoids nojkill conflict
  },
  modules: [
    // https://github.com/nuxt-modules/supabase
    '@nuxtjs/supabase',
    // UI lib (will be soon open sourced)
    '@nuxthq/ui',
    // https://github.com/nuxt-modules/color-mode
    '@nuxtjs/color-mode'
  ],
  runtimeConfig: {
    public: {
      baseUrl: 'https://giga-watanabe.github.io/test_supabase/' || 'https://giga-watanabe.github.io/test_supabase/'
    }
  },
  ui: {
    colors: {
      primary: 'green'
    },
    icons: ['mdi', 'heroicons', 'heroicons-outline']
  },
  supabase: {
    redirectOptions: {
      login: '/',
      callback: '/confirm'
    }
  }
})
