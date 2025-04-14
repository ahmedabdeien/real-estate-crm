import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { Eye, Trash, Plus, Search, Pencil, Building2 } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import Breadcrumb from '../components/Breadcrumb';
const Units = () => {
  const [units, setUnits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await axios.get('/units');
        setUnits(res.data);
        setLoading(false);
      } catch (err) {
        console.error('فشل في تحميل الوحدات', err);
        setLoading(false);
      }
    };
    fetchUnits();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الوحدة؟')) return;
    try {
      await axios.delete(`/units/${id}`);
      setUnits((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error('خطأ في حذف الوحدة', err);
    }
  };

  const filtered = units.filter((u) =>
    u.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.type?.includes(searchTerm) ||
    u.property?.name?.includes(searchTerm)
  );

  return (
    <div className="pt-4 p-6">
         <Breadcrumb />


{/* العنوان */}
<div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg shadow-sm">
  <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
    <Building2 size={26} /> الوحدات
  </h2>
</div>

{/* شريط البحث وزر الإضافة */}
<div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center mb-6">
  {/* حقل البحث */}
  <div className="relative w-full md:w-2/3">
    <input
      type="text"
      placeholder="بحث بالكود أو النوع أو العقار..."
      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <Search
      size={18}
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
    />
  </div>

  {/* زر إضافة وحدة */}
  <Link
    to="/units/new"
    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md flex items-center justify-center gap-2 shadow"
  >
    <Plus size={18} />
    <span>أضافة وحدة جديدة  </span>
  </Link>
</div>

      {loading ? (
        <div className="flex flex-col justify-center items-center space-y-4 w-full h-[55vh]">
        <ClipLoader size={50} color="#016FB9" />
        <p className="text-gray-600">جارٍ تحميل البيانات...</p>
      </div>

      ) : (
        <div className="overflow-x-auto shadow ">
        <table className="min-w-full bg-white text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-center">
            <tr>
              <th className="px-3 py-2 border">#</th>
              <th className="px-3 py-2 border">كود الوحدة</th>
              <th className="px-3 py-2 border">النوع</th>
              <th className="px-3 py-2 border">المساحة</th>
              <th className="px-3 py-2 border">السعر</th>
              <th className="px-3 py-2 border">الحالة</th>
              <th className="px-3 py-2 border">العقار</th>
              <th className="px-3 py-2 border">التحكم</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, index) => (
              <tr key={u._id} className="hover:bg-gray-50 text-center transition duration-200">
                <td className="border px-3 py-2">{index + 1}</td>
                <td className="border px-3 py-2">{u.code}</td>
                <td className="border px-3 py-2">{u.type}</td>
                <td className="border px-3 py-2">{u.area} م²</td>
                <td className="border px-3 py-2">{u.price?.toLocaleString()} ج.م</td>
      
                {/* الحالة */}
                <td className="border px-3 py-2">
                  <span
                    className={`text-white text-xs font-medium px-2 py-1 rounded ${
                      u.status === 'مباعة'
                        ? 'bg-red-600'
                        : u.status === 'محجوزة'
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
      
                {/* العقار */}
                <td className="border px-3 py-2">{u.property?.name || '—'}</td>
      
                {/* التحكم */}
                <td className="border px-3 py-2">
                  <div className="flex justify-center flex-wrap gap-2 rtl:flex-row-reverse">
                    <Link
                      to={`/units/${u._id}`}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      title="تفاصيل"
                    >
                      <Eye size={18} />
                      <span className="hidden sm:inline text-xs">تفاصيل</span>
                    </Link>
      
                    <Link
                      to={`/units/edit/${u._id}`}
                      className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800"
                      title="تعديل"
                    >
                      <Pencil size={18} />
                      <span className="hidden sm:inline text-xs">تعديل</span>
                    </Link>
      
                    <button
                      onClick={() => handleDelete(u._id)}
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
          </tbody>
        </table>
      </div>
      
      )}
    </div>
  );
};

export default Units;
