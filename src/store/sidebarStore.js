// ✅ store/sidebarStore.js
import { create } from 'zustand';

const useSidebarStore = create((set) => ({
  collapsed: false,
  toggleSidebar: () => set((state) => {
    localStorage.setItem('sidebar_collapsed', !state.collapsed);
    return { collapsed: !state.collapsed };
  }),
  setCollapsed: (value) => set(() => {
    localStorage.setItem('sidebar_collapsed', value);
    return { collapsed: value };
  })
}));

export default useSidebarStore;
