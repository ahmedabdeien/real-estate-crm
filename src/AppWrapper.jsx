import { useEffect } from 'react';
import App from './App';
import useThemeStore from './store/useThemeStore';
import useAuthStore from './store/useAuthStore';
import { EncryptStorage } from 'encrypt-storage';

const encryptStorage = new EncryptStorage('🔒secret-key-123', {
  storageType: 'localStorage',
});

const AppWrapper = () => {
  const { theme } = useThemeStore();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    try {
      const auth = encryptStorage.getItem('auth-storage');
      if (auth?.token && auth?.role) {
        login({
          token: auth.token,
          name: auth.name,
          role: auth.role,
          userId: auth.userId,
        });
      }
    } catch (err) {
      console.error('❌ Error reading auth-storage:', err);
    }
  }, [login]);

  return <App />;
};

export default AppWrapper;
