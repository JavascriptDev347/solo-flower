import type { ApiEnvelope } from "~/types/api";
import { ApiError } from "~/types/api";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  query?: Record<string, any>;
  headers?: Record<string, string>;
  silent?: boolean;
  isFormData?: boolean;
  _isRetry?: boolean;
}

const STATUS_MESSAGES: Record<number, string> = {
  400: "Kiritilgan ma'lumotlarda xatolik bor",
  401: "Sessiya tugagan, qaytadan kiring",
  403: "Bu amal uchun huquqingiz yetarli emas",
  404: "So'ralgan resurs topilmadi",
  409: "Bunday ma'lumot allaqachon mavjud",
  500: "Server xatosi, keyinroq urinib ko'ring",
};

// Bir vaqtda bir nechta 401 kelsa, refresh so'rovi faqat bitta marta ketishi uchun
let refreshPromise: Promise<boolean> | null = null;

export function useApi() {
  const config = useRuntimeConfig();
  const { accessToken, refreshToken, setTokens, clearTokens } = useAuthToken();
  const notify = useNotify();

  async function tryRefreshToken(): Promise<boolean> {
    if (!refreshToken.value) return false;

    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const res = await $fetch<
            ApiEnvelope<{ access_token: string; refresh_token: string }>
          >("/auth/refresh", {
            baseURL: config.public.apiBase,
            method: "POST",
            body: { refresh_token: refreshToken.value },
          });
          if (res.data?.access_token) {
            setTokens(res.data.access_token, res.data.refresh_token);
            return true;
          }
          return false;
        } catch {
          return false;
        } finally {
          refreshPromise = null;
        }
      })();
    }
    return refreshPromise;
  }

  async function request<T = any>(
    url: string,
    opts: RequestOptions = {},
  ): Promise<T> {
    const headers: Record<string, string> = { ...opts.headers };

    if (accessToken.value) {
      headers.Authorization = `Bearer ${accessToken.value}`;
    }
    if (!opts.isFormData) {
      headers["Content-Type"] = "application/json";
    }

    try {
      const res = await $fetch<ApiEnvelope<T>>(url, {
        baseURL: config.public.apiBase,
        method: opts.method || "GET",
        body: opts.body,
        query: opts.query,
        headers,
      });
      return res.data as T;
    } catch (err: any) {
      const status: number = err?.response?.status || err?.statusCode || 500;
      const serverError: string | undefined =
        err?.response?._data?.error || err?.data?.error;

      // 401 kelsa va bu qayta urinish bo'lmasa — refresh qilib, so'rovni qaytadan yuborishga harakat qilamiz
      if (
        status === 401 &&
        !opts._isRetry &&
        url !== "/auth/refresh" &&
        url !== "/auth/login"
      ) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          return request<T>(url, { ...opts, _isRetry: true });
        }
        clearTokens();
        if (!opts.silent) notify.error("Sessiya tugadi, qaytadan kiring");
        await navigateTo("/auth/login");
        throw new ApiError(401, "Sessiya tugadi");
      }

      const friendly =
        STATUS_MESSAGES[status] || "Kutilmagan xatolik yuz berdi";
      if (!opts.silent) {
        notify.error(serverError || friendly);
      }
      throw new ApiError(status, friendly, serverError);
    }
  }

  return {
    get: <T = any>(
      url: string,
      query?: Record<string, any>,
      opts?: RequestOptions,
    ) => request<T>(url, { ...opts, method: "GET", query }),
    post: <T = any>(url: string, body?: any, opts?: RequestOptions) =>
      request<T>(url, { ...opts, method: "POST", body }),
    put: <T = any>(url: string, body?: any, opts?: RequestOptions) =>
      request<T>(url, { ...opts, method: "PUT", body }),
    patch: <T = any>(url: string, body?: any, opts?: RequestOptions) =>
      request<T>(url, { ...opts, method: "PATCH", body }),
    delete: <T = any>(url: string, opts?: RequestOptions) =>
      request<T>(url, { ...opts, method: "DELETE" }),
    upload: <T = any>(url: string, formData: FormData, opts?: RequestOptions) =>
      request<T>(url, {
        ...opts,
        method: "POST",
        body: formData,
        isFormData: true,
      }),
  };
}
