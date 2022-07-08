import { useAuthStore } from "~/stores/AuthStore";

export const useAuthGuard = async () => {
    const router = useRouter()
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
        console.debug("[Auth Guard] Not authenticated - redirecting to login")
        return router.push("/login")
    }
}

export const useRoleGuard = async (role: string) => {
    const router = useRouter()
    const authStore = useAuthStore()
    const userRole = authStore.user.role;

    switch (role) {
        case "admin":
            if (userRole == "admin") {
                // do nothing (continue)

            } else {
                console.debug("[Role Guard] Not admin - redirecting")
                return router.push("/")
            }
        case "editor":
            if (userRole == "editor" || userRole == "admin") {
                // do nothing (continue)
            } else {
                console.debug("[Role Guard] Not editor or admin - redirecting");
                return router.push("/");
            }
        case "archiver":
            if (userRole == "archiver" || userRole == "editor" || userRole == "admin") {
                // do nothing (continue)
            } else {
                console.debug("[Role Guard] Not archiver, editor, or admin - redirecting");
                return router.push("/");
            }

        default:
            break;
    }
}