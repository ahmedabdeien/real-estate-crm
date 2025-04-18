// src/store/useNotificationSettings.js
import { create } from 'zustand';

const useNotificationSettings = create((set) => ({
  settings: {
    contractCreated: true,
    contractDeleted: true,
    invoiceDeleted: true,
    contractEndingSoon: true,
    contractUpdated: true,
  },
  setSettings: (newSettings) => set({ settings: newSettings }),
  toggleSetting: (key) =>
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: !state.settings[key],
      },
    })),
}));

export default useNotificationSettings;
