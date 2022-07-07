import { useAuthStore } from "~/stores/AuthStore";

import { $fetch } from "ohmyfetch"

export const useApi = async (endpoint: string, config: Object) => {
    const { apiURL } = useRuntimeConfig()
    const authStore = useAuthStore();
    let once = false


    return await $fetch(`${apiURL}${endpoint}`, {
        ...config,
        async onResponseError({ request, response, options }) {
            // If 401 unauthorized attempt to refresh
            if (response.status === 401) {
                await $fetch(`${apiURL}/api/v1/auth/refresh`, {
                    method: "POST",
                    credentials: "include",
                    async onResponseError({ request, response, options }) {
                        console.debug("[Use API] Refresh error", response)
                        return Promise.reject(response)
                    }
                })
                console.debug("[Use API] Refreshed token")
                // Run request again
                return await $fetch(request, {
                    ...options,
                    credentials: "include"
                })

            }
        }
    })



    // try {
    //     return await client(endpoint, config)
    // } catch (requestError) {
    //     if (requestError.response.status === 401) {
    //         try {
    //             await client('/auth/refresh', { method: 'POST', credentials: 'include' })
    //             return await client(endpoint, config)
    //         } catch (refreshError) {
    //             await navigateTo("/login")
    //             return Promise.reject(refreshError)
    //         }
    //     } else {
    //         return Promise.reject(requestError)
    //     }
    // }

    // $axios.interceptors.response.use((response) => {
    //     return response
    // }, async (error) => {
    //     const originalRequest = error.config
    //     // Unauthorized - try to refresh token
    //     if (error.response?.status === 401 && !originalRequest.isRetry) {
    //         originalRequest.isRetry = true
    //         console.debug("[USE API] Unauthorized - trying to refresh token")
    //         try {
    //             await authStore.refreshToken()
    //             console.debug("[USE API] Token refreshed")
    //             // Retry original request
    //             return $axios(originalRequest)
    //         } catch (error) {
    //             return Promise.reject(refreshError)
    //         }
    //     }
    //     return Promise.reject(error)
    // })


    // // try {
    // const resp = await $axios({
    //     method,
    //     url: `${apiURL}${url}`,
    //     data,
    //     withCredentials: credentials
    // })
    // return resp.data
    // // } catch (error) {
    // //     throw error
    // // }
}

