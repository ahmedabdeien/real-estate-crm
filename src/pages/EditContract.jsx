import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { ClipLoader } from 'react-spinners';
import Breadcrumb from '../components/Breadcrumb';
const EditContract = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    type: 'بيع',
    price: '',
    customer: '',
    unit: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resCustomers = await axios.get('/customers');
        const resUnits = await axios.get('/units');
        const resContract = await axios.get(`/contracts/${id}`);

        setCustomers(resCustomers.data);
        setUnits(resUnits.data);
        setFormData({
          type: resContract.data.type,
          price: resContract.data.price,
          customer: resContract.data.customer,
          unit: resContract.data.unit,
          startDate: resContract.data.startDate.slice(0, 10),
          endDate: resContract.data.endDate.slice(0, 10),
          notes: resContract.data.notes
        });
      } catch (err) {
        console.error('فشل في تحميل البيانات', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/contracts/${id}`, formData);
      alert('تم تعديل العقد بنجاح!');
      navigate('/contracts');
    } catch (err) {
      console.error('خطأ في تعديل العقد', err);
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
    <div className='pt-3 p-6'>
      <Breadcrumb />
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 dark:text-white rounded shadow border">
      <h2 className="text-2xl font-bold mb-4">تعديل العقد</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label className="block mb-1">العميل</label>
          <select name="customer" value={formData.customer?._id || formData.customer} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">-- اختر --</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">الوحدة</label>
          <select name="unit" value={formData.unit?._id || formData.unit} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">-- اختر --</option>
            {units.map((u) => (
              <option key={u._id} value={u._id}>{u.code}</option>
            ))}
          </select>
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

        <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded">
          حفظ التعديلات
        </button>
      </form>
    </div>
    </div>
  );
};

export default EditContract;
