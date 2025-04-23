import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, LayoutDashboard, Users, FileText, Building2, Receipt, Shield,
  Sun, Moon, LogOut, ChevronRight, ChevronLeft, UserCircle, Settings,
  Bell,
  Sparkles
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import useSidebarStore from '../store/sidebarStore';
import logo from '../assets/logo.png';
import logoicon from '../assets/logoicon.png';
import NotificationsDropdown from './../pages/NotificationsDropdown';
import axios from '../api/axios';

// Navigation items with roles-based access control
const navItems = [
  { to: '/', label: 'الرئيسية', icon: <Home size={20} />, roles: ['admin', 'sales', 'viewer', 'lawyer', 'accountant', 'user'] },
  { to: '/dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard size={20} />, roles: ['admin'] },
  { to: '/customers', label: 'العملاء', icon: <Users size={20} />, roles: ['admin', 'sales', 'viewer'] },
  { to: '/properties', label: 'العقارات', icon: <Building2 size={20} />, roles: ['admin', 'sales', 'viewer'] },
  { to: '/units', label: 'الوحدات', icon: <Building2 size={20} />, roles: ['admin', 'sales', 'viewer'] },
  { to: '/contracts', label: 'العقود', icon: <FileText size={20} />, roles: ['admin', 'lawyer', 'viewer'] },
  { to: '/invoices', label: 'الفواتير', icon: <Receipt size={20} />, roles: ['admin', 'accountant', 'viewer'] },
  { to: '/users', label: 'المستخدمين', icon: <Shield size={20} />, roles: ['admin'] },
  { to: '/chat-with-ai', label: ' شات Ai', icon: <Sparkles  size={20} />, roles: ['admin', 'sales', 'viewer', 'lawyer', 'accountant', 'user'] },

];
const notificationSound = new Audio('/sounds/notification.mp3');

const Sidebar = () => {
  const { role, name, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { collapsed, toggleSidebar, setCollapsed } = useSidebarStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [notifOpen, setNotifOpen] = useState(false);

  // Load saved sidebar state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar_collapsed') === 'true';
    setCollapsed(saved);
  }, [setCollapsed]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation link component
  const NavLink = ({ to, label, icon, active }) => (
    <Link
      to={to}
      title={collapsed ? label : ''}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-md transition-all ${
        active 
          ? 'bg-blue-100 text-blue-700 font-medium dark:bg-blue-900 dark:text-blue-300' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      } ${collapsed ? 'justify-center' : 'justify-start'}`}
      aria-current={active ? 'page' : undefined}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  // Footer action button component
  const ActionButton = ({ onClick, icon, collapsedIcon, label, className = "" }) => (
    <button 
      onClick={onClick} 
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md w-full text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${className} ${collapsed ? 'justify-center' : 'justify-start'}`}
      title={collapsed ? label : ''}
      aria-label={label}
    >
      <span className="flex-shrink-0">{collapsed ? collapsedIcon || icon : icon}</span>
      {!collapsed && <span>{label}</span>}
    </button>
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [newNotification, setNewNotification] = useState(false);


  useEffect(() => {
    const fetchUnreadCount = async () => {
      const res = await axios.get('/notifications');
      const unread = res.data.filter(n => !n.isRead).length;
  
      if (unread > unreadCount) {
        setNewNotification(true); // حالة تأثير
        notificationSound.play();
        setTimeout(() => setNewNotification(false), 500);
      }
  
      setUnreadCount(unread);
    };
  
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 1000);
    return () => clearInterval(interval);
  }, [unreadCount]); // عشان يتابع التغير
  
  


  return (
    <aside 
      className={`hidden xl:flex flex-col fixed top-0 right-0 h-screen z-40 shadow-md transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } ${
        isDark 
          ? 'bg-gray-900 text-white border-l border-gray-800' 
          : 'bg-white text-gray-900 border-l border-gray-200'
      }`}
      aria-label="قائمة جانبية"
      dir="rtl"
    >
      {/* Header with logo and collapse button */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center p-3 border-b border-gray-200 dark:border-gray-800">
        {collapsed ?  <img 
            src={logoicon} 
            alt="شعار النظام" 
            className={`transition-all duration-300 w-6 `} 
          />:
          <img 
            src={logo} 
            alt="شعار النظام" 
            className={`transition-all duration-300 w-28`} 
          />
         
          
          }


          <button 
            onClick={toggleSidebar} 
            className="p-1.5 rounded-full bg-white border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors absolute -left-4 top-1/2 -translate-y-1/2"
            aria-label={collapsed ? "توسيع القائمة" : "طي القائمة"}
          >
            {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
          
        </div>
        

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1 p-2 " aria-label="القائمة الرئيسية">
          {navItems
            .filter(item => item.roles.includes(role))
            .map(({ to, label, icon }) => (
              <NavLink 
                key={to}
                to={to}
                label={label}
                icon={icon}
                active={location.pathname === to || location.pathname.startsWith(`${to}/`)}
              />
            ))
          }
{['admin', 'sales', 'viewer', 'lawyer', 'accountant', 'user'].includes(role) && (
  <div
    onClick={() => setNotifOpen(prev => !prev)}
    className={`relative px-3 py-2.5 rounded-md transition-all cursor-pointer 
      ${collapsed ? 'flex justify-center' : 'flex items-center gap-2'} 
      hover:bg-gray-100 dark:hover:bg-gray-800`}
  >
    <div className="relative">
      <Bell size={20} />
      {unreadCount > 0 && (
  <span className={`absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-1.5 py-0.5 shadow-md transition-transform duration-300 ${newNotification ? 'animate-bounce' : ''}`}>
    {unreadCount}
  </span>
)}
    </div>
    {!collapsed && <span className="truncate text-sm">الإشعارات</span>}
    {notifOpen && (
      <div className="absolute right-2 top-full z-50 w-[90vw] sm:w-[320px] max-w-sm shadow-lg transition-all duration-300 ease-in-out">
        <NotificationsDropdown forceOpen hideButton />
      </div>
    )}
  </div>
)}


        </nav>
      </div>

      {/* Footer with user info and actions */}
      <div className="mt-auto p-3 border-t border-gray-200 dark:border-gray-800 overflow-auto">
        {/* User Profile Section */}
        <Link 
            to="/profile" 
            className={`flex items-center  mb-1  rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? "الملف الشخصي" : ""}
          >
        <div className={`flex items-center gap-2  p-2 rounded-md ${collapsed ? 'justify-center' : ''}`}>
          <UserCircle size={collapsed ? 24 : 20} className="text-blue-600 dark:text-blue-400" />
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role}</p>
            </div>
          )}
        </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex flex-col gap-1">
          

        <ActionButton
  onClick={toggleTheme}
  icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
  label={isDark ? "الوضع النهاري" : "الوضع المظلم"}
  className="text-gray-500"
/>

<ActionButton
  onClick={() => navigate('/settings')}
  icon={<Settings size={18} />}
  label="الإعدادات"
  className="text-gray-500"
/>

<ActionButton
  onClick={handleLogout}
  icon={<LogOut size={18} />}
  label="تسجيل الخروج"
  className=" text-red-500"
/>

        </div>
      </div>
    </aside>
  );
};

export default Sidebar;