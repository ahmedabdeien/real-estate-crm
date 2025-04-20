import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, ArrowUp } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import loge from '../assets/logo.png';
const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const currentYear = new Date().getFullYear();

  // Throttle scroll event for better performance
  const handleScroll = useCallback(() => {
    setShowScrollTop(window.scrollY > 300);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <footer 
      className="relative dark:bg-gray-900 text-gray-700 dark:text-gray-300 pt-8 pb-8 border-t dark:border-gray-700"
      dir="rtl"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">تذييل الصفحة</h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
          {/* القسم الأول */}
          <div>
            <img
              src={loge} 
              alt="شعار نظام إدارة العقارات"
              className="h-12 w-auto mb-4"
            />
            <p className="text-sm leading-relaxed">
              نظام متكامل لإدارة العقارات والوحدات والعقود والفواتير، مصمم لتسهيل العمل وتحسين الأداء وزيادة الإنتاجية.
            </p>
          </div>

          {/* القسم الثاني */}
          <nav aria-label="روابط سريعة">
            <h4 className="text-md font-semibold mb-3">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 inline-flex items-center">
                  <span className="border-b border-transparent hover:border-current">الرئيسية</span>
                </Link>
              </li>
              <li>
                <Link to="/customers" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 inline-flex items-center">
                  <span className="border-b border-transparent hover:border-current">العملاء</span>
                </Link>
              </li>
              <li>
                <Link to="/contracts" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 inline-flex items-center">
                  <span className="border-b border-transparent hover:border-current">العقود</span>
                </Link>
              </li>
              <li>
                <Link to="/units" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 inline-flex items-center">
                  <span className="border-b border-transparent hover:border-current">الوحدات</span>
                </Link>
              </li>
              <li>
                <Link to="/invoices" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 inline-flex items-center">
                  <span className="border-b border-transparent hover:border-current">الفواتير</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* القسم الثالث */}
          <div>
            <h4 className="text-md font-semibold mb-3">تواصل معنا</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <Phone size={16} aria-hidden="true" />
                <a 
                  href="tel:0123456789" 
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  0123456789
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} aria-hidden="true" />
                <a 
                  href="mailto:support@realestate.com" 
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  support@realestate.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Facebook size={16} aria-hidden="true" />
                <a 
                  href="https://facebook.com/realestate" 
                  className="hover:text-blue-600 transition-colors duration-200"
                  target="_blank" 
                  rel="noreferrer"
                >
                  صفحتنا على فيسبوك
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram size={16} aria-hidden="true" />
                <a 
                  href="https://instagram.com/realestate" 
                  className="hover:text-pink-500 transition-colors duration-200"
                  target="_blank" 
                  rel="noreferrer"
                >
                  تابعنا على انستجرام
                </a>
              </li>
            </ul>
          </div>
        </div>



        <div className="mt-5 text-center text-xs  text-gray-500 dark:text-gray-400 border-t dark:border-gray-800 pt-6">
          © {currentYear} جميع الحقوق محفوظة لنظام إدارة العقارات
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 xl:bottom-4 left-5 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="الصعود للأعلى"
        >
          <ArrowUp size={18} aria-hidden="true" />
        </button>
      )}
    </footer>
  );
};

export default Footer;