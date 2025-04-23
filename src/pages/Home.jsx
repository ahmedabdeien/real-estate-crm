import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  FileText,
  Building2,
  Landmark,
  Receipt,
  CheckCircle,
  Shield,
  Layers3,
  BotMessageSquare,
  Sparkles,
  ArrowRight,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import dashboardPreview from '../assets/dashboard-preview.png';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Refs for scroll sections
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const whyUsRef = useRef(null);
  const sectionsRef = useRef(null);
  
  // Handle scroll events to track active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      setIsScrolled(scrollPosition > 10);
      
      // Check which section is in view
      const sections = [
        { ref: heroRef, id: 'hero' },
        { ref: featuresRef, id: 'features' },
        { ref: whyUsRef, id: 'why-us' },
        { ref: sectionsRef, id: 'sections' }
      ];
      
      for (const section of sections) {
        if (section.ref.current) {
          const { offsetTop, offsetHeight } = section.ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  // Scroll to section function
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Fixed Navigation Bar with animations */}
      <header className={`sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm transition-all duration-300 shadow-sm ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Navigation Links */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Aqarmis</h1>
              </div>
              
              {/* Desktop Navigation Links */}
              <nav className="hidden md:ml-10 md:flex md:space-x-6 md:space-x-reverse">
                <NavLink 
                  isActive={activeSection === 'hero'} 
                  onClick={() => scrollToSection(heroRef)}
                >
                  الرئيسية
                </NavLink>
                
                <NavLink 
                  isActive={activeSection === 'features'} 
                  onClick={() => scrollToSection(featuresRef)}
                >
                  المميزات
                </NavLink>
                
                <NavLink 
                  isActive={activeSection === 'why-us'} 
                  onClick={() => scrollToSection(whyUsRef)}
                >
                  لماذا نحن؟
                </NavLink>
                
                <NavLink 
                  isActive={activeSection === 'sections'} 
                  onClick={() => scrollToSection(sectionsRef)}
                >
                  الأقسام
                </NavLink>
              </nav>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center">
              {/* Search Button */}
              <button
                onClick={() => setShowSearchBar(!showSearchBar)}
                className="mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                aria-label="بحث"
              >
                <Search size={20} />
              </button>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                aria-label={theme === 'dark' ? 'وضع النهار' : 'وضع الليل'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {/* Chat AI Button */}
              <Link 
                to="/chat"
                className="hidden md:flex mr-2 items-center px-3 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 transition-colors"
              >
                <BotMessageSquare size={18} className="ml-1" />
                <span>المساعد الذكي</span>
              </Link>
              
              {/* Auth buttons */}
              {isAuthenticated ? (
                <Link 
                  to="/dashboard" 
                  className="hidden md:flex items-center px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  لوحة التحكم
                  <ArrowRight size={16} className="mr-1" />
                </Link>
              ) : (
                <div className="hidden md:flex items-center space-x-3 space-x-reverse">
                  <Link 
                    to="/login" 
                    className="px-4 py-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    إنشاء حساب
                  </Link>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          
          {/* Search Bar - Expandable */}
          {showSearchBar && (
            <div className="py-3 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في الموقع..."
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-r-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition-colors"
                >
                  بحث
                </button>
              </form>
            </div>
          )}
        </div>
      </header>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-900">
          <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">Aqarmis</h2>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="p-4 space-y-4">
            <MobileNavLink onClick={() => {
              scrollToSection(heroRef);
              setIsMenuOpen(false);
            }}>
              الرئيسية
            </MobileNavLink>
            
            <MobileNavLink onClick={() => {
              scrollToSection(featuresRef);
              setIsMenuOpen(false);
            }}>
              المميزات
            </MobileNavLink>
            
            <MobileNavLink onClick={() => {
              scrollToSection(whyUsRef);
              setIsMenuOpen(false);
            }}>
              لماذا نحن؟
            </MobileNavLink>
            
            <MobileNavLink onClick={() => {
              scrollToSection(sectionsRef);
              setIsMenuOpen(false);
            }}>
              الأقسام
            </MobileNavLink>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link 
                to="/chat"
                className="flex items-center px-4 py-3 rounded-lg bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 transition-colors mb-3"
              >
                <BotMessageSquare size={20} className="ml-2" />
                <span>المساعد الذكي</span>
              </Link>
              
              {isAuthenticated ? (
                <Link 
                  to="/dashboard" 
                  className="flex items-center justify-center px-4 py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  لوحة التحكم
                  <ArrowRight size={18} className="mr-2" />
                </Link>
              ) : (
                <div className="space-y-3">
                  <Link 
                    to="/login" 
                    className="block px-4 py-3 rounded-lg text-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    تسجيل الدخول
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-4 py-3 rounded-lg text-center font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    إنشاء حساب
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
      
      <main className="pb-16 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Hero Section with Animated Dashboard Mockup */}
          <section 
            ref={heroRef} 
            className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900/30 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900 p-8 flex flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden"
          >
            {/* Background geometric shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-200/30 dark:bg-blue-700/10"></div>
              <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-indigo-200/40 dark:bg-indigo-700/10"></div>
              <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-purple-200/30 dark:bg-purple-700/10"></div>
            </div>
            
            <div className="flex-1 text-center lg:text-right z-10">
              <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
                #1 نظام إدارة عقارية في السعودية
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-l from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent mb-6">
                نظام إدارة عقاري شامل
              </h2>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8 max-w-xl mx-auto lg:mr-0">
                صمّم <span className="font-semibold text-blue-700 dark:text-blue-400">Aqarmis</span> لمساعدتك على إدارة كل تفاصيل أعمالك العقارية من شاشة واحدة بكفاءة عالية. عقود، فواتير، وحدات، عملاء والمزيد في لوحة تحكم أنيقة وسهلة.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-4">
                <Link 
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all w-full sm:w-auto text-center"
                >
                  {isAuthenticated ? "الذهاب للوحة التحكم" : "ابدأ الآن مجانًا"}
                </Link>
                
                <Link 
                  to="/videos"
                  className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 font-medium rounded-lg shadow hover:shadow-lg transition-all w-full sm:w-auto text-center"
                >
                  شاهد كيف يعمل
                </Link>
              </div>
            </div>
            
            <div className="flex-1 relative z-10">
              <div className="relative">
                {/* Glow effect behind image */}
                <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/10 blur-xl rounded-full"></div>
                
                {/* Floating animation for dashboard image */}
                <img
                  src={dashboardPreview}
                  alt="Dashboard Preview"
                  className="w-full relative drop-shadow-2xl rounded-lg border border-gray-200 dark:border-gray-700 animate-float transform hover:scale-105 transition-transform duration-500"
                />
                
                {/* Sparkle effects */}
                <div className="absolute top-10 left-10">
                  <Sparkles size={20} className="text-yellow-500 animate-pulse" />
                </div>
                <div className="absolute bottom-20 right-10">
                  <Sparkles size={20} className="text-purple-500 animate-pulse" />
                </div>
              </div>
            </div>
          </section>

          {/* المميزات الرئيسية للنظام with hover effects */}
          <section ref={featuresRef} className="py-8">
            <SectionHeading title="المميزات الرئيسية" subtitle="ما يميز Aqarmis عن أنظمة إدارة العقارات الأخرى" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
              <FeatureCard 
                icon={<CheckCircle size={28} />} 
                title="سهولة الاستخدام" 
                desc="واجهة بسيطة وسريعة تدعم العربية والوضع الليلي لراحة عينيك." 
                color="blue"
              />
              <FeatureCard 
                icon={<Shield size={28} />} 
                title="أمان عالي" 
                desc="جميع البيانات محمية بتقنيات تشفير وتوثيق متقدمة ومتوافقة مع معايير الأمان العالمية." 
                color="green"
              />
              <FeatureCard 
                icon={<Layers3 size={28} />} 
                title="كل شيء في مكان واحد" 
                desc="إدارة كاملة لعقاراتك من لوحة تحكم واحدة تجمع كل وظائف الإدارة بمكان واحد." 
                color="purple"
              />
              <FeatureCard 
                icon={<BotMessageSquare size={28} />} 
                title="مساعد ذكي" 
                desc="مساعد ذكي مدعوم بالذكاء الاصطناعي لمساعدتك في إدارة العقارات والعقود بشكل أكثر فعالية." 
                color="indigo"
              />
            </div>
          </section>

          {/* لماذا Aqarmis؟ with animated counters */}
          <section ref={whyUsRef} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <SectionHeading 
              title={<>لماذا تختار <span className="text-blue-600 dark:text-blue-400">Aqarmis</span>؟</>} 
              subtitle="نظام متكامل يلبي جميع احتياجات إدارة العقارات بكفاءة وفعالية" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <Feature 
                icon={<Layers3 size={24} />} 
                title="تكامل شامل" 
                desc="نظام واحد يغطي جميع العمليات: العملاء، العقارات، العقود، الوحدات، الفواتير." 
                highlight
              />
              <Feature 
                icon={<Shield size={24} />} 
                title="حماية البيانات" 
                desc="تأمين متقدم باستخدام التشفير وتوثيق الدخول وأحدث تقنيات الأمان." 
                highlight
              />
              <Feature 
                icon={<CheckCircle size={24} />} 
                title="سهولة الاستخدام" 
                desc="واجهة مستخدم بسيطة وسلسة لكل الفِرق مصممة خصيصاً للاستخدام العربي." 
                highlight
              />
              <Feature 
                icon={<Receipt size={24} />} 
                title="فواتير لحظية" 
                desc="توليد فواتير تلقائيًا من العقود مع خيار التصدير PDF أو Excel وإمكانية الطباعة." 
                highlight
              />
              <Feature 
                icon={<FileText size={24} />} 
                title="إدارة العقود بذكاء" 
                desc="إنشاء، تعديل، تتبع، وطباعة العقود إلكترونيًا بسهولة مع قوالب متنوعة." 
                highlight
              />
              <Feature 
                icon={<Users size={24} />} 
                title="معلومات عملاء منظمة" 
                desc="بيانات دقيقة وقابلة للبحث مع صفحات تفصيلية لكل عميل وإشعارات آلية." 
                highlight
              />
            </div>
            
            {/* Statistics Counter Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 py-6 border-t border-b border-gray-200 dark:border-gray-700">
              <StatCounter number="1000+" label="عميل نشط" />
              <StatCounter number="25+" label="سنة خبرة" />
              <StatCounter number="99.9%" label="نسبة الاستقرار" />
              <StatCounter number="24/7" label="دعم فني" />
            </div>
          </section>

          {/* روابط الأقسام with hover animations */}
          <section ref={sectionsRef}>
            <SectionHeading 
              title="الأقسام الرئيسية" 
              subtitle="استكشف جميع أقسام النظام لإدارة عملياتك العقارية بكفاءة" 
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <CardLink 
                to="/customers" 
                icon={<Users size={30} className="text-blue-600" />} 
                title="العملاء" 
                description="إدارة العملاء ومعلومات التواصل بسهولة وفعالية." 
                bg="bg-blue-100 dark:bg-blue-900/50" 
              />
              <CardLink 
                to="/contracts" 
                icon={<FileText size={30} className="text-green-600" />} 
                title="العقود" 
                description="تتبع وإنشاء العقود باستخدام قوالب احترافية." 
                bg="bg-green-100 dark:bg-green-900/50" 
              />
              <CardLink 
                to="/units" 
                icon={<Building2 size={30} className="text-yellow-600" />} 
                title="الوحدات" 
                description="تفاصيل المساحات والحالة والسعر لجميع الوحدات العقارية." 
                bg="bg-yellow-100 dark:bg-yellow-900/50" 
              />
              <CardLink 
                to="/properties" 
                icon={<Landmark size={30} className="text-purple-600" />} 
                title="العقارات" 
                description="مواقع وتفاصيل العقارات مع إمكانية عرضها على الخريطة." 
                bg="bg-purple-100 dark:bg-purple-900/50" 
              />
              <CardLink 
                to="/invoices" 
                icon={<Receipt size={30} className="text-red-600" />} 
                title="الفواتير" 
                description="إنشاء وإدارة الفواتير بأشكال متنوعة قابلة للتخصيص." 
                bg="bg-red-100 dark:bg-red-900/50" 
              />
              <CardLink 
                to="/chat" 
                icon={<BotMessageSquare size={30} className="text-indigo-600" />} 
                title="المساعد الذكي" 
                description="تواصل مع المساعد الذكي لتسريع أعمالك اليومية." 
                bg="bg-indigo-100 dark:bg-indigo-900/50" 
              />
            </div>
          </section>

          {/* المميزات المتقدمة */}
          <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg p-8">
            <SectionHeading 
              title="مميزات متقدمة" 
              subtitle="اكتشف القدرات المتطورة التي يوفرها Aqarmis لأعمالك العقارية" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <AdvancedFeature 
                title="تحليلات ذكية" 
                description="رؤية شاملة لأداء أعمالك العقارية مع تقارير وإحصائيات مفصلة تساعدك على اتخاذ قرارات أفضل."
                icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"></path>
                  <path d="M18 17V9"></path>
                  <path d="M13 17V5"></path>
                  <path d="M8 17v-3"></path>
                </svg>}
              />
              
              <AdvancedFeature 
                title="إشعارات ذكية" 
                description="لا تفوت أي موعد هام مع نظام الإشعارات المتقدم الذي ينبهك لانتهاء العقود، مواعيد الدفعات وأكثر."
                icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>}
              />
              
              <AdvancedFeature 
                title="تقارير مخصصة" 
                description="إنشاء تقارير بمعايير مخصصة حسب احتياجات عملك مع إمكانية تصديرها بصيغ متعددة."
                icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>}
              />
              
              <AdvancedFeature 
                title="لوحة تحكم متجاوبة" 
                description="استخدم النظام من أي جهاز - حاسوب، جوال أو لوحي مع تصميم متجاوب يعمل على جميع الشاشات."
                icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>}
              />
            </div>
          </section>

          {/* CTA Section with enhanced design */}

{/* CTA Section with enhanced design */}
<section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 rounded-2xl py-12 px-8 shadow-xl">
  {/* Background dots pattern */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
  </div>
  
  {/* Content */}
  <div className="relative z-10 text-center max-w-3xl mx-auto">
    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
      هل أنت مستعد لبدء رحلتك العقارية؟
    </h2>
    <p className="text-lg lg:text-xl text-white/90 mb-8">
      انضم إلى أكثر من 1000+ عميل يستخدمون Aqarmis لإدارة عقاراتهم بكفاءة
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <Link 
        to="/register" 
        className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all w-full sm:w-auto"
      >
        ابدأ النسخة المجانية
      </Link>
      <Link 
        to="/demo" 
        className="px-6 py-3 bg-transparent border border-white text-white rounded-lg hover:bg-white/10 transition-all w-full sm:w-auto"
      >
        جرب демо
      </Link>
    </div>
  </div>
</section>

        </div>
      </main>
    </>
  );
};

// Helper Components (already existed in original code)
const NavLink = ({ children, isActive, ...props }) => (
  <a
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive 
        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
    }`}
    {...props}
  >
    {children}
  </a>
);

