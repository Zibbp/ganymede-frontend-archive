import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            apiURL: '',
            cdnURL: ''
        }
    },
    ssr: false,
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
        '@kevinmarrec/nuxt-pwa',
    ],
    windicss: {
        analyze: true
    },
    pwa: {
        meta: {
            // Generate splash screens for iOS
            mobileAppIOS: true
        },
        workbox: {
            enabled: true
        }
    },
    axios: {
        credentials: true,
    }

})
