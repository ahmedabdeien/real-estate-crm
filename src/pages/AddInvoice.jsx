import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import useSweetAlert from '../utils/useSweetAlert';

const AddInvoice = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    contract: '',
    amount: '',
    issueDate: '',
    status: 'غير مدفوعة',
    notes: ''
  });
  const { error,toastSuccess, toastError  } = useSweetAlert();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await axios.get('/contracts');
        setContracts(res.data);
      } catch (err) {
        console.error('فشل في تحميل العقود', err);
      }
    };
    fetchContracts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.contract || !formData.amount || !formData.issueDate) {
      error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('/invoices', formData);
      toastSuccess('تمت إضافة الفاتورة بنجاح!');
      navigate('/invoices');
    } catch (err) {
      console.error('خطأ في حفظ الفاتورة:', err);
      toastError('حدث خطأ أثناء الإضافة');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (Object.values(formData).some((v) => v)) {
      if (window.confirm('هل أنت متأكد من إلغاء إدخال الفاتورة؟')) {
        navigate('/invoices');
      }
    } else {
      navigate('/invoices');
    }
  };

  return (
    <div className="py-4 px-6 min-h-screen bg-gray-50 dark:bg-gray-800">
      <Breadcrumb />
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4" style={{ backgroundColor: '#2d5d89' }}>
          <h2 className="text-2xl font-bold text-white text-right">إضافة فاتورة</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
            <div className="space-y-4">

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">اختر العقد</label>
                <select
                  name="contract"
                  value={formData.contract}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                >
                  <option value="">-- اختر عقد --</option>
                  {contracts.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.customer?.name} - {c.unit?.code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">المبلغ</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">تاريخ الإصدار</label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">الحالة</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                >
                  <option value="مدفوعة">مدفوعة</option>
                  <option value="غير مدفوعة">غير مدفوعة</option>
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

export default AddInvoice;
