import { useAuthStore } from "~/stores/AuthStore";
import { $fetch } from "ohmyfetch"

export const useApi = async (endpoint, config) => {
    const { apiURL } = useRuntimeConfig()
    const router = useRouter();
    const authStore = useAuthStore();

    try {
        return await $fetch(`${apiURL}${endpoint}`, {
            ...config,
        })
    } catch (error) {
        if (error.response.status === 401) {
            // Attempt refresh
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
                return await $fetch(`${apiURL}${endpoint}`, {
                    ...config,
                })
            } catch (error) {
                // Failed to refresh log out user
                console.error("[Use API] Error refreshing token", error)
                authStore.user = {};
                authStore.isAuthenticated = false
                router.push({ path: '/login' })
            }
        }
        throw error
    }
}

