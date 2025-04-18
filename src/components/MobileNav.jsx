import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, LayoutDashboard, Users, FileText, Building2, Receipt, Shield,
  UserCircle, Settings, LogOut, Sun, Moon, Menu, X,
  Bell
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';

const navItems = [
  { to: '/', icon: <Home size={20} />, label: 'الرئيسية', roles: ['admin', 'sales', 'viewer', 'lawyer', 'accountant', 'user'] },
  { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'لوحة التحكم', roles: ['admin'] },
  { to: '/customers', icon: <Users size={20} />, label: 'العملاء', roles: ['admin', 'sales', 'viewer'] },
  { to: '/properties', icon: <Building2 size={20} />, label: 'العقارات', roles: ['admin', 'sales', 'viewer'] },
  { to: '/contracts', icon: <FileText size={20} />, label: 'العقود', roles: ['admin', 'lawyer', 'viewer'] },
  { to: '/invoices', icon: <Receipt size={20} />, label: 'الفواتير', roles: ['admin', 'accountant', 'viewer'] },
  { to: '/users', icon: <Shield size={20} />, label: 'المستخدمين', roles: ['admin'] },
  { to: '/notifications', label: 'الإشعارات', icon: <Bell size={20} />, roles: ['admin', 'sales', 'viewer', 'lawyer', 'accountant', 'user'] },
  { to: '/settings', label: 'إعدادات', icon: <Settings size={20} />, roles: ['admin', 'sales', 'viewer', 'lawyer', 'accountant', 'user'] },
];

const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, name, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const moreMenuRef = useRef(null);
  const isDark = theme === 'dark';

  // Filter nav items based on user role - memoized to avoid recalculation on rerenders
  const filteredNavItems = navItems.filter(item => item.roles.includes(role));
  const mainNavItems = filteredNavItems.slice(0, 4);
  const moreNavItems = filteredNavItems.slice(4);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setMoreMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdowns when route changes
  useEffect(() => {
    setProfileOpen(false);
    setMoreMenuOpen(false);
  }, [location.pathname]);

  // Handle keyboard accessibility for dropdowns
  const handleEscapeKey = useCallback((event) => {
    if (event.key === 'Escape') {
      setProfileOpen(false);
      setMoreMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleEscapeKey]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setProfileOpen(false);
  };

  // Common styles for nav items
  const getNavItemStyles = (isActive) => `
    flex flex-col items-center text-xs px-2 py-1 rounded-lg transition-colors duration-200
    ${isActive 
      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
      : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
  `;

  // Common styles for dropdown menu items
  const getDropdownItemStyles = (isActive) => `
    flex items-center gap-2 px-4 py-3 transition-colors duration-200
    ${isActive 
      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
      : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
  `;

  return (
    <nav 
      className={`xl:hidden fixed bottom-0 right-0 left-0 z-50 flex justify-around items-center px-2 py-2 border-t shadow-md ${
        isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-700'
      }`}
      dir="rtl"
      aria-label="التنقل الرئيسي"
    >
      {/* Main Navigation Items */}
      {mainNavItems.map(({ to, icon, label }) => {
        const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
        return (
          <Link
            key={to}
            to={to}
            className={getNavItemStyles(isActive)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={label}
          >
            <div className="mb-1" aria-hidden="true">{icon}</div>
            <span className="text-xs truncate">{label}</span>
          </Link>
        );
      })}
      
      
      {/* More Menu Item */}
      {moreNavItems.length > 0 && (
        <div className="relative" ref={moreMenuRef}>
          <button 
            className={getNavItemStyles(isMoreMenuOpen)}
            aria-label="المزيد من الخيارات"
            aria-expanded={isMoreMenuOpen}
            aria-haspopup="true"
            onClick={() => {
              setMoreMenuOpen(!isMoreMenuOpen);
              setProfileOpen(false); // Close other menu when opening this one
            }}
          >
            <div className="mb-1" aria-hidden="true">
              {isMoreMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </div>
            <span className="text-xs">المزيد</span>
          </button>
          
          {isMoreMenuOpen && (
            <div 
              className="absolute bottom-full mb-2 right-0 w-48 flex flex-col rounded-md shadow-lg bg-white dark:bg-gray-800 text-sm border border-gray-200 dark:border-gray-700"
              dir="rtl"
              role="menu"
            >
              {moreNavItems.map(({ to, icon, label }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={getDropdownItemStyles(isActive)}
                    role="menuitem"
                  >
                    <span className="text-lg" aria-hidden="true">{icon}</span>
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Profile Dropdown */}
      <div className="relative" ref={profileRef}>
        <button 
          className={getNavItemStyles(isProfileOpen)}
          aria-label="الملف الشخصي"
          aria-expanded={isProfileOpen}
          aria-haspopup="true"
          onClick={() => {
            setProfileOpen(!isProfileOpen);
            setMoreMenuOpen(false); // Close other menu when opening this one
          }}
        >
          <div className="mb-1" aria-hidden="true">
            <UserCircle size={20} className={isProfileOpen ? "text-blue-600 dark:text-blue-400" : ""} />
          </div>
          <span className="text-xs">الحساب</span>
        </button>
        
        {isProfileOpen && (
          <div 
            className="absolute bottom-full mb-2 left-0 w-56 flex flex-col rounded-md shadow-lg bg-white dark:bg-gray-800 text-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            dir="rtl"
            role="menu"
          >
            {/* User info section */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <div className="font-medium truncate">{name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">{role}</div>
            </div>
            
            {/* Action links */}
            <Link 
              to="/profile" 
              className={getDropdownItemStyles(location.pathname === '/profile')}
              role="menuitem"
            >
              <UserCircle size={18} aria-hidden="true" />
              <span>الملف الشخصي</span>
            </Link>
            
            <Link 
              to="/edit-profile" 
              className={getDropdownItemStyles(location.pathname === '/edit-profile')}
              role="menuitem"
            >
              <Settings size={18} aria-hidden="true" />
              <span>تعديل البيانات</span>
            </Link>
            
            <button 
              onClick={toggleTheme} 
              className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-right"
              role="menuitem"
            >
              {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
              <span>{isDark ? 'الوضع النهاري' : 'الوضع المظلم'}</span>
            </button>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-right border-t border-gray-200 dark:border-gray-700"
              role="menuitem"
            >
              <LogOut size={18} aria-hidden="true" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MobileNav;