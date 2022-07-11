import { useAuthStore } from "~/stores/AuthStore";
import { $fetch } from "ohmyfetch"

export const useApi = async (endpoint: string, config: Object) => {
    const { apiURL } = useRuntimeConfig()
    const router = useRouter();
    const authStore = useAuthStore();
    let once = false


    return await $fetch(`${apiURL}${endpoint}`, {
        ...config,
        async onResponseError({ request, response, options }) {
            // If 401 unauthorized attempt to refresh
            if (response.status === 401) {
                try {
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
                } catch (error) {
                    // Error refreshing token
                    console.error("[Use API] Error refreshing token", error)
                    router.push({ path: '/login' })
                }

            } else {
                throw response
            }
        }
    })

}

