// src/store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EncryptStorage } from 'encrypt-storage';
import { setAxiosToken } from '../api/axios'; // ⬅️ مهم

const encryptStorage = new EncryptStorage('🔒secret-key-123', {
  storageType: 'localStorage',
});

const useAuthStore = create(persist(
  (set) => ({
    token: null,
    name: null,
    role: null,
    userId: null,
    login: ({ token, name, role, userId }) => {
      set({ token, name, role, userId });
      setAxiosToken(token); // ⬅️ حدّث axios بعد تسجيل الدخول
    },
    logout: () => {
      encryptStorage.removeItem('auth-storage');
      set({ token: null, name: null, role: null, userId: null });
      setAxiosToken(null); // ⬅️ أزل التوكن من axios عند تسجيل الخروج
    }
  }),
  {
    name: 'auth-storage',
    storage: {
      getItem: encryptStorage.getItem.bind(encryptStorage),
      setItem: encryptStorage.setItem.bind(encryptStorage),
      removeItem: encryptStorage.removeItem.bind(encryptStorage),
    },
  }
));

export default useAuthStore;
