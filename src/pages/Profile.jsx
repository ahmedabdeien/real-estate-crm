import { useEffect, useState } from 'react';
import axios from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { UserCircle, Mail, ShieldCheck, CalendarDays, Pencil, Phone, MapPin, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const Profile = () => {
  const { userId, token } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProfile(res.data);
    } catch (err) {
      console.error('❌ فشل في تحميل البيانات:', err.message);
      setError(err.message || 'حدث خطأ أثناء تحميل الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId, token]);

  const ProfileField = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2 text-sm p-2 border-b border-gray-100 hover:bg-blue-50 rounded">
      <Icon size={18} className="text-blue-500" />
      <span className="text-gray-600">{label}: </span>
      <strong className="font-semibold">{value || 'غير متوفر'}</strong>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4 w-full h-[90vh]">
        <ClipLoader size={50} color="#016FB9" />
        <p className="text-gray-600">جارٍ تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
          <UserCircle size={28} />
          <p>الملف الشخصي</p>
        </h2>
        <button 
          onClick={fetchProfile} 
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
        >
          <RefreshCw size={16} />
          تحديث
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4 text-sm flex items-center gap-2">
          ⚠️ {error}
          <button onClick={fetchProfile} className="text-blue-600 hover:underline mr-auto">إعادة المحاولة</button>
        </div>
      )}

      {profile ? (
        <div className="space-y-2 bg-white shadow rounded-lg p-6 border border-gray-100">
          <div className="flex flex-col items-center mb-6 pb-4 border-b border-gray-200">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <UserCircle size={50} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-bold">{profile.name}</h3>
            <p className="text-gray-500 text-sm">{profile.role}</p>
          </div>

          <ProfileField icon={Mail} label="البريد الإلكتروني" value={profile.email} />
          <ProfileField icon={ShieldCheck} label="الدور" value={profile.role} />
          <ProfileField icon={CalendarDays} label="تاريخ الإنشاء" value={new Date(profile.createdAt).toLocaleDateString('ar-EG')} />
          <ProfileField icon={Phone} label="رقم الهاتف" value={profile.phone} />
          <ProfileField icon={MapPin} label="العنوان" value={profile.address} />

          <div className="mt-6 flex justify-center">
            <Link
              to="/edit-profile"
              className="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              <Pencil size={16} /> تعديل الملف الشخصي
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-red-600 text-sm bg-red-50 p-4 rounded">
          ⚠️ تعذر تحميل بيانات الحساب
          <button onClick={fetchProfile} className="text-blue-600 hover:underline block mt-2">إعادة المحاولة</button>
        </div>
      )}
    </div>
  );
};

export default Profile;