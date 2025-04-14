import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Breadcrumb from '../components/Breadcrumb';
const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/properties/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error('فشل في تحميل بيانات العقار', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4 w-full h-[90vh]">
        <ClipLoader size={50} color="#016FB9" />
        <p className="text-gray-600">جارٍ تحميل البيانات...</p>
      </div>
    );
  }
  
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/properties/${id}`, formData);
      alert('تم تعديل العقار بنجاح!');
      navigate('/properties');
    } catch (err) {
      console.error('خطأ في تعديل العقار:', err);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  return (
    <div className='pt-4 p-6'>
     <Breadcrumb />
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 dark:text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">تعديل العقار</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">اسم العقار</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">الموقع</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">الوصف</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={4}
          />
        </div>

        <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded">
          حفظ التعديلات
        </button>
      </form>
    </div>
    </div>
  );
};

export default EditProperty;
