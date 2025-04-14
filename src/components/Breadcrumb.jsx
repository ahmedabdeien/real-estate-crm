import { Link, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { useEffect, useState } from 'react';
import {
  Home,
  Users,
  FileText,
  Building2,
  FilePlus2,
  Pencil,
  Eye,
  LayoutDashboard,
  FileCheck2,
} from 'lucide-react';

const routeMap = {
  dashboard: { label: 'لوحة التحكم', icon: <LayoutDashboard className="w-4 h-4 mr-1" /> },
  customers: { label: 'العملاء', icon: <Users className="w-4 h-4 mr-1" /> },
  contracts: { label: 'العقود', icon: <FileText className="w-4 h-4 mr-1" /> },
  invoices: { label: 'الفواتير', icon: <FileCheck2 className="w-4 h-4 mr-1" /> },
  properties: { label: 'العقارات', icon: <Building2 className="w-4 h-4 mr-1" /> },
  units: { label: 'الوحدات', icon: <Building2 className="w-4 h-4 mr-1" /> },
  new: { label: 'إضافة جديدة', icon: <FilePlus2 className="w-4 h-4 mr-1" /> },
  edit: { label: 'تعديل', icon: <Pencil className="w-4 h-4 mr-1" /> },
  details: { label: 'تفاصيل', icon: <Eye className="w-4 h-4 mr-1" /> },
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const [dynamicLabels, setDynamicLabels] = useState({});

  useEffect(() => {
    const fetchDynamicData = async () => {
      const labels = {};

      if (pathnames[0] === 'customers' && pathnames[1]) {
        try {
          const res = await axios.get(`/customers/${pathnames[1]}`);
          labels[pathnames[1]] = res.data.name;
        } catch (err) {
          console.error('فشل جلب اسم العميل');
        }
      }

      if (pathnames[0] === 'contracts' && pathnames[1]) {
        try {
          const res = await axios.get(`/contracts/${pathnames[1]}`);
          labels[pathnames[1]] = `عقد رقم ${res.data.code || res.data._id}`;
        } catch (err) {
          console.error('فشل جلب رقم العقد');
        }
      }

      if (pathnames[0] === 'units' && pathnames[1]) {
        try {
          const res = await axios.get(`/units/${pathnames[1]}`);
          labels[pathnames[1]] = `وحدة ${res.data.code || res.data._id}`;
        } catch (err) {
          console.error('فشل جلب بيانات الوحدة');
        }
      }

      setDynamicLabels(labels);
    };

    fetchDynamicData();
  }, [location.pathname]);

  return (
    <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 rtl:space-x-reverse">
        <li className="inline-flex items-center">
          <Link to="/" className="text-blue-600 hover:underline inline-flex items-center">
            <Home className="w-4 h-4 mr-1" />
            الرئيسية
          </Link>
        </li>

        {pathnames.map((name, index) => {
          const routeTo = '/' + pathnames.slice(0, index + 1).join('/');
          const isLast = index === pathnames.length - 1;

          const routeInfo = routeMap[name] || {
            label: dynamicLabels[name] || decodeURIComponent(name),
            icon: null,
          };

          return (
            <li key={index} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="text-gray-700 inline-flex items-center">
                  {routeInfo.icon}
                  {routeInfo.label}
                </span>
              ) : (
                <Link to={routeTo} className="text-blue-600 hover:underline inline-flex items-center">
                  {routeInfo.icon}
                  {routeInfo.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
