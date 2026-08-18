import { useAuthStore } from "~/stores/identity/auth";

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();
  if (!authStore.initialized) {
    await authStore.fetchMe();
  }
  if (authStore.isAuthenticated) {
    return navigateTo("/");
  }
});
