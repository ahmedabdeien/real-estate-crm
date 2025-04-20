// src/pages/Login.jsx
import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { googleLoginURL } from '../utils/oauthLinks';
import useAuthStore from '../store/useAuthStore';
import { LogIn, Mail, Lock, Facebook, Globe , UserPlus, ShieldCheck } from 'lucide-react';
import { EncryptStorage } from 'encrypt-storage';
const Login = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', formData);
      const { token, userId, name, role } = res.data;
  
      login({ token, name, role, userId });
  
      // ✅ إضافة التوكن إلى التخزين الآمن
      const encryptStorage = new EncryptStorage('🔒secret-key-123', {
        storageType: 'localStorage',
      });
      encryptStorage.setItem('auth-storage', {
        token,
        name,
        role,
        userId,
      });
  
      setMessage('✅ تسجيل الدخول ناجح');
  
      if (role === 'admin') navigate('/dashboard');
      else if (role === 'sales') navigate('/customers');
      else if (role === 'accountant') navigate('/invoices');
      else if (role === 'lawyer') navigate('/contracts');
      else if (role === 'viewer') navigate('/contracts');

      else navigate('/');
    } catch (err) {
      setMessage(err.response?.data?.msg || '❌ فشل في تسجيل الدخول');
    }
  };
  
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md border rounded-md text-right animate-fade-in" dir="rtl">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700 flex items-center justify-center gap-2">
        <ShieldCheck size={24} /> تسجيل الدخول
      </h2>

      {message && <div className="mb-4 text-center text-sm text-red-600 font-medium">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            required
          />
          <Mail className="absolute top-2.5 right-2.5 text-gray-400" size={18} />
        </div>

        <div className="relative">
          <input
            type="password"
            name="password"
            placeholder="كلمة المرور"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            required
          />
          <Lock className="absolute top-2.5 right-2.5 text-gray-400" size={18} />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <LogIn size={18} /> تسجيل الدخول
        </button>
      </form>

      <div className="my-4 text-center text-sm text-gray-500">أو</div>

      <button
        onClick={() => window.location.href = googleLoginURL}
        className="bg-red-600 text-white py-2 px-4 rounded w-full hover:bg-red-700 transition flex items-center justify-center gap-2"
      >
        <Globe  size={18} /> تسجيل الدخول باستخدام Google
      </button>


      <div className="text-center text-sm mt-6">
        <span>ليس لديك حساب؟ </span>
        <Link to="/register" className="text-blue-600 font-medium hover:underline flex justify-center items-center gap-1 mt-1">
          <UserPlus size={16} /> إنشاء حساب جديد
        </Link>
      </div>
    </div>
  );
};

export default Login;
