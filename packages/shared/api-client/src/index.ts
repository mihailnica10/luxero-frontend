const API_BASE = (import.meta.env.VITE_API_URL || "").trim() || "http://localhost:3000";

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export class ApiResponseError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiResponseError";
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE}${path}`;
  if (params) {
    const searchParams = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    );
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const token = localStorage.getItem("auth_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    method,
    headers,
    credentials: "include",
    ...fetchOptions,
  });

  const data = await response.json();

  const AUTH_PATHS = ["/api/auth/login", "/api/auth/register", "/api/auth/reset-password", "/api/auth/forgot-password", "/api/auth/verify-email", "/api/auth/resend-verification"];
  const isAuthPath = AUTH_PATHS.some((p) => url.includes(p));

  if (!response.ok) {
    if (response.status === 401 && !isAuthPath) {
      localStorage.removeItem("auth_token");
      const loginUrl = import.meta.env.VITE_LOGIN_URL || "/auth/login";
      window.location.href = loginUrl;
    }
    const apiError = data as ApiError;
    throw new ApiResponseError(
      apiError?.error?.code || "UNKNOWN",
      apiError?.error?.message || "Request failed",
      response.status
    );
  }

  return data as T;
}

export const api = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>("GET", path, options);
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("POST", path, { ...options, body: JSON.stringify(body) });
  },

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("PUT", path, { ...options, body: JSON.stringify(body) });
  },

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("PATCH", path, { ...options, body: JSON.stringify(body) });
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>("DELETE", path, options);
  },
};

export type { RequestOptions };