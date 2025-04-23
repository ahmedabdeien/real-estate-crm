import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { googleLoginURL } from '../utils/oauthLinks';
import useAuthStore from '../store/useAuthStore';
import { LogIn, Mail, Lock, Globe, UserPlus, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { EncryptStorage } from 'encrypt-storage';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [warning, setWarning] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage('');
    setWarning('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post('/auth/login', formData);
      const { token, userId, name, role } = res.data;

      login({ token, name, role, userId });

      const encryptStorage = new EncryptStorage('🔒secret-key-123', {
        storageType: 'localStorage',
      });
      encryptStorage.setItem('auth-storage', { token, name, role, userId });

      navigateToDashboard(role);
    } catch (err) {
      handleLoginError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToDashboard = (role) => {
    const routes = {
      admin: '/dashboard',
      sales: '/customers',
      accountant: '/invoices',
      lawyer: '/contracts',
      viewer: '/contracts'
    };
    navigate(routes[role] || '/');
  };

  const handleLoginError = (err) => {
    const msg = err.response?.data?.msg || '❌ فشل في تسجيل الدخول، الرجاء التحقق من البيانات';
    if (msg.includes('تفعيل حسابك')) {
      setWarning(msg);
    } else {
      setMessage(msg);
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
          <ShieldCheck className="mx-auto text-blue-600" size={40} />
          <h1 className="text-3xl font-bold text-gray-800 mt-4">مرحباً بعودتك</h1>
          <p className="text-gray-500 mt-2">الرجاء إدخال بياناتك للدخول إلى حسابك</p>
        </div>

        {message && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center">
            <ShieldCheck className="ml-2" size={16} />
            {message}
          </div>
        )}

        {warning && (
          <div className="mb-6 p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
            {warning}
            <Link to="/resend-code" className="mt-2 block text-blue-600 hover:underline font-medium">
              إعادة إرسال كود التفعيل
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            icon={<Mail size={18} className="text-gray-400" />}
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="relative">
            <InputField
              icon={<Lock size={18} className="text-gray-400" />}
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="كلمة المرور"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
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
              <>
                <LogIn size={18} />
                تسجيل الدخول
              </>
            )}
          </button>
        </form>

        <div className="my-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">أو</span>
          </div>
        </div>

        <SocialAuthButton
          icon={<Globe size={18} />}
          text="تسجيل الدخول باستخدام Google"
          onClick={() => (window.location.href = googleLoginURL)}
          color="bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
        />

        <div className="mt-8 text-center text-sm text-gray-500 space-y-2">
          <Link to="/register" className="text-blue-600 hover:underline font-medium flex items-center justify-center gap-1">
            <UserPlus size={16} />
            إنشاء حساب جديد
          </Link>
          <Link to="/forgot-password" className="text-blue-600 hover:underline font-medium">
            نسيت كلمة المرور؟
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({ icon, type, name, placeholder, value, onChange, required }) => (
  <div className="relative">
    {icon && <div className="absolute right-3 top-3.5">{icon}</div>}
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

const SocialAuthButton = ({ icon, text, onClick, color }) => (
  <button
    onClick={onClick}
    className={`w-full ${color} py-3 rounded-lg border transition-all flex items-center justify-center gap-2`}
  >
    {icon}
    {text}
  </button>
);

export default Login;