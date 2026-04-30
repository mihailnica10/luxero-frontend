import { createContext, type ReactNode, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@luxero/api-client";
import type { ApiResponse, AuthResponse, User } from "@luxero/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Record<string, unknown>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<User>>("/api/auth/me");
      setUser(res.data);
    } catch {
      localStorage.removeItem("auth_token");
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("auth_token");
    if (stored) {
      setToken(stored);
      fetchMe();
    } else {
      setIsLoading(false);
    }
  }, [fetchMe]);

  function setAuth(newToken: string, newUser: User) {
    localStorage.setItem("auth_token", newToken);
    setToken(newToken);
    setUser(newUser);
  }

  function clearAuth() {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
  }

  async function login(email: string, password: string) {
    const res = await api.post<AuthResponse>("/api/auth/login", { email, password });
    setAuth(res.token, res.user);
  }

  async function register(email: string, password: string, fullName: string) {
    const res = await api.post<AuthResponse>("/api/auth/register", { email, password, fullName });
    setAuth(res.token, res.user);
  }

  function logout() {
    clearAuth();
  }

  async function updateProfile(data: Record<string, unknown>) {
    const res = await api.put<ApiResponse<User>>("/api/me/profile", data);
    setUser((prev) => (prev ? { ...prev, ...res.data } : null));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin: user?.isAdmin ?? false,
        setAuth,
        clearAuth,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}