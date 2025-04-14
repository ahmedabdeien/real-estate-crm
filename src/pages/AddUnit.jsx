import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';

const AddUnit = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    type: 'شقة',
    area: '',
    price: '',
    property: '',
    notes: '',
    status: 'متاحة'
  });
  

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get('/properties');
        setProperties(res.data);
      } catch (err) {
        console.error('فشل في تحميل العقارات', err);
      }
    };
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/units', formData);
      alert('تمت إضافة الوحدة بنجاح!');
      navigate('/units');
    } catch (err) {
      console.error('خطأ في حفظ الوحدة:', err);
      alert('حدث خطأ أثناء الإضافة');
    }
  };

  return (
    <div className='pt-4 p-6'>
      <Breadcrumb />
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 dark:text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">إضافة وحدة جديدة</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
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
          <label className="block mb-1">اختر العقار</label>
          <select name="property" value={formData.property} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">-- اختر --</option>
            {properties.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">ملاحظات</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full border p-2 rounded" rows={3} />
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          حفظ الوحدة
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddUnit;
