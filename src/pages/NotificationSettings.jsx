// src/pages/NotificationSettings.jsx
import { useEffect, useState } from 'react';
import useNotificationSettings from '../store/useNotificationSettings';
import axios from '../api/axios';
import { Save, Bell } from 'lucide-react';

const notificationOptions = [
  { key: 'contractCreated', label: 'عند إضافة عقد جديد' },
  { key: 'contractDeleted', label: 'عند حذف عقد' },
  { key: 'invoiceDeleted', label: 'عند حذف فاتورة' },
  { key: 'contractEndingSoon', label: 'عند اقتراب انتهاء عقد' },
  { key: 'contractUpdated', label: 'عند تعديل عقد' },
];

const NotificationSettings = () => {
  const { settings, toggleSetting, setSettings } = useNotificationSettings();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/notifications/settings');
        setSettings(res.data);
      } catch {
        setMessage('⚠️ فشل في تحميل تفضيلات الإشعارات');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [setSettings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/notifications/settings', settings);
      setMessage('✅ تم حفظ التفضيلات بنجاح');
    } catch {
      setMessage('❌ فشل في حفظ التفضيلات');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-md mt-6" dir="rtl">
      <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2 mb-4">
        <Bell size={20} />
        إعدادات الإشعارات
      </h2>

      {message && <p className="mb-4 text-sm text-center text-gray-600">{message}</p>}

      {loading ? (
        <p className="text-gray-500">جاري التحميل...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {notificationOptions.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={() => toggleSetting(key)}
                className="accent-blue-600"
              />
              {label}
            </label>
          ))}

          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2"
          >
            <Save size={16} /> حفظ التعديلات
          </button>
        </form>
      )}
    </div>
  );
};

export default NotificationSettings;
