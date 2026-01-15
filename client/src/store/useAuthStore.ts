import { create } from 'zustand';
import { apiWrapper } from "@/lib/apiWrapper";

export interface LoginPayload {
  name: string;
  email: string;
  oauth_id: string;
  provider: string;
  image: string;
}

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (data: LoginPayload) => Promise<void>;
  logout: () => void;
  hydrate: () => void; // Check localStorage on mount
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (data: LoginPayload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiWrapper<{ message: string; user: any; token: string }>("/api/auth/login", { 
          method: "POST", 
          body: JSON.stringify(data) 
      });

      if (res?.user?.token) {
          localStorage.setItem("token", res.user.token);
          localStorage.setItem("user", JSON.stringify(res.user));
          set({ user: res.user, token: res.user.token, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message || "Login failed", isLoading: false });
      throw err; // Re-throw so component can redirect if needed
    }
  },

  logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ user: null, token: null });
  },

  hydrate: () => { //  restores your session when you refresh the page.
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      if (token && userStr) {
          try {
              const user = JSON.parse(userStr);
              set({ token, user });
          } catch (e) {
              console.error("Failed to parse user from local storage");
              localStorage.removeItem("token");
              localStorage.removeItem("user");
          }
      }
  }
}));
