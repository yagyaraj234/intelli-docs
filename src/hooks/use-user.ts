import { create } from "zustand";

interface UserState {
  email: string;
  id: string;
}

export const useUser = create((set) => ({
  user: null,
  setUser: (user: UserState | null) => set({ user }),
  logout: () => set({ user: null }),
}));
