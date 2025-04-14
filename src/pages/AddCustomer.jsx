import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Breadcrumb from '../components/Breadcrumb';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/customers', formData);
      alert('تم إضافة العميل بنجاح');
      navigate('/customers');
    } catch (error) {
      console.error('خطأ أثناء الإضافة:', error);
      alert('فشل في إضافة العميل');
    }
  };

  return (
    <div className='pt-4 p-6'>
        <Breadcrumb />
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 dark:text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">➕ إضافة عميل جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">الاسم</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">رقم الهاتف</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">البريد الإلكتروني</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">ملاحظات</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full border p-2 rounded" />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">حفظ</button>
      </form>
    </div>
    </div>
  );
};

export default AddCustomer;
