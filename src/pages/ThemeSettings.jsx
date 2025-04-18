// src/pages/ThemeSettings.jsx
import { Sun, Moon } from 'lucide-react';
import useThemeStore from '../store/useThemeStore';

const ThemeSettings = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow rounded-md" dir="rtl">
      <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4">
        إعدادات المظهر
      </h2>

      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <div className="flex items-center gap-3">
          {theme === 'light' ? <Sun className="text-yellow-500" /> : <Moon className="text-blue-400" />}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            الوضع الحالي: {theme === 'light' ? 'نهاري' : 'ليلي'}
          </span>
        </div>

        <button
          onClick={toggleTheme}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          تبديل الوضع
        </button>
      </div>
    </div>
  );
};

export default ThemeSettings;
