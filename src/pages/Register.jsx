// src/pages/Register.jsx
import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { googleLoginURL, facebookLoginURL } from '../utils/oauthLinks';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // الافتراضي
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/auth/register', formData);
      setMessage('✅ تم إنشاء الحساب بنجاح!');
      setTimeout(() => navigate('/login'), 1500); // تحويل بعد ثانية ونص
    } catch (err) {
      setMessage(err.response?.data?.msg || '❌ فشل في إنشاء الحساب');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4 text-center">إنشاء حساب جديد</h2>
      {message && <p className="text-center mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="الاسم"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          value={formData.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          value={formData.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          إنشاء الحساب
        </button>
      </form>
      <div className="my-6 text-center text-gray-500 text-sm">أو تسجيل الدخول بواسطة</div>

<div className="flex flex-col gap-2">
  <button
    onClick={() => (window.location.href = googleLoginURL)}
    className="bg-red-600 text-white py-2 rounded hover:bg-red-700"
  >
    تسجيل الدخول باستخدام Google
  </button>

  <button
    onClick={() => (window.location.href = facebookLoginURL)}
    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
  >
    تسجيل الدخول باستخدام Facebook
  </button>
</div>

    </div>
  );
};

export default Register;
