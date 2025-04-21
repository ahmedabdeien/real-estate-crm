// src/pages/ResendCode.jsx
import { useState } from 'react';
import axios from '../api/axios';
import { Mail, RotateCcw } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const ResendCode = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('/auth/resend-code', { email });
      setMessage(res.data.msg);
      setTimeout(() => Navigate('/verify-code'), 500);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'حدث خطأ أثناء إعادة الإرسال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-50 " dir="rtl">
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md border animate-fade-in" dir="rtl">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700 flex items-center justify-center gap-2">
        <RotateCcw size={24} /> إعادة إرسال كود التفعيل
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
            placeholder="أدخل بريدك الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            required
          />
          <Mail className="absolute top-2.5 right-2.5 text-gray-400" size={18} />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'جاري الإرسال...' : 'إعادة الإرسال'}
        </button>
      </form>
    </div>
    </div>
  );
};

export default ResendCode;
