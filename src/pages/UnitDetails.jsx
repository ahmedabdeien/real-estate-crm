import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { ArrowLeft, Building2, FileText, Home, StickyNote, Ruler, Coins } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import Breadcrumb from '../components/Breadcrumb';
const UnitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const res = await axios.get(`/units/${id}`);
        setUnit(res.data);
        setLoading(false);
      } catch (err) {
        console.error('فشل في تحميل بيانات الوحدة', err);
        setLoading(false);
      }
    };
    fetchUnit();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4 w-full h-[90vh]">
        <ClipLoader size={50} color="#016FB9" />
        <p className="text-gray-600">جارٍ تحميل البيانات...</p>
      </div>
    );
  }
  if (!unit) return <p className="p-4">الوحدة غير موجودة</p>;

  return (
    <div className=" p-6 w-full h-screen dark:bg-gray-800">
         <Breadcrumb />
<div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-900 dark:text-white rounded shadow border">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FileText size={22} /> تفاصيل الوحدة
      </h2>

      <div className="space-y-3">
        <p className="flex items-center gap-2"><Home size={18} /> <strong>كود الوحدة:</strong> {unit.code}</p>
        <p className="flex items-center gap-2"><FileText size={18} /> <strong>النوع:</strong> {unit.type}</p>
        <p className="flex items-center gap-2"><Ruler size={18} /> <strong>المساحة:</strong> {unit.area} م²</p>
        <p className="flex items-center gap-2"><Coins size={18} /> <strong>السعر:</strong> {unit.price?.toLocaleString()} ج.م</p>
        <p className="flex items-center gap-2"><FileText size={18} /> <strong>الحالة:</strong>
          <span className={`px-2 py-1 text-xs text-white rounded ${unit.status === 'مباعة' ? 'bg-green-600' : unit.status === 'محجوزة' ? 'bg-blue-600' : 'bg-gray-600'}`}>
            {unit.status}
          </span>
        </p>
        <p className="flex items-center gap-2"><Building2 size={18} /> <strong>العقار:</strong> {unit.property?.name}</p>
        {unit.notes && <p className="flex items-center gap-2"><StickyNote size={18} /> <strong>ملاحظات:</strong> {unit.notes}</p>}
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center gap-2"
      >
        <ArrowLeft size={18} /> رجوع
      </button>
    </div>
    </div>
    
  );
};

export default UnitDetails;
