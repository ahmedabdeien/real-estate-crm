import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Building2,
  Landmark,
  ArrowRight,
} from 'lucide-react';

const Home = () => {
  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-900 rounded shadow p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">مرحبًا بك في نظام إدارة العقارات</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          يمكنك من هنا الوصول السريع إلى جميع أقسام النظام، مثل العملاء، العقود، الوحدات، والفواتير.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* كارت العملاء */}
        <Link to="/customers" className="bg-blue-100 dark:bg-blue-900 hover:scale-105 transition rounded p-4 shadow flex items-center gap-4">
          <Users size={32} className="text-blue-600" />
          <div>
            <h2 className="font-semibold text-blue-700 dark:text-white">العملاء</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">إدارة بيانات العملاء.</p>
          </div>
        </Link>

        {/* كارت العقود */}
        <Link to="/contracts" className="bg-green-100 dark:bg-green-900 hover:scale-105 transition rounded p-4 shadow flex items-center gap-4">
          <FileText size={32} className="text-green-600" />
          <div>
            <h2 className="font-semibold text-green-700 dark:text-white">العقود</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">عرض وإنشاء العقود.</p>
          </div>
        </Link>

        {/* كارت الوحدات */}
        <Link to="/units" className="bg-yellow-100 dark:bg-yellow-900 hover:scale-105 transition rounded p-4 shadow flex items-center gap-4">
          <Building2 size={32} className="text-yellow-600" />
          <div>
            <h2 className="font-semibold text-yellow-700 dark:text-white">الوحدات</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">تفاصيل ومساحات وأسعار الوحدات.</p>
          </div>
        </Link>

        {/* كارت العقارات */}
        <Link to="/properties" className="bg-purple-100 dark:bg-purple-900 hover:scale-105 transition rounded p-4 shadow flex items-center gap-4">
          <Landmark size={32} className="text-purple-600" />
          <div>
            <h2 className="font-semibold text-purple-700 dark:text-white">العقارات</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">مواقع وتفاصيل العقارات.</p>
          </div>
        </Link>

        {/* كارت الفواتير */}
        <Link to="/invoices" className="bg-red-100 dark:bg-red-900 hover:scale-105 transition rounded p-4 shadow flex items-center gap-4">
          <FileText size={32} className="text-red-600" />
          <div>
            <h2 className="font-semibold text-red-700 dark:text-white">الفواتير</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">قائمة الفواتير وإدارتها.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
