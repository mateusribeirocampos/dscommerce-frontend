"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { login as apiLogin } from "@/app/services/authService";

const TOKEN_KEY = "dscommerce:token";

type JwtPayload = {
  sub: string;
  authorities: string[];
  exp: number;
};

function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64 = token.split(".")[1];
    return JSON.parse(atob(base64)) as JwtPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload) return true;
  return payload.exp * 1000 < Date.now();
}

// ── Context shape ─────────────────────────────────────────────────────────────
type AuthContextType = {
  token: string | null;
  userName: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Hydrate from localStorage on mount (runs only on client)
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored && !isTokenExpired(stored)) {
      applyToken(stored);
    } else {
      // Clear expired token
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  const applyToken = (raw: string) => {
    const payload = decodeJwt(raw);
    setToken(raw);
    setUserName(payload?.sub ?? null);
    setIsAdmin(payload?.authorities?.includes("ROLE_ADMIN") ?? false);
  };

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiLogin(email, password);
    localStorage.setItem(TOKEN_KEY, response.access_token);
    applyToken(response.access_token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUserName(null);
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        userName,
        isAdmin,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
