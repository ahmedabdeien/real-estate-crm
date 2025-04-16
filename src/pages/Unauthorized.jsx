import { AlertTriangle } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-white text-center" dir="rtl">
      <div>
        <AlertTriangle size={64} className="text-yellow-500 mb-4 mx-auto" />
        <h1 className="text-3xl font-bold mb-2">غير مصرح لك بالوصول</h1>
        <p className="mb-6">ليس لديك الصلاحية لعرض هذه الصفحة.</p>
        <a href="/" className="text-blue-600 hover:underline">العودة للرئيسية</a>
      </div>
    </div>
  );
};

export default Unauthorized;
