import { create } from 'zustand';
import { apiWrapper } from "@/lib/apiWrapper";

export interface ChatGroup {
  id: string;
  title: string;
  passcode: string;
  user_id: number;
  created_at: string;
}

interface GroupStore {
  groups: ChatGroup[];
  isLoading: boolean;
  error: string | null;
  
  fetchGroups: () => Promise<void>;
  createGroup: (title: string, passcode: string) => Promise<void>;
  updateGroup: (id: string, title: string, passcode: string) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
}

export const useGroupStore = create<GroupStore>((set, get) => ({
  groups: [],
  isLoading: false,
  error: null,

  fetchGroups: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiWrapper<{ message: string; data: ChatGroup[] }>("/api/chat-group");
      set({ groups: res.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch groups", isLoading: false });
    }
  },

  createGroup: async (title: string, passcode: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiWrapper("/api/chat-group", {
        method: "POST",
        body: JSON.stringify({ title, passcode })
      });
      // Refresh list
      await get().fetchGroups();
    } catch (error: any) {
      set({ error: error.message || "Failed to create group", isLoading: false });
      throw error;
    }
  },

  updateGroup: async (id: string, title: string, passcode: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiWrapper(`/api/chat-group/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title, passcode })
      });
      await get().fetchGroups();
    } catch (error: any) {
      set({ error: error.message || "Failed to update group", isLoading: false });
      throw error;
    }
  },

  deleteGroup: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiWrapper(`/api/chat-group/${id}`, {
        method: "DELETE",
      });
      await get().fetchGroups();
    } catch (error: any) {
      set({ error: error.message || "Failed to delete group", isLoading: false });
      throw error;
    }
  }
}));
