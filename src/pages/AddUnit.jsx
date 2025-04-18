import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import useSweetAlert from '../utils/useSweetAlert';

const AddUnit = () => {
  const navigate = useNavigate();
  const { success, error } = useSweetAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.area || !formData.price || !formData.property) {
      error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('/units', formData);
      success('تمت إضافة الوحدة بنجاح!');
      navigate('/units');
    } catch (err) {
      console.error('خطأ في حفظ الوحدة:', err);
      error('حدث خطأ أثناء الإضافة');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (Object.values(formData).some((v) => v)) {
      if (window.confirm('هل أنت متأكد من إلغاء إدخال الوحدة؟')) {
        navigate('/units');
      }
    } else {
      navigate('/units');
    }
  };

  return (
    <div className="py-4 px-6 min-h-screen bg-gray-50 dark:bg-gray-800">
      <Breadcrumb />
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4" style={{ backgroundColor: '#2d5d89' }}>
          <h2 className="text-2xl font-bold text-white text-right">إضافة وحدة جديدة</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
            <div className="space-y-4">

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">نوع الوحدة</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                >
                  <option value="شقة">شقة</option>
                  <option value="فيلا">فيلا</option>
                  <option value="محل">محل</option>
                  <option value="مخزن">مخزن</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">المساحة (م²)</label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">السعر (ج.م)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">اختر العقار</label>
                <select
                  name="property"
                  value={formData.property}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                >
                  <option value="">-- اختر --</option>
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">ملاحظات</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
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

export default AddUnit;
