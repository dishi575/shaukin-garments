import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, authApi } from "./api";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      setUser: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("sg_token", token);
        }
        set({ user, token });
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await authApi.login(email, password);
          if (typeof window !== "undefined") {
            localStorage.setItem("sg_token", data.access_token);
          }
          set({ user: data.user, token: data.access_token, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("sg_token");
        }
        set({ user: null, token: null });
      },
    }),
    {
      name: "shaukin-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
