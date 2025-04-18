// src/pages/Settings.jsx
import { useState } from 'react';
import ThemeSettings from './ThemeSettings';
import { Sun, Bell, Globe, UserCog } from 'lucide-react';

const tabs = [
  { id: 'theme', label: 'المظهر', icon: <Sun size={16} /> },
  { id: 'notifications', label: 'الإشعارات', icon: <Bell size={16} /> },
  { id: 'language', label: 'اللغة', icon: <Globe size={16} /> },
  { id: 'account', label: 'الحساب', icon: <UserCog size={16} /> },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('theme');

  const renderContent = () => {
    switch (activeTab) {
      case 'theme':
        return <ThemeSettings />;
      case 'notifications':
        return <div className="text-gray-500 dark:text-gray-300">🚧 إعدادات الإشعارات قيد التطوير</div>;
      case 'language':
        return <div className="text-gray-500 dark:text-gray-300">🌐 إعدادات اللغة قيد التطوير</div>;
      case 'account':
        return <div className="text-gray-500 dark:text-gray-300">👤 إعدادات الحساب قيد التطوير</div>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow rounded-md" dir="rtl">
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-6">الإعدادات</h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-2 px-2 transition-all ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-700 dark:text-blue-300'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Content */}
      <div>{renderContent()}</div>
    </div>
  );
};

export default Settings;
