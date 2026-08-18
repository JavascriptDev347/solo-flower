export function useAuthToken() {
  // cookie orqali — SSR va client ikkalasida ham ishlaydi
  const accessToken = useCookie<string | null>("access_token", {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
  const refreshToken = useCookie<string | null>("refresh_token", {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });

  function setTokens(access: string, refresh?: string) {
    accessToken.value = access;
    if (refresh) refreshToken.value = refresh;
  }

  function clearTokens() {
    accessToken.value = null;
    refreshToken.value = null;
  }

  return { accessToken, refreshToken, setTokens, clearTokens };
}
