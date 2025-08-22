"use client";

import { signal } from "@preact/signals-react";

export type AuthUser = {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: "USER" | "ADMIN";
};

// Tạo signals cho trạng thái xác thực
export const isAuthenticated = signal<boolean>(false);
export const user = signal<AuthUser | null>(null);
export const token = signal<string | null>(null);

// Khôi phục trạng thái đăng nhập từ localStorage ngay lập tức
if (typeof window !== "undefined") {
  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  if (savedToken) {
    token.value = savedToken;
    isAuthenticated.value = true;
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser);
      } catch {
        user.value = null;
      }
    }
  }
}

export const useAuth = () => {
  // Optional: Sync with localStorage changes across tabs
  const login = (userData: AuthUser, accessToken: string) => {
    user.value = userData;
    token.value = accessToken;
    isAuthenticated.value = true;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const isAdmin = () => {
    return user.value?.role === "ADMIN";
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    isAdmin,
  };
};
