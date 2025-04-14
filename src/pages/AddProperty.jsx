import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/properties', formData);
      alert('تمت إضافة العقار بنجاح!');
      navigate('/properties');
    } catch (err) {
      console.error('خطأ في حفظ العقار:', err);
      alert('حدث خطأ أثناء الإضافة');
    }
  };

  return (
    <div className='pt-4 p-6'>
      <Breadcrumb />
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 dark:text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">إضافة عقار جديد</h2>

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

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          حفظ العقار
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddProperty;
