import { useAuthStore } from "~/stores/AuthStore";

export default defineNuxtRouteMiddleware((to, from) => {

    const router = useRouter()


    if (process.client) {
        const authStore = useAuthStore()
        console.log("Client process in auth-guard...Is AUth?: ", authStore.isAuthenticated)
        if (!authStore.isAuthenticated) {
            console.log("[Auth Guard] User is not authenticated. Redirecting to login.")
            return router.push('/login')
        }
    }
    // const userData = useState("auth-user");
    // console.log("Middleware use-state", userData.value);
    // const router = useRouter()

    // const app = useNuxtApp();

    // const authStore = useAuthStore()
    // console.log(authStore.isAuthenticated)

    // const redirect = async (path) => {
    //     if (!!app.ssrContext) {
    //         app.ssrContext.res.writeHead(302, {
    //             Location: path,
    //         })
    //         return app.ssrContext.res.end()
    //     }
    //     return await useRouter().push(path)
    // }

    // if (authStore.isAuthenticated == false) {
    //     return redirect('/login')
    // }

})