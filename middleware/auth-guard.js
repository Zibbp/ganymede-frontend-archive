import { useAuthStore } from "~/stores/AuthStore";

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()
    console.log(authStore.checkIsAuthenticated)
    if (!authStore.checkIsAuthenticated) {
        navigateTo({
            path: '/login'
        })
    }
})