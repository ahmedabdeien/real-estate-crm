import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Breadcrumb from '../components/Breadcrumb';
import useSweetAlert from '../utils/useSweetAlert';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useSweetAlert();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: ''
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/properties/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error('فشل في تحميل بيانات العقار', err);
        error('فشل في تحميل بيانات العقار');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

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
      await axios.put(`/properties/${id}`, formData);
      success('تم تعديل العقار بنجاح!');
      navigate('/properties');
    } catch (err) {
      console.error('خطأ في تعديل العقار:', err);
      error('حدث خطأ أثناء حفظ التعديلات');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4 w-full h-[90vh] bg-gray-50 dark:bg-gray-800">
        <ClipLoader size={50} color="#2d5d89" />
        <p className="text-gray-700 dark:text-gray-300">جارٍ تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="py-4 px-6 min-h-screen bg-gray-50 dark:bg-gray-800">
      <Breadcrumb />
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4" style={{ backgroundColor: '#2d5d89' }}>
          <h2 className="text-2xl font-bold text-white text-right">تعديل العقار</h2>
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
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">الموقع</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">الوصف</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-5 py-2.5 text-sm font-medium text-white rounded-md bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;
