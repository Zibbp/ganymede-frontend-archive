import { useAuthStore } from "~/stores/AuthStore";

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore();
  const { apiURL } = useRuntimeConfig();
  const { $axios } = useNuxtApp();

  const accessCookie = useCookie("access-token");
  const refreshCookie = useCookie("refresh-token");

  const oauthAccessCookie = useCookie("oauth_access_token");
  const oauthRefreshCookie = useCookie("oauth_refresh_token");

  if (refreshCookie && refreshCookie.value) {
    // If a refresh cookie is detected attempt to use the current access token
    try {
      const resp = await $fetch(`${apiURL}/api/v1/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      authStore.user = resp;
      authStore.isAuthenticated = true;
      console.debug("[Auth Client] Fetched user data from access token.");
    } catch (error) {
      // If access token is expired attempt to refresh
      if (error.response.status === 401) {
        try {
          await $fetch(`${apiURL}/api/v1/auth/refresh`, {
            method: "POST",
            credentials: "include",
          });
          const resp = await $fetch(`${apiURL}/api/v1/auth/me`, {
            method: "GET",
            credentials: "include",
          });
          authStore.user = resp;
          authStore.isAuthenticated = true;
          console.debug("[Auth Client] Refreshed token and fetched user data.");
        } catch (error) {
          // Auth refresh failed
          console.debug("[Auth Client] Token refresh failed");
          return;
        }
      }
    }
  }

  if (oauthRefreshCookie && oauthRefreshCookie.value) {
    try {
      const resp = await $fetch(`${apiURL}/api/v1/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      authStore.user = resp;
      authStore.isAuthenticated = true;
      authStore.oauth = true;
      console.debug("[Auth Client] Fetched user data from access token.");
    } catch (error) {
      if (error.response.status === 401) {
        try {
          await $fetch(`${apiURL}/api/v1/auth/oauth/refresh`, {
            method: "GET",
            credentials: "include",
          });
          const resp = await $fetch(`${apiURL}/api/v1/auth/me`, {
            method: "GET",
            credentials: "include",
          });
          authStore.user = resp;
          authStore.isAuthenticated = true;
          authStore.oauth = true;
          console.debug("[Auth Client] Refreshed token and fetched user data.");
        } catch (error) {
          // Auth refresh failed
          console.debug("[Auth Client] Token refresh failed");
          return;
        }
      }
    }
  }

  return;
});
