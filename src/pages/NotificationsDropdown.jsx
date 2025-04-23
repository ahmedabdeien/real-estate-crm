// ✔️ النسخة المعدلة مع تثبيت الأجزاء العلوية والسفلية وظهور الأرقام
import { useEffect, useRef, useState } from 'react';
import axios from '../api/axios';
import { Bell, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FileText, Receipt } from 'lucide-react';

const NotificationsDropdown = ({ forceOpen = false, hideButton = false }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newNotification, setNewNotification] = useState(false);
  const notificationSound = new Audio('/sounds/notification.mp3');

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
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/notifications');
        const unread = res.data.filter(n => !n.isRead).length;
  
        if (unread > notifications.filter(n => !n.isRead).length) {
          setNewNotification(true);
          notificationSound.play();
          setTimeout(() => setNewNotification(false), 500);
        }
  
        setNotifications(res.data.reverse());
      } catch (err) {
        console.error('فشل في جلب الإشعارات', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchNotifications(); // أول مرة
    const interval = setInterval(fetchNotifications, 1000); // كل 10 ثواني
  
    return () => clearInterval(interval); // وقف لما يخرج
  }, [notifications]);
  

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
      {!hideButton && (
        <button
          onClick={() => setOpen(prev => !prev)}
          className="relative text-gray-600 hover:text-blue-600"
          title="الإشعارات"
        >
          <div className="relative">
            <Bell size={24} />
            {notifications.filter(n => !n.isRead).length > 0 && (
 <span className={`absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-[10px] px-1.5 py-0.5 shadow-md transition-transform duration-300 ${newNotification ? 'animate-bounce' : ''}`}>
    {notifications.filter(n => !n.isRead).length}
  </span>
)}
          </div>
        </button>
      )}

      {(open || forceOpen) && (
        <div className="absolute right-0 top-full z-50 w-[90vw] sm:w-[320px] max-w-sm shadow-lg transition-all duration-300 ease-in-out bg-white rounded-md border border-gray-200 overflow-hidden mt-2">
          <div className="px-4 py-3 border-b font-bold text-blue-700 flex justify-between items-center sticky top-0 bg-white z-10">
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
                  className={`p-3 cursor-pointer hover:bg-gray-100 rounded-md mx-2 my-1 shadow-sm transition-all ${
                    !n.isRead ? 'bg-blue-50 font-semibold border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => markAsRead(n._id, getLinkFromNotification(n))}
                >
                  <div className="flex items-center space-x-2">
                    <FileText size={16} className="text-blue-500" />
                    <span className="text-sm">{n.message}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex justify-between">
                    <span>بواسطة: {n.createdByName} ({n.createdById?.slice(-4)})</span>
                    <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="text-center border-t text-sm text-blue-600 hover:bg-gray-50 transition sticky bottom-0 bg-white z-10">
            <button
              className="w-full py-2"
              onClick={() => {
                setOpen(false);
                navigate('/notifications');
              }}
            >
              عرض كل الإشعارات
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;