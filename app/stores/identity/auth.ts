import { defineStore } from "pinia";
import type { RegisterPayload, LoginPayload, MeResponse } from "~/types/auth";
import { ApiError } from "~/types/api";
import { useAuth } from "~/composables/identity/useAuth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as MeResponse | null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === "admin",
  },

  actions: {
    async register(payload: RegisterPayload) {
      const { register } = useAuth();
      return register(payload);
    },

    async login(payload: LoginPayload) {
      const { login, me } = useAuth();
      const { setTokens } = useAuthToken();
      const tokens = await login(payload);
      setTokens(tokens.access_token, tokens.refresh_token);
      this.user = await me();
      return this.user;
    },

    async fetchMe() {
      const { me } = useAuth();
      const { accessToken } = useAuthToken();
      if (!accessToken.value) {
        this.initialized = true;
        return null;
      }
      try {
        this.user = await me();
      } catch (e) {
        if (e instanceof ApiError) this.user = null;
      } finally {
        this.initialized = true;
      }
      return this.user;
    },

    logout() {
      const { clearTokens } = useAuthToken();
      clearTokens();
      this.user = null;
      navigateTo("/auth/login");
    },
  },
});
