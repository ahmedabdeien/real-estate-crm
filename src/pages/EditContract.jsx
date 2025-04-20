import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { ClipLoader } from 'react-spinners';
import Breadcrumb from '../components/Breadcrumb';
import useSweetAlert from '../utils/useSweetAlert';

const EditContract = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { error } = useSweetAlert();

  const [customers, setCustomers] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toastSuccess, toastError } = useSweetAlert();

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
        const [resCustomers, resUnits, resContract] = await Promise.all([
          axios.get('/customers'),
          axios.get('/units'),
          axios.get(`/contracts/${id}`)
        ]);

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
        error('فشل في تحميل بيانات العقد');
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
    setIsSubmitting(true);
    try {
      await axios.put(`/contracts/${id}`, formData);
      toastSuccess('تم تعديل العقد بنجاح!');
      navigate('/contracts');
    } catch (err) {
      console.error('خطأ في تعديل العقد', err);
      toastError('فشل في حفظ التعديلات');
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
          <h2 className="text-2xl font-bold text-white text-right">تعديل العقد</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
            <div className="space-y-4">

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">نوع العقد</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                >
                  <option value="بيع">بيع</option>
                  <option value="إيجار">إيجار</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">السعر</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">العميل</label>
                <select
                  name="customer"
                  value={formData.customer?._id || formData.customer}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                >
                  <option value="">-- اختر --</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">الوحدة</label>
                <select
                  name="unit"
                  value={formData.unit?._id || formData.unit}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                >
                  <option value="">-- اختر --</option>
                  {units.map((u) => (
                    <option key={u._id} value={u._id}>{u.code}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">تاريخ البدء</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                  />
                </div>
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

export default EditContract;
