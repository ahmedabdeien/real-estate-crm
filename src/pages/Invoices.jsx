// ✅ Invoices.jsx بعد تفعيل SweetAlert2
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { Eye, Trash, Pencil, Plus, Search, FileText } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import Breadcrumb from '../components/Breadcrumb';
import useSweetAlert from '../utils/useSweetAlert';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { confirm, success, error } = useSweetAlert();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get('/invoices/all');
        setInvoices(res.data);
      } catch (err) {
        console.error('فشل في تحميل الفواتير', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    confirm({
      title: 'هل أنت متأكد من حذف الفاتورة؟',
      text: 'لن تتمكن من استرجاعها لاحقًا!',
      confirmText: 'نعم، احذف',
      cancelText: 'إلغاء',
      onConfirm: async () => {
        try {
          await axios.delete(`/invoices/${id}`);
          setInvoices((prev) => prev.filter((i) => i._id !== id));
          success('تم حذف الفاتورة بنجاح');
        } catch (err) {
          console.error('فشل في حذف الفاتورة', err);
          error('حدث خطأ أثناء حذف الفاتورة');
        }
      },
    });
  };

  const filtered = invoices.filter(
    (inv) =>
      inv.invoiceNumber?.toString().includes(search) ||
      inv.contract?.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-4 p-6">
         <Breadcrumb />
         <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg shadow-sm">
  <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
    <FileText size={28} /> الفواتير
  </h2>
</div>

{/* شريط البحث وزر الإضافة */}
<div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center mb-6">
  {/* حقل البحث */}
  <div className="relative w-full md:w-2/3">
    <input
      type="text"
      placeholder="بحث برقم الفاتورة أو اسم العميل..."
      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <Search
      size={18}
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
    />
  </div>

  {/* زر إضافة فاتورة */}
  <Link
    to="/invoices/new"
    className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md flex items-center justify-center gap-2 shadow"
  >
    <Plus size={18} />
    <span>إضافة فاتورة</span>
  </Link>
</div>

      {loading ? (
        <div className="flex flex-col justify-center items-center space-y-4 w-full h-[55vh]">
        <ClipLoader size={50} color="#016FB9" />
        <p className="text-gray-600">جارٍ تحميل البيانات...</p>
      </div>

      ) : (
        <div className="overflow-x-auto shadow">
        <table className="min-w-full text-sm border border-gray-200 bg-white dark:bg-gray-900 dark:text-white">
          <thead className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-center">
            <tr>
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">رقم الفاتورة</th>
              <th className="border px-3 py-2">العميل</th>
              <th className="border px-3 py-2">الوحدة</th>
              <th className="border px-3 py-2">المبلغ</th>
              <th className="border px-3 py-2">التاريخ</th>
              <th className="border px-3 py-2">الحالة</th>
              <th className="border px-3 py-2">التحكم</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv, i) => (
              <tr key={inv._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 text-center transition duration-200">
                <td className="border px-3 py-2">{i + 1}</td>
                <td className="border px-3 py-2">{inv.invoiceNumber}</td>
                <td className="border px-3 py-2">{inv.contract?.customer?.name || '—'}</td>
                <td className="border px-3 py-2">{inv.contract?.unit?.code || '—'}</td>
                <td className="border px-3 py-2">{inv.amount?.toLocaleString()} ج.م</td>
                <td className="border px-3 py-2">{new Date(inv.issueDate).toLocaleDateString()}</td>
                <td className="border px-3 py-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded text-white ${inv.status === 'مدفوعة' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="border px-3 py-2">
                  <div className="flex justify-center gap-2 flex-wrap rtl:flex-row-reverse">
                    <Link
                      to={`/invoices/contracts/${inv.contract?._id}`}
                      title="تفاصيل"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={18} />
                      <span className="hidden sm:inline text-xs">تفاصيل</span>
                    </Link>

                    <Link
                      to={`/invoices/edit/${inv._id}`}
                      title="تعديل"
                      className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800"
                    >
                      <Pencil size={18} />
                      <span className="hidden sm:inline text-xs">تعديل</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(inv._id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800"
                      title="حذف"
                    >
                      <Trash size={18} />
                      <span className="hidden sm:inline text-xs">حذف</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-5 text-gray-500 dark:text-gray-400 font-medium">
                  لا توجد فواتير مطابقة.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default Invoices;
