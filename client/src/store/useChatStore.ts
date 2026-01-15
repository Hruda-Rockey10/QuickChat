import { create } from 'zustand';
import { apiWrapper } from "@/lib/apiWrapper";

export interface Message {
  id: string;
  group_id: string;
  name: string;
  message: string | null;
  created_at: string;
}

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchMessages: (groupId: string) => Promise<void>;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  sendMessage: (groupId: string, messageText: string, userName: string) => Promise<void>; // Just api call, optimistic separate
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  fetchMessages: async (groupId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiWrapper<{ data: Message[] }>(`/api/chats/${groupId}`);
      set({ messages: res.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch messages", isLoading: false });
    }
  },

  addMessage: (message: Message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },

  setMessages: (messages: Message[]) => {
      set({ messages });
  },

  sendMessage: async (groupId: string, messageText: string, userName: string) => {
      // NOTE: Actual sending is often done via Socket emit in the component, 
      // but if we had an API fallback we would put it here.
      // For now, this might just be a placebo if the socket does the work.
      // We will let the "useChat" hook handle the socket emission, 
      // and use this store effectively as the "Cache".
  }
}));
