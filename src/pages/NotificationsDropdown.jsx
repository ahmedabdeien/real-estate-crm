// ✅ النسخة المختصرة بدون أخطاء
import { useEffect, useRef, useState } from 'react';
import axios from '../api/axios';
import { Bell, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      setNotifications(res.data.reverse());
    } catch (err) {
      console.error('فشل في جلب الإشعارات', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id, link) => {
    try {
      await axios.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
      navigate(link);
    } catch (err) {
      console.error('فشل في التعليم كمقروء');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getLinkFromNotification = (n) => {
    if (n.contractId) return `/contracts/${n.contractId}`;
    if (n.invoiceId) return `/invoices/contracts/${n.invoiceId}`;
    return '/';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative text-gray-600 hover:text-blue-600"
        title="الإشعارات"
      >
        <Bell size={22} />
        {notifications.some(n => !n.isRead) && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {notifications.filter(n => !n.isRead).length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute z-50 right-0 mt-2 w-96 bg-white border shadow-lg rounded-lg max-h-96 overflow-auto">
          <div className="px-4 py-3 border-b font-bold text-blue-700 flex justify-between items-center">
            الإشعارات
            <button
              className="text-xs text-gray-500 hover:underline"
              onClick={() =>
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
              }
            >
              تعليم الكل كمقروء
            </button>
          </div>

          {loading ? (
            <div className="p-4 flex justify-center text-gray-400">
              <Loader2 className="animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">لا توجد إشعارات</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {notifications.map((n) => (
                <li
                  key={n._id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 transition-all ${
                    !n.isRead ? 'bg-blue-50 font-semibold' : ''
                  }`}
                  onClick={() => markAsRead(n._id, getLinkFromNotification(n))}
                >
                  <div className="text-sm">{n.message}</div>
                  <div className="text-xs text-gray-500 mt-1 flex justify-between">
                    <span>
                      أضيف بواسطة: {n.createdByName} ({n.createdById?.slice(-4)})
                    </span>
                    <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
