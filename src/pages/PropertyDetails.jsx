import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { ArrowLeft, Building2, MapPin, StickyNote, CalendarDays } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import Breadcrumb from '../components/Breadcrumb';
const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    const fetchPropertyWithUnits = async () => {
      try {
        const resProp = await axios.get(`/properties/${id}`);
        const resUnits = await axios.get('/units');
        const relatedUnits = resUnits.data.filter((u) => u.property === id);
        setProperty(resProp.data);
        setUnits(relatedUnits);
        setLoading(false);
      } catch (err) {
        console.error('فشل في تحميل البيانات', err);
        setLoading(false);
      }
    };
    fetchPropertyWithUnits();
  }, [id]);
  

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4 w-full h-[90vh]">
        <ClipLoader size={50} color="#016FB9" />
        <p className="text-gray-600">جارٍ تحميل البيانات...</p>
      </div>
    );
  }
  if (!property) return <p className="p-4">العقار غير موجود</p>;

  return (<>
  <div className='pt-4 p-6'>
  <Breadcrumb />
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-900 dark:text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Building2 size={22} /> تفاصيل العقار
      </h2>

      <div className="space-y-3">
        <p className="flex items-center gap-2"><Building2 size={18} /> <strong>الاسم:</strong> {property.name}</p>
        <p className="flex items-center gap-2"><MapPin size={18} /> <strong>الموقع:</strong> {property.location || '—'}</p>
        <p className="flex items-center gap-2"><StickyNote size={18} /> <strong>الوصف:</strong> {property.description || '—'}</p>
        <p className="flex items-center gap-2"><CalendarDays size={18} /> <strong>تاريخ الإضافة:</strong> {new Date(property.createdAt).toLocaleDateString()}</p>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center gap-2"
      >
        <ArrowLeft size={18} /> رجوع
      </button>
    </div>
    {units.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">الوحدات المرتبطة</h3>
          <div className="overflow-x-auto rounded">
            <table className="min-w-full text-sm bg-white dark:bg-gray-800 border">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="border px-3 py-2">#</th>
                  <th className="border px-3 py-2">الكود</th>
                  <th className="border px-3 py-2">النوع</th>
                  <th className="border px-3 py-2">المساحة</th>
                  <th className="border px-3 py-2">السعر</th>
                  <th className="border px-3 py-2">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {units.map((u, i) => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="border px-3 py-2 text-center">{i + 1}</td>
                    <td className="border px-3 py-2">{u.code}</td>
                    <td className="border px-3 py-2">{u.type}</td>
                    <td className="border px-3 py-2">{u.area} م²</td>
                    <td className="border px-3 py-2">{u.price?.toLocaleString()} ج.م</td>
                    <td className="border px-3 py-2">
                      <span className={`px-2 py-1 rounded text-xs text-white ${u.status === 'مباعة' ? 'bg-green-600' : u.status === 'محجوزة' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
        </div>
 </> );
};

export default PropertyDetails;
