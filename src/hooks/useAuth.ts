"use client";

import { signal } from "@preact/signals-react";
import { useEffect } from "react";

export type AuthUser = {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: "USER" | "ADMIN";
};

// Signals cho trạng thái xác thực
export const isAuthenticated = signal<boolean>(false);
export const user = signal<AuthUser | null>(null);
export const token = signal<string | null>(null);

// Khôi phục từ localStorage ngay khi load client
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
  // Đồng bộ đa tab (storage event không bắn cho chính tab hiện tại)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        token.value = e.newValue;
        isAuthenticated.value = !!e.newValue;
      }
      if (e.key === "user") {
        user.value = e.newValue ? JSON.parse(e.newValue) : null;
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (userData: AuthUser, accessToken: string) => {
    user.value = userData;
    token.value = accessToken;
    isAuthenticated.value = true;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
    }
    // [NOTE] Ở trang Login/Register: sau khi gọi login(...),
    // nên dùng router.replace("/") + router.refresh() để Navbar cập nhật tức thì.
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

  const isAdmin = () => user.value?.role === "ADMIN";

  return {
    isAuthenticated,
    user,
    login,
    logout,
    isAdmin,
  };
};
