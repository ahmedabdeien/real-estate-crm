import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { EncryptStorage } from 'encrypt-storage';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const name = query.get('name');

    if (token && name) {
      const role = 'viewer';
      const userId = 'oauth-user';

      // 🟢 تخزين في Zustand
      login({ token, name, role, userId });

      // 🔐 تخزين في localStorage المشفر
      const encryptStorage = new EncryptStorage('🔒secret-key-123', {
        storageType: 'localStorage',
      });

      encryptStorage.setItem('auth-storage', {
        token,
        name,
        role,
        userId,
      });

      // 🧭 توجيه المستخدم
      setTimeout(() => {
        navigate('/contracts');
      }, 1000);
    } else {
      navigate('/login');
    }
  }, [location, navigate, login]);

  return (
    <div className="flex items-center justify-center h-screen bg-white text-black">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">🎉 مرحبًا بك!</h1>
        <p className="text-lg">جاري تسجيل الدخول...</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
