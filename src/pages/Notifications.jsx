import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Trash2, Bell, Info, FileText, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('فشل في تحميل الإشعارات');
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error('فشل في حذف الإشعار');
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await axios.delete('/notifications');
      setNotifications([]);
    } catch (err) {
      console.error('فشل في حذف جميع الإشعارات');
    }
  };

  const getIcon = (type) => {
    if (type?.startsWith('contract')) return <FileText size={18} />;
    if (type?.startsWith('invoice')) return <Receipt size={18} />;
    return <Info size={18} />;
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'contract') return n.type?.startsWith('contract');
    if (filter === 'invoice') return n.type?.startsWith('invoice');
    return false;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
          <Bell size={20} />
          الإشعارات
        </h2>
        <div className="flex gap-2 text-sm">
          <button onClick={markAllAsRead} className="text-blue-600 hover:underline">تعليم الكل كمقروء</button>
          <button onClick={deleteAllNotifications} className="text-red-600 hover:underline">حذف الكل</button>
        </div>
      </div>

      <div className="mb-4 space-x-2 rtl:space-x-reverse text-sm">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'text-blue-700 font-semibold' : ''}>الكل</button>
        <button onClick={() => setFilter('contract')} className={filter === 'contract' ? 'text-blue-700 font-semibold' : ''}>عقود</button>
        <button onClick={() => setFilter('invoice')} className={filter === 'invoice' ? 'text-blue-700 font-semibold' : ''}>فواتير</button>
      </div>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : filteredNotifications.length === 0 ? (
        <p className="text-gray-500 text-sm">لا يوجد إشعارات حالياً.</p>
      ) : (
        <ul className="space-y-3">
          {filteredNotifications.map((n) => (
            <li
              key={n._id}
              onClick={() => navigate(`/`)}
              className={`cursor-pointer p-4 border rounded-md flex justify-between items-start gap-2 ${!n.isRead ? 'bg-blue-50' : 'bg-white'}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-blue-600">{getIcon(n.type)}</div>
                <div>
                  <p className="font-medium text-sm text-gray-800">{n.message}</p>
                  <p className="text-xs text-gray-500 mt-1">بواسطة {n.userName || n.createdByName} - {new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }}>
                <Trash2 size={16} className="text-red-500 hover:text-red-700" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
