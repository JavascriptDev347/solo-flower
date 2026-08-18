export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith("/admin")) return;

  const authStore = useAuthStore();
  if (!authStore.initialized) {
    await authStore.fetchMe();
  }

  if (!authStore.isAuthenticated) {
    return navigateTo(`/auth/login?redirect=${to.fullPath}`);
  }
  if (!authStore.isAdmin) {
    return navigateTo("/");
  }
});
