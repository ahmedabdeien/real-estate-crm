import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import { ClipLoader } from 'react-spinners';
import Breadcrumb from '../components/Breadcrumb';
import useSweetAlert from '../utils/useSweetAlert';

const EditUnit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useSweetAlert();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    type: 'شقة',
    area: '',
    price: '',
    property: '',
    notes: '',
    status: 'متاحة'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProps, resUnit] = await Promise.all([
          axios.get('/properties'),
          axios.get(`/units/${id}`)
        ]);
        setProperties(resProps.data);
        setFormData({
          code: resUnit.data.code,
          type: resUnit.data.type,
          area: resUnit.data.area,
          price: resUnit.data.price,
          notes: resUnit.data.notes,
          status: resUnit.data.status,
          property: resUnit.data.property?._id || resUnit.data.property || '',
        });
      } catch (err) {
        console.error('فشل في تحميل البيانات', err);
        error('فشل في تحميل بيانات الوحدة');
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

    if (!formData.code || !formData.area || !formData.price || !formData.property) {
      error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(`/units/${id}`, formData);
      success('تم تعديل الوحدة بنجاح!');
      navigate('/units');
    } catch (err) {
      console.error('خطأ في تعديل الوحدة', err);
      error('فشل في حفظ التعديلات');
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
          <h2 className="text-2xl font-bold text-white text-right">تعديل الوحدة</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
            <div className="space-y-4">

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">كود الوحدة</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

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
                    className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">السعر (ج.م)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">العقار المرتبط</label>
                <select
                  name="property"
                  value={formData.property}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                  required
                >
                  <option value="">-- اختر --</option>
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">الحالة</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                >
                  <option value="متاحة">متاحة</option>
                  <option value="محجوزة">محجوزة</option>
                  <option value="مباعة">مباعة</option>
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

export default EditUnit;
