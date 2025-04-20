// ✅ AddContract.jsx بعد التحويل لاستخدام SweetAlert2
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import useSweetAlert from '../utils/useSweetAlert';

const AddContract = () => {
  const navigate = useNavigate();
  const { success, error, confirm } = useSweetAlert();
  const [customers, setCustomers] = useState([]);
  const [units, setUnits] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toastSuccess, toastError } = useSweetAlert();


  const [formData, setFormData] = useState({
    customer: '',
    unit: '',
    type: 'بيع',
    price: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCustomers = await axios.get('/customers');
        const resUnits = await axios.get('/units');
        setCustomers(resCustomers.data);
        setUnits(resUnits.data);
      } catch (err) {
        console.error('فشل في تحميل البيانات', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customer || !formData.unit || !formData.price || !formData.startDate || !formData.endDate) {
      error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post('/contracts', formData);
      toastSuccess('تم إضافة العقد بنجاح');
      navigate('/contracts');
    } catch (err) {
      toastError('حدث خطأ أثناء الإضافة',err);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (Object.values(formData).some((v) => v)) {
      confirm({
        title: 'هل أنت متأكد؟',
        text: 'سيتم إلغاء البيانات المدخلة',
        confirmText: 'نعم، إلغاء',
        cancelText: 'تراجع',
        onConfirm: () => navigate('/contracts'),
      });
    } else {
      navigate('/contracts');
    }
  };

  return (
    <div className="py-4 px-6 min-h-screen bg-gray-50 dark:bg-gray-800">
      <Breadcrumb />
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4" style={{ backgroundColor: '#2d5d89' }}>
          <h2 className="text-2xl font-bold text-white text-right">إضافة عقد جديد</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
            <div className="space-y-4">

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">العميل</label>
                <select
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                >
                  <option value="">-- اختر عميل --</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">الوحدة</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                >
                  <option value="">-- اختر وحدة --</option>
                  {units.map((u) => (
                    <option key={u._id} value={u._id}>{u.code}</option>
                  ))}
                </select>
              </div>

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

export default AddContract;
