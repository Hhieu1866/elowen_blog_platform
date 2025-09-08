"use client";

import { signal } from "@preact/signals-react";
import { useEffect, useRef } from "react";

export type AuthUser = {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: "USER" | "ADMIN";
};

export const isAuthenticated = signal<boolean>(false);
export const user = signal<AuthUser | null>(null);
export const token = signal<string | null>(null);

export const useAuth = () => {
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (!bootstrapped.current) {
      bootstrapped.current = true;
      try {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        token.value = savedToken;
        isAuthenticated.value = !!savedToken;
        user.value = savedUser ? JSON.parse(savedUser) : null;
      } catch {
        token.value = null;
        isAuthenticated.value = false;
        user.value = null;
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      try {
        if (e.key === "token") {
          token.value = e.newValue;
          isAuthenticated.value = !!e.newValue;
        }
        if (e.key === "user") {
          user.value = e.newValue ? JSON.parse(e.newValue) : null;
        }
      } catch {}
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (userData: AuthUser, accessToken: string) => {
    user.value = userData;
    token.value = accessToken;
    isAuthenticated.value = true;
    try {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch {}
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {}
  };

  const isAdmin = () => user.value?.role === "ADMIN";

  return {
    isAuthenticated,
    user,
    login,
    logout,
    isAdmin,
    token,
  };
};
