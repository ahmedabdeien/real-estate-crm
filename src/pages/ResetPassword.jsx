import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, KeyRound, Mail, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('resetEmail');
    if (!savedEmail) {
      navigate('/forgot-password');
      return;
    }
    setFormData(prev => ({ ...prev, email: savedEmail }));
  }, [navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage({ text: '', type: '' });
  };

  const validatePassword = (password) => {
    const minLength = 8;
    if (password.length < minLength) {
      setMessage({ 
        text: `كلمة المرور يجب أن تكون على الأقل ${minLength} أحرف`, 
        type: 'error' 
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(formData.newPassword)) return;

    setIsSubmitting(true);
    try {
      await axios.post('/auth/reset-password', formData);
      setMessage({ 
        text: '✅ تم إعادة تعيين كلمة المرور بنجاح', 
        type: 'success' 
      });
      localStorage.removeItem('resetEmail');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage({
        text: err.response?.data?.msg || '❌ فشل التحديث، الرجاء المحاولة مرة أخرى',
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
        <div className="text-center mb-8">
          <CheckCircle2 className="mx-auto text-green-600" size={40} />
          <h1 className="text-2xl font-bold text-gray-800 mt-4">تعيين كلمة مرور جديدة</h1>
          <p className="text-gray-500 mt-2">الرجاء إدخال كود التحقق وكلمة المرور الجديدة</p>
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
          <InputField
            icon={<Mail size={18} className="text-gray-400 translate-y-7" />}
            type="email"
            name="email"
            label="البريد الإلكتروني"
            value={formData.email}
            onChange={handleChange}
            disabled
          />

          <InputField
            icon={<KeyRound size={18} className="text-gray-400 translate-y-7" />}
            type="text"
            name="code"
            label="كود التحقق"
            value={formData.code}
            onChange={handleChange}
            required
          />

          <div className="relative">
            <InputField
              icon={<Lock size={18} className="text-gray-400 translate-y-7" />}
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              label="كلمة المرور الجديدة"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-0 translate-y-10 text-gray-400 hover:text-blue-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all 
                     disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'تأكيد التغيير'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            العودة إلى صفحة تسجيل الدخول
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({ icon, type, name, label, value, onChange, required, disabled }) => (
  <div className="relative">
    {icon && <div className="absolute right-3 top-3">{icon}</div>}
    {label && (
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 
               focus:border-blue-500 outline-none transition-all pr-12 text-gray-700 disabled:bg-gray-100"
    />
  </div>
);

export default ResetPassword;