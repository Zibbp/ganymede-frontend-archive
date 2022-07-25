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
            try {
                const resp = await $axios.post(`${this.apiURL}/api/v1/auth/login`, { username, password }, { withCredentials: true })
                this.user = resp.data
                this.isAuthenticated = true
            } catch (error) {
                throw error
            }
        },
        async register(username, password) {
            const { $axios } = useNuxtApp()
            try {
                await $axios.post(`${this.apiURL}/api/v1/auth/register`, { username, password })
            } catch (error) {
                throw error
            }
        },
        async logout() {
            useCookie("access-token").value = null
            useCookie("refresh-token").value = null
            this.user = null
            this.isAuthenticated = false
            navigateTo("/")
        },
        getters: {
            checkIsAuthenticated(state) {
                return state.isAuthenticated
            }
        }
    }
})