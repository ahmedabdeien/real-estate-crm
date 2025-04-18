import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Breadcrumb from '../components/Breadcrumb';
import { ClipLoader } from 'react-spinners';
import useSweetAlert from '../utils/useSweetAlert';

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useSweetAlert();

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    contract: '',
    amount: '',
    issueDate: '',
    status: 'غير مدفوعة',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resInvoice, resContracts] = await Promise.all([
          axios.get(`/invoices/${id}`),
          axios.get('/contracts')
        ]);
        setFormData(resInvoice.data);
        setContracts(resContracts.data);
      } catch (err) {
        console.error('فشل في تحميل البيانات', err);
        error('فشل في تحميل بيانات الفاتورة');
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
      await axios.put(`/invoices/${id}`, formData);
      success('تم تعديل الفاتورة بنجاح!');
      navigate('/invoices');
    } catch (err) {
      console.error('خطأ في تعديل الفاتورة:', err);
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
          <h2 className="text-2xl font-bold text-white text-right">تعديل الفاتورة</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
            <div className="space-y-4">

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">رقم الفاتورة</label>
                <input
                  type="text"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">العقد المرتبط</label>
                <select
                  name="contract"
                  value={formData.contract?._id || formData.contract}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                  required
                >
                  <option value="">-- اختر عقد --</option>
                  {contracts.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.customer?.name} - {c.unit?.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">المبلغ (ج.م)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">تاريخ الإصدار</label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate?.slice(0, 10)}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
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

export default EditInvoice;
