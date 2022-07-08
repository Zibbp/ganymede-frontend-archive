import { useAuthStore } from "~/stores/AuthStore";


export default defineNuxtPlugin(async () => {
    const authStore = useAuthStore();
    const { apiURL } = useRuntimeConfig();
    // await authStore.init();

    console.log("PLUGIN")

    // await $fetch(`${apiURL}/api/v1/auth/me`, {
    //     method: 'GET', credentials: 'include'
    // }).then(async (resp) => {
    //     console.log(resp.data)
    //     authStore.user = resp.data
    //     authStore.isAuthenticated = true
    // }
    // )

    try {
        const resp = await $fetch(`${apiURL}/api/v1/auth/me`, { method: 'GET', credentials: 'include' })
        console.log(resp.data)
    } catch (error) {
        console.log("plugin http error", error)
    }


})