// src/pages/Register.jsx
import { useState, useCallback } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ShieldPlus, Phone, MapPin, AlertCircle, CheckCircle, UserPlus, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const InputField = ({ icon, type, name, placeholder, value, onChange, required }) => (
  <div className="relative">
    <div className="absolute right-3 top-3.5 text-gray-400">{icon}</div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 
               focus:border-blue-500 outline-none transition-all pr-12 text-gray-700"
    />
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [message, setMessage] = useState({ type: '', content: [] });

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', formData);
      setMessage({ type: 'success', content: ['تم إنشاء الحساب بنجاح!'] });
      localStorage.setItem('pendingEmail', formData.email);
      setTimeout(() => navigate('/verify-code'), 1500);
    } catch (err) {
      const resMsg = err.response?.data?.errors || err.response?.data?.msg || 'فشل في إنشاء الحساب';
      const content = Array.isArray(resMsg) ? resMsg : [resMsg];
      setMessage({ type: 'error', content });
    }
  }, [formData, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-right"
        dir="rtl"
      >
        <div className="text-center mb-6">
          <ShieldPlus className="mx-auto text-blue-600" size={40} />
          <h1 className="text-2xl font-bold text-gray-800 mt-4">إنشاء حساب جديد</h1>
          <p className="text-gray-500 mt-2 text-sm">قم بإدخال بياناتك لإنشاء حساب جديد</p>
        </div>

        {message.content.length > 0 && (
          <div className={`mb-6 p-3 rounded-lg text-sm flex flex-col gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}>
            {message.content.map((msg, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {msg}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField icon={<User size={18} />} type="text" name="name" placeholder="الاسم الكامل" value={formData.name} onChange={handleChange} required />
          <InputField icon={<Mail size={18} />} type="email" name="email" placeholder="البريد الإلكتروني" value={formData.email} onChange={handleChange} required />
          <InputField icon={<Lock size={18} />} type="password" name="password" placeholder="كلمة المرور" value={formData.password} onChange={handleChange} required />
          <InputField icon={<Phone size={18} />} type="tel" name="phone" placeholder="رقم الهاتف (اختياري)" value={formData.phone} onChange={handleChange} />
          <InputField icon={<MapPin size={18} />} type="text" name="address" placeholder="العنوان (اختياري)" value={formData.address} onChange={handleChange} />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all flex justify-center items-center gap-2"
          >
            <UserPlus size={18} />
            إنشاء الحساب
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 space-y-2">
          <Link to="/login" className="text-blue-600 hover:underline font-medium flex items-center justify-center gap-1">
            <LogIn size={16} />
            لديك حساب؟ تسجيل الدخول
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
