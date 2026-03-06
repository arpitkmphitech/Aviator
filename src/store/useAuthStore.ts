"use client";
import Cookies from "js-cookie";
import { create } from "zustand";

interface IAuthStore {
  token: string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  token: Cookies.get("token") || null,
  setToken: (token: string) => {
    Cookies.set("token", token, {
      expires: 7,
      path: "/",
      sameSite: "lax",
    });
    set({ token });
  },
  removeToken: () => {
    Cookies.remove("token", {
      path: "/",
      sameSite: "lax",
    });
    set({ token: null });
  },
}));
