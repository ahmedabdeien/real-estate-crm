// src/pages/OauthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OauthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const name = params.get('name');

    if (token) {
      console.log('✅ التوكن اللي رجع من السيرفر:', token);
      localStorage.setItem('token', token);
      localStorage.setItem('name', name);
      navigate('/dashboard'); // أو أي صفحة رئيسية
    } else {
      console.log('❌ مفيش توكن مرجع!');
      navigate('/login');
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-lg font-bold">جارٍ تسجيل الدخول...</h1>
    </div>
  );
};

export default OauthSuccess;
