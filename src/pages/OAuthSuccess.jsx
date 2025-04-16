// src/pages/OAuthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const name = query.get('name');

    if (token && name) {
      // 🟢 تسجيل دخول بـ بيانات افتراضية (لأن OAuth مش بيرجع role أو userId)
      login({
        token,
        name,
        role: 'viewer',   // 🔐 أو 'user' لو ده الدور الافتراضي عندك
        userId: 'oauth-user',
      });

      // 🧭 توجيه المستخدم حسب الدور (ممكن تعدلها لاحقًا)
      setTimeout(() => {
        navigate('/contracts'); // viewer ممكن يروح على العقود مثلًا
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
