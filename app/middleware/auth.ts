import { useAuthStore } from "~/stores/identity/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  if (!authStore.initialized) {
    await authStore.fetchMe();
  }
  if (!authStore.isAuthenticated) {
    return navigateTo(`/auth/login?redirect=${to.fullPath}`);
  }
});
