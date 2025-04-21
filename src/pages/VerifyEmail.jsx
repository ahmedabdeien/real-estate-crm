import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { LoaderCircle, ShieldCheck, XCircle } from 'lucide-react';

const VerifyEmail = () => {
  const [status, setStatus] = useState('loading'); // 'success' | 'error' | 'loading'
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (!token) {
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        await axios.get(`/auth/verify-email/${token}`);
        setStatus('success');

        // بعد ثواني يتم توجيه المستخدم
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setStatus('error');
      }
    };

    verify();
  }, [location.search, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md max-w-md">
        {status === 'loading' && (
          <>
            <LoaderCircle className="animate-spin mx-auto text-blue-500" size={48} />
            <p className="mt-4 text-gray-700 dark:text-gray-300">جاري تفعيل حسابك...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <ShieldCheck className="text-green-600 mx-auto" size={48} />
            <h2 className="mt-4 text-xl font-bold text-green-700 dark:text-green-400">تم التفعيل بنجاح!</h2>
            <p className="text-sm mt-2 text-gray-500">سيتم توجيهك لصفحة تسجيل الدخول خلال ثوانٍ...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="text-red-600 mx-auto" size={48} />
            <h2 className="mt-4 text-xl font-bold text-red-700 dark:text-red-400">فشل التفعيل</h2>
            <p className="text-sm mt-2 text-gray-500">رابط غير صالح أو منتهي. تأكد من صحة الرابط.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
