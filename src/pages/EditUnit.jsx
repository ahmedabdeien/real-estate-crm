import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import { ClipLoader } from 'react-spinners';
import Breadcrumb from '../components/Breadcrumb';

const EditUnit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    code: '',
    type: 'شقة',
    area: '',
    price: '',
    property: '',
    notes: '',
    status: 'متاحة'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // ابدأ التحميل
        const resProps = await axios.get('/properties');
        setProperties(resProps.data);
  
        const resUnit = await axios.get(`/units/${id}`);
        setFormData({
          code: resUnit.data.code,
          type: resUnit.data.type,
          area: resUnit.data.area,
          price: resUnit.data.price,
          notes: resUnit.data.notes,
          status: resUnit.data.status,
          property: resUnit.data.property?._id || resUnit.data.property || '',
        });
      } catch (err) {
        console.error('فشل في تحميل البيانات', err);
      } finally {
        setLoading(false); // انتهى التحميل
      }
    };
    fetchData();
  }, [id]);
  
  

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/units/${id}`, formData);
      alert('تم تعديل الوحدة بنجاح!');
      navigate('/units');
    } catch (err) {
      console.error('خطأ في تعديل الوحدة', err);
      alert('فشل في حفظ التعديلات');
    }
  };
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4 w-full h-[90vh]">
        <ClipLoader size={50} color="#016FB9" />
        <p className="text-gray-600">جارٍ تحميل البيانات...</p>
      </div>
    );
  }
  
  return (
    <div className="p-6 w-full h-screen dark:bg-gray-800">
         <Breadcrumb />
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 dark:text-white rounded shadow border">
      <h2 className="text-2xl font-bold mb-4">تعديل الوحدة</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">كود الوحدة</label>
          <input type="text" name="code" value={formData.code} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>

        <div>
          <label className="block mb-1">نوع الوحدة</label>
          <select name="type" value={formData.type} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="شقة">شقة</option>
            <option value="فيلا">فيلا</option>
            <option value="محل">محل</option>
            <option value="مخزن">مخزن</option>
            <option value="أخرى">أخرى</option>
          </select>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block mb-1">المساحة (م²)</label>
            <input type="number" name="area" value={formData.area} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div className="w-1/2">
            <label className="block mb-1">السعر (ج.م)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
        </div>

        <div>
          <label className="block mb-1">العقار المرتبط</label>
          <select name="property" value={formData.property} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">-- اختر --</option>
            {properties.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">الحالة</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="متاحة">متاحة</option>
            <option value="محجوزة">محجوزة</option>
            <option value="مباعة">مباعة</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">ملاحظات</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full border p-2 rounded" rows={3} />
        </div>

        <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded">
          حفظ التعديلات
        </button>
      </form>
    </div>
    </div>
  );
};

export default EditUnit;
