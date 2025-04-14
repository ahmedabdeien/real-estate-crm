import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { Eye, Trash, Pencil, Plus, Search, Building2 } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const res = await axios.get('/properties');
        setProperties(res.data);
        setLoading(false);
      } catch (err) {
        console.error('فشل في تحميل العقارات', err);
        setLoading(false);
      }
    };
    fetchProps();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العقار؟')) return;
    try {
      await axios.delete(`/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error('خطأ في حذف العقار', err);
    }
  };

  const filtered = properties.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-4 p-6">
     <Breadcrumb />
     <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg shadow-sm">
  <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
    <Building2 size={26} /> العقارات
  </h2>
</div>

{/* أدوات التحكم */}
<div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

  {/* حقل البحث */}
  <div className="relative w-full md:w-1/2">
    <input
      type="text"
      placeholder="بحث بالاسم أو الموقع..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
    <Search
      size={18}
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
    />
  </div>

  {/* زر إضافة عقار */}
  <Link
    to="/properties/new"
    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md flex items-center justify-center gap-2 shadow"
  >
    <Plus size={18} />
    <span>أضافة عقار جديد </span>
  </Link>
</div>

      {loading ? (
        <div className="flex flex-col justify-center items-center space-y-4 w-full h-[70vh]">
        <ClipLoader size={50} color="#016FB9" />
        <p className="text-gray-600">جارٍ تحميل البيانات...</p>
      </div>

      ) : (
        <div className="overflow-x-auto shadow">
  <table className="min-w-full bg-white text-sm border border-gray-200">
    <thead className="bg-gray-100 text-gray-700 text-center">
      <tr>
        <th className="px-3 py-2 border">#</th>
        <th className="px-3 py-2 border">الاسم</th>
        <th className="px-3 py-2 border">الموقع</th>
        <th className="px-3 py-2 border">الوصف</th>
        <th className="px-3 py-2 border">تاريخ الإضافة</th>
        <th className="px-3 py-2 border">التحكم</th>
      </tr>
    </thead>
    <tbody>
      {filtered.map((p, index) => (
        <tr key={p._id} className="hover:bg-gray-50 text-center transition duration-200">
          <td className="border px-3 py-2">{index + 1}</td>
          <td className="border px-3 py-2">{p.name}</td>
          <td className="border px-3 py-2">{p.location}</td>
          <td className="border px-3 py-2 truncate max-w-xs text-start">
            {p.description || '—'}
          </td>
          <td className="border px-3 py-2">{new Date(p.createdAt).toLocaleDateString()}</td>
          <td className="border px-3 py-2">
            <div className="flex justify-center gap-2 flex-wrap rtl:flex-row-reverse">
              <Link
                to={`/properties/${p._id}`}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                title="تفاصيل"
              >
                <Eye size={18} />
                <span className="hidden sm:inline text-xs">تفاصيل</span>
              </Link>

              <Link
                to={`/properties/edit/${p._id}`}
                className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800"
                title="تعديل"
              >
                <Pencil size={18} />
                <span className="hidden sm:inline text-xs">تعديل</span>
              </Link>

              <button
                onClick={() => handleDelete(p._id)}
                className="flex items-center gap-1 text-red-600 hover:text-red-800"
                title="حذف"
              >
                <Trash size={18} />
                <span className="hidden sm:inline text-xs">حذف</span>
              </button>
            </div>
          </td>
        </tr>
      ))}
      {filtered.length === 0 && (
        <tr>
          <td colSpan={6} className="text-center py-5 text-gray-500 font-medium">
            لا توجد عقارات مطابقة.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      )}
    </div>
  );
};

export default Properties;
