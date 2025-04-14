import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 p-6 h-[90vh]">
      <div className="flex flex-col items-center space-y-4">
        <AlertTriangle size={64} className="text-yellow-500" />
        <h1 className="text-4xl font-bold">404 - الصفحة غير موجودة</h1>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 max-w-md">
          يبدو أنك وصلت إلى صفحة غير موجودة. تأكد من الرابط أو عد إلى الصفحة السابقة.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-flex items-center gap-2 transition"
        >
          <ArrowLeft size={18} /> العودة للخلف
        </button>
      </div>
    </div>
  );
};

export default NotFound;
