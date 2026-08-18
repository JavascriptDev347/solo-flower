export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.initialized) {
    await authStore.fetchMe();
  }

  if (!authStore.isAuthenticated) {
    return navigateTo(`/auth/login?redirect=${to.fullPath}`);
  }

  if (!authStore.isAdmin) {
    // login qilgan, lekin admin emas — customer sahifasiga qaytaramiz
    return navigateTo("/");
  }
});
