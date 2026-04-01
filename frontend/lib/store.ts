"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "patient" | "doctor" | null;

interface UserState {
  role: UserRole;
  userId: number | null;
  userName: string | null;
  setUser: (role: UserRole, userId: number | null, userName: string | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      role: null,
      userId: null,
      userName: null,
      setUser: (role, userId, userName) => set({ role, userId, userName }),
      logout: () => set({ role: null, userId: null, userName: null }),
    }),
    {
      name: "healthcare-user",
    }
  )
);
