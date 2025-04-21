// src/store/useChatStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useChatStore = create(
  persist(
    (set) => ({
      messages: [],
      loading: false,
      addMessage: (msg) =>
        set((state) => ({
          messages: [...state.messages, msg],
        })),
      clearMessages: () => set({ messages: [] }),
      setLoading: (val) => set({ loading: val }),
    }),
    {
      name: 'ai-chat-history', // مفتاح localStorage
    }
  )
);

export default useChatStore;
