// src/components/DashboardCard.jsx
import React from 'react';

const DashboardCard = ({ icon, title, value, color = '#016FB9' }) => {
  return (
    <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="text-gray-700 dark:text-white font-semibold text-lg flex items-center gap-2">
          {icon} {title}
        </div>
        <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      </div>
    </div>
  );
};

export default DashboardCard;
