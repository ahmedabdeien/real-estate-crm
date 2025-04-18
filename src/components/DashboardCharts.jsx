// src/components/DashboardCharts.jsx
import React from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';

const DashboardCharts = ({ contractTypes, barData }) => {
  const chartColors = ['#016FB9', '#FF9505'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">توزيع العقود</h2>
        <PieChart width={300} height={250}>
          <Pie data={contractTypes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {contractTypes.map((_, index) => (
              <Cell key={index} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">إحصائيات عامة</h2>
        <BarChart width={400} height={250} data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#016FB9" />
        </BarChart>
      </div>
    </div>
  );
};

export default DashboardCharts;
