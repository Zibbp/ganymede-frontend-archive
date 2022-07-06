import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            apiURL: '',
            cdnURL: ''
        }
    },
    css: [
        // 'primevue/resources/themes/lara-light-purple/theme.css',
        // 'primevue/resources/themes/lara-dark-purple/theme.css',
        'primevue/resources/primevue.css',
        'primeicons/primeicons.css',
        'primeflex/primeflex.css',
        'plyr/dist/plyr.css'
    ],
    components: {
        dirs: [
            `~/components`
        ]
    },
    build: {
        transpile: ['primevue']
    },
    modules: [
        '@vueuse/nuxt',
        'nuxt-windicss',
        '@pinia/nuxt',
        "@nuxtjs-alt/axios",
    ],
    windicss: {
        analyze: true
    },
    axios: {
        credentials: true,
    }

})
