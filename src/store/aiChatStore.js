import { create } from 'zustand';

const useChatStore = create((set) => ({
  messages: [],
  loading: false,
  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),
  setLoading: (val) => set({ loading: val }),
}));

export default useChatStore;
