// ✅ VerifyCode.jsx
import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, KeyRound } from 'lucide-react';

const VerifyCode = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await axios.post('/auth/verify-code', { email, code });
      setMessage(res.data.msg);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'فشل التحقق من الكود');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <form onSubmit={handleVerify} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-md">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold">تأكيد الحساب بالكود</h2>
        </div>

        {message && <div className="bg-green-100 text-green-700 p-2 rounded mb-3">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}

        <label className="block mb-2 text-sm">البريد الإلكتروني</label>
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded mb-4">
          <Mail className="w-5 h-5 text-gray-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        <label className="block mb-2 text-sm">رمز التفعيل</label>
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded mb-4">
          <KeyRound className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            maxLength="6"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'جاري التحقق...' : 'تأكيد الكود'}
        </button>
      </form>
    </div>
  );
};

export default VerifyCode;