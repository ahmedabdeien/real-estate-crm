import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import useSweetAlert from '../utils/useSweetAlert';

const AddProperty = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: ''
  });
  const { success, error } = useSweetAlert();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      error('يرجى إدخال اسم العقار');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('/properties', formData);
      success('تمت إضافة العقار بنجاح!');
      navigate('/properties');
    } catch (err) {
      console.error('خطأ في حفظ العقار:', err);
      error('حدث خطأ أثناء الإضافة');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.name || formData.location || formData.description) {
      if (window.confirm('هل أنت متأكد من إلغاء إدخال العقار؟')) {
        navigate('/properties');
      }
    } else {
      navigate('/properties');
    }
  };

  return (
    <div className="py-4 px-6 min-h-screen bg-gray-50 dark:bg-gray-800">
      <Breadcrumb />
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4" style={{ backgroundColor: '#2d5d89' }}>
          <h2 className="text-2xl font-bold text-white text-right">إضافة عقار جديد</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
            <div className="space-y-4">

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">اسم العقار <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md focus:ring-2 focus:ring-[#2d5d89]/70 focus:outline-none dark:bg-gray-800 dark:text-white"
                  placeholder="أدخل اسم العقار"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">الموقع</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md focus:ring-2 focus:ring-[#2d5d89]/70 focus:outline-none dark:bg-gray-800 dark:text-white"
                  placeholder="أدخل موقع العقار"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">الوصف</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md focus:ring-2 focus:ring-[#2d5d89]/70 focus:outline-none dark:bg-gray-800 dark:text-white"
                  placeholder="أدخل وصفًا مختصرًا للعقار"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-1/2 px-5 py-2.5 text-sm font-medium text-white rounded-md bg-[#2d5d89] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#33618b] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="w-1/2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
