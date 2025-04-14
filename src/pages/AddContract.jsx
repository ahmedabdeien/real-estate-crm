import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';

const AddContract = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({
    customer: '',
    unit: '',
    type: 'بيع',
    price: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCustomers = await axios.get('/customers');
        const resUnits = await axios.get('/units');
        setCustomers(resCustomers.data);
        setUnits(resUnits.data);
      } catch (err) {
        console.error('فشل في تحميل البيانات', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/contracts', formData);
      alert('تم إضافة العقد بنجاح!');
      navigate('/contracts');
    } catch (err) {
      console.error('فشل في إضافة العقد', err);
      alert('حدث خطأ أثناء الإضافة');
    }
  };

  return (
    <div className='pt-4 p-6'>
      <Breadcrumb />
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 dark:text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">إضافة عقد جديد</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">العميل</label>
          <select name="customer" value={formData.customer} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">-- اختر عميل --</option>
            {customers.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">الوحدة</label>
          <select name="unit" value={formData.unit} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">-- اختر وحدة --</option>
            {units.map(u => (
              <option key={u._id} value={u._id}>{u.code}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">نوع العقد</label>
          <select name="type" value={formData.type} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="بيع">بيع</option>
            <option value="إيجار">إيجار</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">السعر</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block mb-1">تاريخ البدء</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div className="w-1/2">
            <label className="block mb-1">تاريخ الانتهاء</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
        </div>

        <div>
          <label className="block mb-1">ملاحظات</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full border p-2 rounded" rows={3} />
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">حفظ العقد</button>
      </form>
    </div>
    </div>
  );
};

export default AddContract;
