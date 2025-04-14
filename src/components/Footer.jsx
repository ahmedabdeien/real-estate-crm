import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 pt-6 pb-12 mt-12 border-t dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* القسم الأول */}
        <div>
          <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-2">نظام إدارة العقارات</h3>
          <p className="text-sm">
            نظام متكامل لإدارة العقارات والوحدات والعقود والفواتير، مصمم لتسهيل العمل وتحسين الأداء.
          </p>
        </div>

        {/* القسم الثاني */}
        <div>
          <h4 className="text-md font-semibold mb-2">روابط سريعة</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:text-blue-600">الرئيسية</Link></li>
            <li><Link to="/customers" className="hover:text-blue-600">العملاء</Link></li>
            <li><Link to="/contracts" className="hover:text-blue-600">العقود</Link></li>
            <li><Link to="/units" className="hover:text-blue-600">الوحدات</Link></li>
            <li><Link to="/invoices" className="hover:text-blue-600">الفواتير</Link></li>
          </ul>
        </div>

        {/* القسم الثالث */}
        <div>
          <h4 className="text-md font-semibold mb-2">تواصل معنا</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2"><Phone size={16} /> 0123456789</li>
            <li className="flex items-center gap-2"><Mail size={16} /> support@realestate.com</li>
            <li className="flex items-center gap-2">
              <Facebook size={16} />
              <a href="#" className="hover:text-blue-600">صفحتنا على فيسبوك</a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram size={16} />
              <a href="#" className="hover:text-pink-500">تابعنا على انستجرام</a>
            </li>
          </ul>
        </div>
      </div>

      {/* شريط الاشتراك */}
      <div className="mt-10 max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium">اشترك في النشرة البريدية للحصول على آخر التحديثات.</p>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">اشتراك</button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} جميع الحقوق محفوظة لنظام إدارة العقارات
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg z-50 animate-bounce"
          title="الصعود للأعلى"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </footer>
  );
};

export default Footer;