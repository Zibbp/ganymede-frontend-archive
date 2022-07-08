import { useAuthStore } from "~/stores/AuthStore";

export default defineNuxtRouteMiddleware((to, from) => {
    console.log('MIDDLEWARE INIT')
    const authStore = useAuthStore()
    if (!authStore.checkIsAuthenticated) {
        navigateTo({
            path: '/login'
        })
    }
})