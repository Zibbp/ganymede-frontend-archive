import { defineStore } from "pinia"


export const useAuthStore = defineStore('AuthStore', {
    state: () => {

        const { apiURL } = useRuntimeConfig();

        return {
            apiURL,
            user: null,
            isAuthenticated: false
        }
    },
    actions: {
        async login(username, password) {
            const { $axios } = useNuxtApp()

            console.log(username, password)
            try {
                const resp = await $axios.post(`${this.apiURL}/api/v1/auth/login`, { username, password }, { withCredentials: true })
                this.user = resp.data
                this.isAuthenticated = true
            } catch (error) {
                throw error
            }
        },
        async init() {
            // Runs on initial application load
            console.log("[Auth Store] Init")

            // Check if user is authenticated
            const { $axios } = useNuxtApp()
            try {
                const resp = await $axios.get(`${this.apiURL}/api/v1/auth/me`, { withCredentials: true })
                this.user = resp.data
                this.isAuthenticated = true
            } catch (error) {
                // Attempt token refresh
                try {
                    await $axios.post(`${this.apiURL}/api/v1/auth/refresh`, {}, { withCredentials: true })
                    const resp = await $axios.get(`${this.apiURL}/api/v1/auth/me`, { withCredentials: true })
                    this.user = resp.data
                    this.isAuthenticated = true
                } catch (error) {
                    // User is not authenticated
                    this.user = null
                    this.isAuthenticated = false
                }

            }
        }

    },
    getters: {
        checkIsAuthenticated(state) {
            return state.isAuthenticated
        }
    }
})
