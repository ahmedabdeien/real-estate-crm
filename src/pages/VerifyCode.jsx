// src/pages/VerifyCode.jsx
import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { MailCheck, KeyRound } from 'lucide-react';

const VerifyCode = () => {
  const [formData, setFormData] = useState({ email: '', code: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('/auth/verify-code', formData);
      setMessage(res.data.msg);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'فشل في تفعيل الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow-md border rounded-md text-right animate-fade-in" dir="rtl">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700 flex items-center justify-center gap-2">
        <MailCheck size={24} /> تأكيد كود التفعيل
      </h2>

      {message && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {message}
        </div>
      )}

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
          <MailCheck className="absolute top-2.5 right-2.5 text-gray-400" size={18} />
        </div>

        <div className="relative">
          <input
            type="text"
            name="code"
            placeholder="كود التفعيل (6 أرقام)"
            value={formData.code}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            required
          />
          <KeyRound className="absolute top-2.5 right-2.5 text-gray-400" size={18} />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'جاري التحقق...' : 'تفعيل الحساب'}
        </button>
      </form>
    </div>
  );
};

export default VerifyCode;
