import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Users, FileText, Building2,
  LayoutDashboard, Receipt, Menu, X,
  LogOut, LogIn,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { name, role, token, logout } = useAuthStore();

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setMenuOpen(false);
    }, 300);
  };

  useEffect(() => {
    if (menuOpen) closeMenu();
  }, [location.pathname]);

  const navItems = [
    { to: '/', icon: <Home size={18} />, label: 'الرئيسية', roles: ['admin', 'sales', 'lawyer', 'viewer', 'accountant', "user"] },
    { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'لوحة التحكم', roles: ['admin'] },
    { to: '/customers', icon: <Users size={18} />, label: 'العملاء', roles: ['admin', 'sales', 'viewer'] },
    { to: '/contracts', icon: <FileText size={18} />, label: 'العقود', roles: ['admin', 'lawyer', 'viewer'] },
    { to: '/units', icon: <Building2 size={18} />, label: 'الوحدات', roles: ['admin', 'sales', 'viewer'] },
    { to: '/properties', icon: <Building2 size={18} />, label: 'العقارات', roles: ['admin', 'sales', 'viewer'] },
    { to: '/invoices', icon: <Receipt size={18} />, label: 'الفواتير', roles: ['admin', 'accountant', 'viewer'] },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md py-3 px-6 flex justify-between items-center rtl relative z-20">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-4">
        <h1 className="text-xl font-bold dark:text-blue-400 animate-logo-slide">
          نظام إدارة العقارات
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          مرحبًا، <span className="font-semibold">{name || 'ضيف'}</span>
        </div>
      </div>

      <nav className="space-x-6 rtl:space-x-reverse hidden md:flex items-center">
        {navItems.map(({ to, icon, label, roles }) =>
          roles.includes(role) && (
            <Link
              key={to}
              to={to}
              className={`text-sm flex items-center gap-1 px-2 py-1 rounded transition-all duration-200 ${
                location.pathname === to
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600'
              }`}
            >
              {icon}
              {label}
            </Link>
          )
        )}

        {/* زر الدخول/الخروج */}
        {token ? (
          <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-red-600 hover:underline">
            <LogOut size={18} /> تسجيل الخروج
          </button>
        ) : (
          <Link to="/login" className="flex items-center gap-1 text-sm text-green-600 hover:underline">
            <LogIn size={18} /> تسجيل الدخول
          </Link>
        )}
      </nav>

      <button className="md:hidden text-gray-700 dark:text-white" onClick={() => setMenuOpen(true)}>
        <Menu size={24} />
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMenu} />
          <div className={`fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg z-50 p-4 flex flex-col gap-4 ${isClosing ? 'animate-slide-out' : 'animate-slide-in'} rtl:right-0 rtl:left-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-blue-700 dark:text-blue-400">القائمة</h2>
              <button onClick={closeMenu}><X size={24} /></button>
            </div>

            {navItems.map(({ to, icon, label, roles }, index) =>
              roles.includes(role) && (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 py-2 px-3 rounded transition-all duration-200 ${
                    location.pathname === to
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
                  } animate-icon-fade`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {icon}
                  {label}
                </Link>
              )
            )}

            {token ? (
              <button onClick={handleLogout} className="flex items-center gap-2 py-2 px-3 text-start text-red-600 hover:underline">
                <LogOut size={18} /> تسجيل الخروج
              </button>
            ) : (
              <Link to="/login" className="flex items-center gap-2 py-2 px-3 text-start text-green-600 hover:underline">
                <LogIn size={18} /> تسجيل الدخول
              </Link>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
