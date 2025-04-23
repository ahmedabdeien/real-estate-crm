import { create } from 'zustand';

const useAIStore = create((set) => ({
  aiCommand: null,
  setAICommand: (command) => set({ aiCommand: command }),
  clearAICommand: () => set({ aiCommand: null }),
}));

export default useAIStore;
