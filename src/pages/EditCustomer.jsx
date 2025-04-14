import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import { ClipLoader } from 'react-spinners';
import Breadcrumb from '../components/Breadcrumb';

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/customers/${id}`);
        setFormData(res.data);
        setLoading(false);
      } catch (error) {
        console.error('فشل في تحميل بيانات العميل:', error);
        alert('حدث خطأ أثناء تحميل البيانات');
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/customers/${id}`, formData);
      alert('تم تعديل بيانات العميل بنجاح');
      navigate('/customers');
    } catch (error) {
      console.error('خطأ أثناء الحفظ:', error);
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
    <div className='pt-4 p-6'>
        <Breadcrumb />
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 dark:text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">✏️ تعديل بيانات العميل</h2>
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
        <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">حفظ التعديلات</button>
      </form>
    </div>
    </div>
  );
};

export default EditCustomer;
