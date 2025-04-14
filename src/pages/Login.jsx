// src/pages/Login.jsx
import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { googleLoginURL, facebookLoginURL } from '../utils/oauthLinks';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/auth/login', formData);
      const { token, userId, name, role } = res.data;

      // خزن التوكن والبيانات
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('name', name);
      localStorage.setItem('role', role);

      setMessage('✅ تسجيل الدخول ناجح');
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.msg || '❌ فشل في تسجيل الدخول');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md text-right" dir="rtl">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">تسجيل الدخول</h2>
      {message && (
        <div className="mb-4 text-center text-sm text-red-600 font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          value={formData.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          value={formData.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          تسجيل الدخول
        </button>
      </form>

      <div className="my-4 text-center text-sm text-gray-500">أو</div>

      <button
        onClick={() => window.location.href = googleLoginURL}
        className="bg-red-600 text-white py-2 px-4 rounded w-full hover:bg-red-700 transition"
      >
        تسجيل الدخول باستخدام Google
      </button>

      <button
        onClick={() => window.location.href = facebookLoginURL}
        className="bg-blue-700 text-white py-2 px-4 rounded w-full mt-2 hover:bg-blue-800 transition"
      >
        تسجيل الدخول باستخدام Facebook
      </button>
    </div>
  );
};

export default Login;
