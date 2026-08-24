"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { get } from "@/lib/api";
import { cookie } from "@/lib/cookie-client";

import type { AuthContextType, AuthUser } from "@/types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return cookie.get("accessToken");
    }
    return null;
  });
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return !!cookie.get("accessToken");
    }
    return false;
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    let isMounted = true;
    if (token) {
      get<{ data: AuthUser }>("/user/profile")
        .then((res) => {
          if (isMounted && res?.data) {
            setUser(res.data);
          }
        })
        .catch(() => {
          if (isMounted) {
            cookie.remove("accessToken");
            setToken(null);
            setUser(null);
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = (newToken: string, newUser?: AuthUser) => {
    cookie.set("accessToken", newToken);
    setToken(newToken);
    if (newUser) {
      setUser(newUser);
    } else {
      get<{ data: AuthUser }>("/user/profile")
        .then((res) => {
          if (res?.data) setUser(res.data);
        })
        .catch(() => {
          // ignore
        });
    }
  };

  const logout = () => {
    cookie.remove("accessToken");
    setToken(null);
    setUser(null);
    queryClient.clear();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
