import { useAuthStore } from "~/stores/AuthStore";

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()
    const role = authStore.user.role
    if (role == "editor" || role == "admin") {
        return
    }
    return navigateTo("/")
})