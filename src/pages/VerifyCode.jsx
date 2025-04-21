// src/pages/VerifyCode.jsx
import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Mail, KeyRound, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const VerifyCode = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    code: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('pendingEmail');
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('/auth/verify-code', formData);
      setMessage(res.data.msg);
      setTimeout(() => {
        localStorage.removeItem('pendingEmail');
        navigate('/login');
      }, 2000);
    } catch (err) {
      const resMsg = err.response?.data?.msg || 'حدث خطأ أثناء التحقق من الكود';
      setMessage(resMsg);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50" dir="rtl">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md border animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6 flex justify-center items-center gap-2">
          <ShieldCheck size={22} /> تأكيد الحساب بالكود
        </h2>

        {message && (
          <div className="bg-red-100 text-red-700 border border-red-300 text-sm px-4 py-2 rounded mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="البريد الإلكتروني"
              className="w-full border pl-8 pr-3 py-2 rounded focus:outline-none"
              required
              readOnly
              hidden
            />
          </div>

          <div className="relative">
            <KeyRound className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="رمز التفعيل"
              className="w-full border pl-8 pr-3 py-2 rounded focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            تأكيد الكود
          </button>
        </form>
        <div className="text-center text-sm mt-4">
        <span>لم يصلك رمز التفعيل؟ </span>
        <Link to="/resend-code" className="text-blue-600 font-medium hover:underline">
          أعد إرسال كود التفعيل
        </Link>
      </div>
      </div>
    </div>
  );
};

export default VerifyCode;
