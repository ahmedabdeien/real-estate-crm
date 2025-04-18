import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Building2,
  Landmark,
  Receipt,
  CheckCircle,
  Shield,
  Layers3,
} from 'lucide-react';
import dashboardpreview from '../assets/dashboard-preview.png';

const Home = () => {
  return (
    <div className="p-6 space-y-10">

      {/* Hero Section with Dashboard Mockup */}
      <section className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex-1 text-center lg:text-right">
          <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-4">
            نظام إدارة عقاري شامل
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            صمّم Aqarmis لمساعدتك على إدارة كل تفاصيل أعمالك العقارية من شاشة واحدة. عقود، فواتير، وحدات، عملاء والمزيد في لوحة تحكم أنيقة وسهلة.
          </p>
        </div>
        <div className="flex-1">
          <img
            src={dashboardpreview}
            alt="Dashboard Preview"
            className="w-full "
          />
        </div>
      </section>

      {/* المميزات الرئيسية للنظام */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Feature icon={<CheckCircle size={24} />} title="سهولة الاستخدام" desc="واجهة بسيطة وسريعة تدعم العربية والوضع الليلي." />
        <Feature icon={<Shield size={24} />} title="أمان عالي" desc="جميع البيانات محمية بتقنيات تشفير وتوثيق متقدمة." />
        <Feature icon={<Layers3 size={24} />} title="كل شيء في مكان واحد" desc="إدارة كاملة لعقاراتك من لوحة تحكم واحدة." />
      </section>

      {/* لماذا Aqarmis؟ */}
      <section className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          لماذا تختار <span className="text-primary">Aqarmis؟</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature icon={<Layers3 size={24} />} title="تكامل شامل" desc="نظام واحد يغطي جميع العمليات: العملاء، العقارات، العقود، الوحدات، الفواتير." />
          <Feature icon={<Shield size={24} />} title="حماية البيانات" desc="تأمين متقدم باستخدام التشفير وتوثيق الدخول." />
          <Feature icon={<CheckCircle size={24} />} title="سهولة الاستخدام" desc="واجهة مستخدم بسيطة وسلسة لكل الفِرق." />
          <Feature icon={<Receipt size={24} />} title="فواتير لحظية" desc="توليد فواتير تلقائيًا من العقود مع خيار التصدير PDF أو Excel." />
          <Feature icon={<FileText size={24} />} title="إدارة العقود بذكاء" desc="إنشاء، تعديل، تتبع، وطباعة العقود إلكترونيًا بسهولة." />
          <Feature icon={<Users size={24} />} title="معلومات عملاء منظمة" desc="بيانات دقيقة وقابلة للبحث مع صفحات تفصيلية لكل عميل." />
        </div>
      </section>

      {/* روابط الأقسام */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">الأقسام الرئيسية</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardLink to="/customers" icon={<Users size={30} className="text-blue-600" />} title="العملاء" description="إدارة العملاء ومعلومات التواصل." bg="bg-blue-100 dark:bg-blue-900" />
          <CardLink to="/contracts" icon={<FileText size={30} className="text-green-600" />} title="العقود" description="تتبع وإنشاء العقود." bg="bg-green-100 dark:bg-green-900" />
          <CardLink to="/units" icon={<Building2 size={30} className="text-yellow-600" />} title="الوحدات" description="تفاصيل المساحات والحالة والسعر." bg="bg-yellow-100 dark:bg-yellow-900" />
          <CardLink to="/properties" icon={<Landmark size={30} className="text-purple-600" />} title="العقارات" description="مواقع وتفاصيل العقارات." bg="bg-purple-100 dark:bg-purple-900" />
          <CardLink to="/invoices" icon={<Receipt size={30} className="text-red-600" />} title="الفواتير" description="إنشاء وإدارة الفواتير." bg="bg-red-100 dark:bg-red-900" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-blue-50 dark:bg-blue-900 rounded-xl py-10 px-6 mt-10 shadow">
        <h2 className="text-2xl font-bold text-blue-800 dark:text-white mb-4">
          جاهز لتجربة Aqarmis؟
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-xl mx-auto">
          انضم الآن وابدأ إدارة نشاطك العقاري بطريقة أكثر احترافية. كل ما تحتاجه في نظام واحد بسيط وآمن.
        </p>
        <Link
          to="/register"
          className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-6 rounded transition"
        >
          ابدأ الآن مجانًا
        </Link>
      </section>

      {/* من نحن */}
      <section className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-center mt-10">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">من نحن؟</h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Aqarmis هو نظام تم تطويره خصيصًا لمساعدة شركات التطوير العقاري على إدارة عملياتها اليومية بمرونة، وفعالية، واحترافية. نحن نؤمن بأن التكنولوجيا هي المستقبل الحقيقي لإدارة الأصول العقارية.
        </p>
      </section>
    </div>
  );
};

const CardLink = ({ to, icon, title, description, bg }) => (
  <Link
    to={to}
    className={`${bg} hover:scale-[1.03] transition-transform rounded-xl p-5 shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700`}
  >
    <div className="shrink-0">{icon}</div>
    <div>
      <h3 className="font-bold text-md text-gray-800 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </Link>
);

const Feature = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700">
    <div className="text-blue-500">{icon}</div>
    <div>
      <h4 className="text-md font-semibold text-gray-800 dark:text-white">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300">{desc}</p>
    </div>
  </div>
);

export default Home;