const MobileNavLink = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="block px-4 py-3 text-right text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors w-full"
  >
    {children}
  </button>
);

const SectionHeading = ({ title, subtitle }) => (
  <div className="text-center">
    <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
      {title}
    </h2>
    <p className="text-lg text-gray-600 dark:text-gray-400">
      {subtitle}
    </p>
  </div>
);

const FeatureCard = ({ icon, title, desc, color }) => (
  <div className={`p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700`}>
    <div className={`p-3 rounded-lg mb-4 bg-${color}-100 dark:bg-${color}-900/30`}>
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      {desc}
    </p>
  </div>
);

const Feature = ({ icon, title, desc, highlight }) => (
  <div className={`p-4 rounded-lg flex items-start gap-4 ${highlight ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-gray-800 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {desc}
      </p>
    </div>
  </div>
);

const StatCounter = ({ number, label }) => (
  <div className="text-center">
    <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
      {number}
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      {label}
    </p>
  </div>
);

const CardLink = ({ to, icon, title, description, bg }) => (
  <Link 
    to={to}
    className={`block p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform hover:scale-105 ${bg}`}
  >
    <div className="mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      {description}
    </p>
  </Link>
);

const AdvancedFeature = ({ icon, title, description }) => (
  <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      {description}
    </p>
  </div>
);

export default Home;