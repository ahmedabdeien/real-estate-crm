import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Breadcrumb from '../components/Breadcrumb';
import { ClipLoader } from 'react-spinners';
const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setLoading(true);
        const [resInvoice, resContracts] = await Promise.all([
          axios.get(`/invoices/${id}`),
          axios.get('/contracts')
        ]);
        setFormData(resInvoice.data);
        setContracts(resContracts.data);
      } catch (err) {
        console.error('فشل في تحميل البيانات', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/invoices/${id}`, formData);
      alert('تم تعديل الفاتورة بنجاح!');
      navigate('/invoices');
    } catch (err) {
      console.error('خطأ في تعديل الفاتورة:', err);
      alert('حدث خطأ أثناء الحفظ');
    }
  };
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4 w-full h-[90vh]">
        <ClipLoader size={50} color="#016FB9" />
        <p className="text-gray-600">جارٍ تحميل البيانات...</p>
      </div>
    );
  }
  return (
    <div className="p-6">
         <Breadcrumb />
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 dark:text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">تعديل الفاتورة</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">رقم الفاتورة</label>
          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">العقد المرتبط</label>
          <select
            name="contract"
            value={formData.contract?._id || formData.contract}
            onChange={handleChange}
            className="w-full border p-2 rounded"
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
            <label className="block mb-1">المبلغ (ج.م)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1">تاريخ الإصدار</label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate?.slice(0, 10)}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">الحالة</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="مدفوعة">مدفوعة</option>
            <option value="غير مدفوعة">غير مدفوعة</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">ملاحظات</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={3}
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

export default EditInvoice;
