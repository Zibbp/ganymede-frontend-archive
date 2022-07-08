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

            // await $fetch(`${this.apiURL}/api/v1/auth/me`, {
            //     method: 'GET', credentials: 'include',
            //     async onResponseError({ request, response, options }) {
            //         if (response.status === 401) {

            //             await $fetch(`${this.apiURL}/api/v1/auth/refresh`, {
            //                 method: 'POST', credentials: 'include'
            //             }).then(async (resp) => {
            //                 console.log("Success on refresh")
            //             }).catch(async (error) => {
            //                 console.log("Error on refresh")
            //             })

            //         }
            //     }
            // }).then(resp => {
            //     this.user = resp.data
            //     this.isAuthenticated = true
            // })


            // try {
            //     console.log(this.apiURL)
            //     const resp = await $fetch(`${this.apiURL}/api/v1/auth/me`, { method: 'GET', credentials: 'include' })
            //     this.user = resp.data
            //     this.isAuthenticated = true
            // } catch (error) {
            //     try {
            //         await $fetch(`${this.apiURL}/api/v1/auth/refresh`, { method: 'POST', credentials: 'include' })
            //         const resp = await $fetch(`${this.apiURL}/api/v1/auth/me`, { method: 'GET', credentials: 'include' })
            //         this.user = resp.data
            //         this.isAuthenticated = true
            //     } catch (error) {
            //         console.log("[Auth Store] Fresh request failed", error)
            //     }

            // }


            // Check if user is authenticated
            // const { $axios } = useNuxtApp()
            // try {
            //     const resp = await $axios.get(`${this.apiURL}/api/v1/auth/me`, { withCredentials: true })
            //     this.user = resp.data
            //     this.isAuthenticated = true
            // } catch (error) {
            //     // Attempt token refresh
            //     try {
            //         await $axios.post(`${this.apiURL}/api/v1/auth/refresh`, {}, { withCredentials: true })
            //         const resp = await $axios.get(`${this.apiURL}/api/v1/auth/me`, { withCredentials: true })
            //         this.user = resp.data
            //         this.isAuthenticated = true
            //     } catch (error) {
            //         // User is not authenticated
            //         this.user = null
            //         this.isAuthenticated = false
            //     }

            // }
        },
        async refreshToken() {
            // Attempt to refresh token
            const { $axios } = useNuxtApp()
            try {
                await $axios.post(`${this.apiURL}/api/v1/auth/refresh`, {}, { withCredentials: true })
            } catch (error) {
                // User is not authenticated
                this.user = null
                this.isAuthenticated = false
            }
        }

    },
    getters: {
        checkIsAuthenticated(state) {
            return state.isAuthenticated
        }
    }
})
