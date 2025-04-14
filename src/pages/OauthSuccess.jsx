// src/pages/OAuthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const name = query.get('name');

    if (token && name) {
      localStorage.setItem('token', token);
      localStorage.setItem('name', name);

      // يمكنك تغيير المسار هنا حسب ما يناسبك
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

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
