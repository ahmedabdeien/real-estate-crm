// src/components/ThemeToggle.jsx
import { Moon, Sun } from 'lucide-react';
import useThemeStore from '../store/useThemeStore';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      title="تبديل الوضع"
      className="text-gray-500 hover:text-blue-600"
    >
      {theme === 'light' ?<div className='flex items-center '> <Moon size={18} /> <p className='text-sm ms-1'>الوضع المظلم</p></div> :<div className='flex items-center '> <Sun size={18} /> <p className='text-sm ms-1'>الوضع النهار</p></div>}
    </button>
  );
};

export default ThemeToggle;
