import { useAuthStore } from "~/stores/AuthStore";

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()
    if (!authStore.checkIsAuthenticated) {
        navigateTo({
            path: '/login'
        })
    }
})