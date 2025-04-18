// src/pages/Dashboard.jsx
import React from 'react';
import { Users, FileText, Building2, Layers3, Receipt, DollarSign } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import DashboardCharts from '../components/DashboardCharts';
import useDashboardData from '../hooks/useDashboardData';

const Dashboard = () => {
  const { stats, contractTypes, barData } = useDashboardData();

  const cards = [
    { title: 'العملاء', value: stats.customers, icon: <Users size={18} /> },
    { title: 'العقارات', value: stats.properties, icon: <Building2 size={18} /> },
    { title: 'الوحدات', value: stats.units, icon: <Layers3 size={18} /> },
    { title: 'العقود', value: stats.contracts, icon: <FileText size={18} /> },
    { title: 'الفواتير', value: stats.invoices, icon: <Receipt size={18} /> },
    { title: 'إجمالي المبيعات', value: `${stats.totalSales.toLocaleString()} ج.م`, icon: <DollarSign size={18} /> },
  ];

  return (
    <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-right" dir="rtl">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-6">لوحة التحكم</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>

      <DashboardCharts contractTypes={contractTypes} barData={barData} />
    </div>
  );
};

export default Dashboard;
