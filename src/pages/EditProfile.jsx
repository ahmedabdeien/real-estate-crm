
// src/pages/EditProfile.jsx
import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { User, Mail, Save, Lock, ArrowRight, Phone, MapPin, AlertCircle, X, CheckCircle } from 'lucide-react';
import { ClipLoader } from 'react-spinners';

const EditProfile = () => {
  const navigate = useNavigate();
  const { userId, token, login } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState({ type: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          password: '',
          confirmPassword: '',
          phone: res.data.phone || '',
          address: res.data.address || '',
        });
      } catch (err) {
        setMessage({ 
          type: 'error', 
          content: '❌ فشل في تحميل البيانات: ' + (err.response?.data?.message || err.message)
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'الاسم مطلوب';
    if (!formData.email.trim()) errors.email = 'البريد الإلكتروني مطلوب';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'البريد الإلكتروني غير صالح';
    if (formData.password && formData.password.length < 6) errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (formData.password && formData.password !== formData.confirmPassword) errors.confirmPassword = 'كلمتا المرور غير متطابقتين';
    if (formData.phone && !/^01[0-2,5]{1}[0-9]{8}$/.test(formData.phone)) errors.phone = 'رقم الهاتف يجب أن يكون رقم مصري صحيح';
    if (formData.address && formData.address.length < 5) errors.address = 'العنوان يجب أن يكون 5 أحرف على الأقل';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const dataToSubmit = { ...formData };
    delete dataToSubmit.confirmPassword;
    if (!dataToSubmit.password) delete dataToSubmit.password;

    try {
      setSubmitting(true);
      setMessage({ type: '', content: '' });
      const res = await axios.put(`/users/${userId}`, dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` }
      });
      login({ token, userId, name: res.data.name, role: res.data.role });
      setMessage({ type: 'success', content: '✅ تم تحديث البيانات بنجاح' });
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setMessage({ type: 'error', content: '❌ فشل في تحديث البيانات: ' + (err.response?.data?.message || err.message) });
    } finally {
      setSubmitting(false);
    }
  };

  const FormField = ({ label, name, type = 'text', placeholder, icon: Icon, required = false, autoComplete = 'on' }) => (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name]}
          placeholder={placeholder}
          onChange={handleChange}
          className={`w-full border px-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          required={required}
          autoComplete={autoComplete}
        />
        <Icon size={18} className="absolute right-3 top-2.5 text-gray-400" />
        {formErrors[name] && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors[name]}</p>}
      </div>
    </div>
  );

  if (loading) {
    return <div className="flex flex-col justify-center items-center space-y-4 w-full h-[90vh]"><ClipLoader size={50} color="#016FB9" /><p className="text-gray-600">جارٍ تحميل البيانات...</p></div>;
  }

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white shadow-lg rounded-lg text-right" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/profile')} className="flex items-center text-sm text-blue-600 hover:text-blue-800"><ArrowRight size={16} className="ml-1" /> العودة للملف الشخصي</button>
        <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2"><User size={20} /> تعديل الملف الشخصي</h2>
      </div>
      {message.content && (
        <div className={`mb-6 p-3 rounded flex items-center justify-between ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          <div className="flex items-center gap-2">{message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}<p className="text-sm">{message.content}</p></div>
          <button onClick={() => setMessage({ type: '', content: '' })} className="text-gray-500 hover:text-gray-700"><X size={16} /></button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700 border-b pb-2">المعلومات الأساسية</h3>
          <FormField label="الاسم الكامل" name="name" placeholder="أدخل اسمك الكامل" icon={User} required />
          <FormField label="البريد الإلكتروني" name="email" type="email" placeholder="example@domain.com" icon={Mail} required autoComplete="email" />
        </div>
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700 border-b pb-2">معلومات الاتصال</h3>
          <FormField label="رقم الهاتف" name="phone" placeholder="01xxxxxxxxx" icon={Phone} />
          <FormField label="العنوان" name="address" placeholder="المدينة، الحي، الشارع..." icon={MapPin} />
        </div>
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700 border-b pb-2">تغيير كلمة المرور (اختياري)</h3>
          <FormField label="كلمة المرور الجديدة" name="password" type="password" placeholder="اتركها فارغة إذا لم ترد تغييرها" icon={Lock} autoComplete="new-password" />
          <FormField label="تأكيد كلمة المرور" name="confirmPassword" type="password" placeholder="أعد إدخال كلمة المرور الجديدة" icon={Lock} autoComplete="new-password" />
        </div>
        <div className="pt-4">
          <button type="submit" disabled={submitting} className={`w-full ${submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 rounded transition flex items-center justify-center gap-2`}>
            {submitting ? <><ClipLoader size={16} color="#ffffff" /> جاري الحفظ...</> : <><Save size={18} /> حفظ التعديلات</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
