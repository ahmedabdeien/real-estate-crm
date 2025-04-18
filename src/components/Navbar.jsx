
// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Users, FileText, Building2, LayoutDashboard, Receipt,
  Menu, X, LogOut, LogIn, User as UserIcon, Shield, ChevronDown
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, role, token, logout } = useAuthStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeMenu = () => setMenuOpen(false);

  const navItems = [
    { to: '/', label: 'الرئيسية', icon: <Home size={18} />, roles: ['admin', 'sales', 'lawyer', 'viewer', 'accountant', 'user'] },
    { to: '/dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard size={18} />, roles: ['admin'] },
    { to: '/customers', label: 'العملاء', icon: <Users size={18} />, roles: ['admin', 'sales', 'viewer'] },
    { to: '/contracts', label: 'العقود', icon: <FileText size={18} />, roles: ['admin', 'lawyer', 'viewer'] },
    { to: '/units', label: 'الوحدات', icon: <Building2 size={18} />, roles: ['admin', 'sales', 'viewer'] },
    { to: '/properties', label: 'العقارات', icon: <Building2 size={18} />, roles: ['admin', 'sales', 'viewer'] },
    { to: '/invoices', label: 'الفواتير', icon: <Receipt size={18} />, roles: ['admin', 'accountant', 'viewer'] },
    { to: '/users', label: 'المستخدمين', icon: <Shield size={18} />, roles: ['admin'] },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const renderNavLink = ({ to, label, icon, roles }) => {
    if (!roles.includes(role)) return null;

    return (
      <Link
        key={to}
        to={to}
        className={`text-sm flex items-center gap-1 px-3 py-1 rounded transition-all duration-200 ${
          location.pathname === to ? 'text-blue-700 font-bold border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <header className="bg-white shadow-md py-3 px-6 flex justify-between items-center rtl" dir="rtl">
      <div className="text-xl font-bold text-blue-700">نظام إدارة العقارات</div>

      <nav className="hidden xl:flex gap-4 items-center">
        {navItems.map(renderNavLink)}

        {token ? (
          <div className="relative">
            <button onClick={toggleDropdown} className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600">
              <UserIcon size={18} />
              {name}
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{role}</span>
              <ChevronDown size={16} />
            </button>
            {dropdownOpen && (
              <div className="absolute mt-2 right-0 bg-white border shadow-lg rounded w-48 z-50">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 text-sm">الملف الشخصي</Link>
                <Link to="/edit-profile" className="block px-4 py-2 hover:bg-gray-100 text-sm">تعديل البيانات</Link>
                <button onClick={handleLogout} className="w-full text-start px-4 py-2 text-red-600 hover:bg-red-50 text-sm">
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="text-sm text-green-600 flex items-center gap-1">
            <LogIn size={18} /> تسجيل الدخول
          </Link>
        )}
      </nav>

      <button className="xl:hidden text-gray-700" onClick={() => setMenuOpen(true)}>
        <Menu size={24} />
      </button>
      <ThemeToggle/>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="fixed right-0 top-0 w-64 h-full bg-white shadow-lg p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-blue-700">القائمة</h2>
              <button onClick={closeMenu}><X size={24} /></button>
            </div>
            {navItems.map(renderNavLink)}
            {token ? (
              <>
                <Link to="/profile" className="text-sm px-2 py-1 hover:bg-gray-100 rounded">الملف الشخصي</Link>
                <Link to="/edit-profile" className="text-sm px-2 py-1 hover:bg-gray-100 rounded">تعديل البيانات</Link>
                <button onClick={handleLogout} className="text-sm text-red-600 px-2 py-1 hover:underline">تسجيل الخروج</button>
              </>
            ) : (
              <Link to="/login" className="text-sm text-green-600 px-2 py-1 hover:underline">تسجيل الدخول</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
