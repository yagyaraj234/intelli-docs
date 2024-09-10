import { create } from "zustand";

interface UserState {
  email: string;
  id: string;
  plan: string;
}

interface UserStore {
  user: UserState | null;
  setUser: (user: UserState | null) => void;
  logout: () => void;
}

export const useUser = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
