import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';

const AddInvoice = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [formData, setFormData] = useState({
    contract: '',
    amount: '',
    issueDate: '',
    status: 'غير مدفوعة',
    notes: ''
  });

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
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/invoices', formData);
      alert('تمت إضافة الفاتورة بنجاح!');
      navigate('/invoices');
    } catch (err) {
      console.error('خطأ في حفظ الفاتورة:', err);
      alert('حدث خطأ أثناء الإضافة');
    }
  };

  return (
    <div className='pt-4 p-6'>
      <Breadcrumb />
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 dark:text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4"> إضافة فاتورة</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">اختر العقد</label>
          <select name="contract" value={formData.contract} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">-- اختر عقد --</option>
            {contracts.map((c) => (
              <option key={c._id} value={c._id}>
                {c.customer?.name} - {c.unit?.code}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">المبلغ</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>

        <div>
          <label className="block mb-1">تاريخ الإصدار</label>
          <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>

        <div>
          <label className="block mb-1">الحالة</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="مدفوعة">مدفوعة</option>
            <option value="غير مدفوعة">غير مدفوعة</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">ملاحظات</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full border p-2 rounded" rows={3} />
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">حفظ الفاتورة</button>
      </form>
    </div>
    </div>
  );
};

export default AddInvoice;
