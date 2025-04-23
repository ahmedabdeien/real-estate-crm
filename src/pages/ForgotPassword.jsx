import { useState } from 'react';
import axios from '../api/axios';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setMessage({ text: 'البريد الإلكتروني غير صحيح', type: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setIsSubmitting(true);
    try {
      await axios.post('/auth/forgot-password', { email });
      
      localStorage.setItem('resetEmail', email);
      setMessage({ 
        text: '✅ تم إرسال رمز التحقق إلى بريدك الإلكتروني',
        type: 'success' 
      });
      
      setTimeout(() => navigate('/reset-password'), 1500);
    } catch (err) {
      setMessage({
        text: err.response?.data?.msg || '❌ فشل في الإرسال، الرجاء المحاولة لاحقاً',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
      >
        <button 
          onClick={() => navigate('/login')}
          className="mb-6 text-gray-600 hover:text-blue-600 flex items-center gap-1"
        >
          <ArrowLeft size={18} />
          العودة لتسجيل الدخول
        </button>

        <div className="text-center mb-8">
          <div className="mx-auto bg-blue-100 w-fit p-3 rounded-full mb-4">
            <Mail className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">استعادة كلمة المرور</h1>
          <p className="text-gray-500 mt-2">سنرسل رمز تحقق إلى بريدك الإلكتروني</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-3 rounded-lg text-sm ${
            message.type === 'error' 
              ? 'bg-red-50 text-red-700' 
              : 'bg-green-50 text-green-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-4 text-gray-400" size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMessage({ text: '', type: '' });
                }}
                placeholder="example@company.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500 outline-none transition-all pr-12 text-gray-700"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all 
                     disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'إرسال الرمز'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          لم تستلم الرمز؟{' '}
          <button 
            onClick={handleSubmit}
            className="text-blue-600 hover:underline font-medium"
            disabled={isSubmitting}
          >
            إعادة الإرسال
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;