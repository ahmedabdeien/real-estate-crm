import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Lock, KeyRound, Mail } from 'lucide-react';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('resetEmail');
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/reset-password', formData);
      setMessage('✅ تم إعادة تعيين كلمة المرور بنجاح');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.msg || '❌ فشل التحديث');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">إعادة تعيين كلمة المرور</h2>

      {message && <div className="mb-4 text-sm text-center text-red-500">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
          <input
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 pl-10 focus:outline-none"
            required
          />
        </div>

        <div className="relative">
          <KeyRound className="absolute top-3 left-3 text-gray-400" size={18} />
          <input
            type="text"
            name="code"
            placeholder="كود التحقق"
            value={formData.code}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 pl-10 focus:outline-none"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
          <input
            type="password"
            name="newPassword"
            placeholder="كلمة المرور الجديدة"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 pl-10 focus:outline-none"
            required
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          تأكيد التغيير
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;