import type {
  RegisterPayload,
  LoginPayload,
  RegisterResponse,
  AuthTokens,
  MeResponse,
} from "~/types/auth";

export function useAuth() {
  const api = useApi();

  const register = (payload: RegisterPayload) =>
    api.post<RegisterResponse>("/auth/register", payload);

  const login = (payload: LoginPayload) =>
    api.post<AuthTokens>("/auth/login", payload);

  const refresh = (refreshToken: string) =>
    api.post<AuthTokens>(
      "/auth/refresh",
      { refresh_token: refreshToken },
      { silent: true },
    );

  const me = () => api.get<MeResponse>("/auth/me", undefined, { silent: true });

  return { register, login, refresh, me };
}
