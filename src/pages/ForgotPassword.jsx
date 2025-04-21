import { useState } from 'react';
import axios from '../api/axios';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/forgot-password', { email });

      localStorage.setItem('resetEmail', email); // ✅ تخزين مؤقت

      setMessage('✅ تم إرسال الكود إلى بريدك');
      setTimeout(() => navigate('/reset-password'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.msg || '❌ فشل في إرسال الكود');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">نسيت كلمة المرور</h2>

      {message && <div className="mb-4 text-sm text-center text-red-500">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
          <input
            type="email"
            placeholder="أدخل بريدك الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          إرسال الكود
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
