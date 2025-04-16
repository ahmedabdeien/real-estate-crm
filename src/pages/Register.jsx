// src/pages/Register.jsx
import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ShieldPlus, Phone, MapPin, AlertCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [message, setMessage] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', formData);
      setMessage('✅ تم إنشاء الحساب بنجاح!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const resMsg = err.response?.data?.errors || err.response?.data?.msg || '❌ فشل في إنشاء الحساب';
      setMessage(resMsg);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg border rounded-md text-right animate-fade-in" dir="rtl">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700 flex items-center justify-center gap-2">
        <ShieldPlus size={22} />
        إنشاء حساب جديد
      </h2>

     {message && (
  <div className="bg-red-100 text-red-700 border border-red-300 text-sm px-4 py-2 rounded mb-4">
    {Array.isArray(message)
      ? message.map((msg, idx) => <div key={idx}>• {msg}</div>)
      : message}
  </div>
)}


      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            name="name"
            placeholder="الاسم الكامل"
            value={formData.name}
            onChange={handleChange}
            className="w-full border pl-8 pr-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={handleChange}
            className="w-full border pl-8 pr-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="password"
            name="password"
            placeholder="كلمة المرور"
            value={formData.password}
            onChange={handleChange}
            className="w-full border pl-8 pr-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            name="phone"
            placeholder="رقم الهاتف (اختياري)"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border pl-8 pr-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            name="address"
            placeholder="العنوان (اختياري)"
            value={formData.address}
            onChange={handleChange}
            className="w-full border pl-8 pr-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          إنشاء الحساب
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        لديك حساب بالفعل؟{' '}
        <Link to="/login" className="text-blue-600 hover:underline">تسجيل الدخول</Link>
      </p>
    </div>
  );
};

export default Register;
