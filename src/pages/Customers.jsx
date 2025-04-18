// pages/Customers.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash, Plus, Search, Users } from 'lucide-react';
import Breadcrumb from './../components/Breadcrumb';
import { ClipLoader } from 'react-spinners';
import useSweetAlert from '../utils/useSweetAlert';
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/customers');
        setCustomers(res.data);
        setLoading(false);
      } catch (err) {
        console.error('فشل في تحميل العملاء', err);
      }
    };
    fetchCustomers();
  }, []);
  const { confirm, success, error } = useSweetAlert();

  const handleDelete = (id) => {
    confirm({
      title: 'هل تريد حذف هذا العميل؟',
      text: 'لن تتمكن من استرجاع البيانات بعد الحذف!',
      confirmText: 'نعم، احذف',
      cancelText: 'لا، إلغاء',
      onConfirm: async () => {
        try {
          await axios.delete(`/customers/${id}`);
          setCustomers((prev) => prev.filter((c) => c._id !== id));
          success('تم حذف العميل بنجاح');
        } catch (err) {
          console.error('فشل في الحذف', err);
          error('فشل في حذف العميل', 'حدث خطأ أثناء الحذف، حاول مرة أخرى.');
        }
      }
    });
  };
  

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4 w-full h-screen">
        <ClipLoader size={50} color="#016FB9" />
        <p className="text-gray-600">جارٍ تحميل البيانات...</p>
      </div>
    );
  }
  const handleDeleteAll = () => {
    if (customers.length === 0) return;
  
    confirm({
      title: 'هل تريد حذف جميع العملاء؟',
      text: 'لن تتمكن من استرجاع البيانات بعد الحذف!',
      confirmText: 'نعم، احذف الكل',
      cancelText: 'إلغاء',
      onConfirm: async () => {
        try {
          await axios.delete('/customers/all'); // تأكد من وجود هذا المسار في backend
          setCustomers([]);
          success('تم حذف جميع العملاء بنجاح');
        } catch (err) {
          error('فشل في حذف الكل', 'حدث خطأ أثناء الحذف.');
        }
      }
    });
  };
  
  return (
    <div className="pt-4 p-6">
      <Breadcrumb/>
     <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg shadow-sm">
     <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
  <Users size={26} /> العملاء
  <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
    {customers.length}
  </span>
</h2>

</div>

{/* التحكم (إضافة + بحث) */}
<div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
  {/* حقل البحث */}


  {/* زر إضافة عميل */}
  <div className="flex items-center gap-2  flex-wrap">
  <Link
    to="/customers/new"
    className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md flex items-center justify-center gap-2 shadow"
  >
    <Plus size={18} />
    <span>إضافة عميل</span>
  </Link>
  <button
  onClick={handleDeleteAll}
  className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md flex items-center justify-center gap-2 shadow"
>
  <Trash size={18} />
  <span>حذف الكل</span>
</button>
</div>


<div className="relative w-full md:w-1/2 lg:w-1/3">
    <input
      type="text"
      placeholder="بحث باسم العميل..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
    <Search
      size={18}
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
    />
  </div>
</div>


      <div className="overflow-x-auto shadow">
  <table className="w-full text-sm border border-gray-200">
    <thead className="bg-gray-100 text-gray-700 text-center">
      <tr>
        <th className="border px-3 py-2">#</th>
        <th className="border px-3 py-2">اسم العميل</th>
        <th className="border px-3 py-2">الهاتف</th>
        <th className="border px-3 py-2">الإيميل</th>
        <th className="border px-3 py-2">التحكم</th>
      </tr>
    </thead>
    <tbody>
      {filtered.map((customer, i) => (
        <tr
          key={customer._id}
          className="hover:bg-gray-50 text-center transition duration-200"
        >
          <td className="border px-3 py-2">{i + 1}</td>
          <td className="border px-3 py-2">{customer.name}</td>
          <td className="border px-3 py-2">{customer.phone}</td>
          <td className="border px-3 py-2">{customer.email}</td>
          <td className="border px-3 py-2">
            <div className="flex justify-center items-center gap-2 rtl:flex-row-reverse flex-wrap">
              <Link
                to={`/customers/${customer._id}`}
                title="تفاصيل"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                <Eye size={18} />
                <span className="hidden sm:inline">تفاصيل</span>
              </Link>
              <Link
                to={`/customers/edit/${customer._id}`}
                title="تعديل"
                className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800"
              >
                <Pencil size={18} />
                <span className="hidden sm:inline">تعديل</span>
              </Link>
              <button
                onClick={() => handleDelete(customer._id)}
                className="flex items-center gap-1 text-red-600 hover:text-red-800"
                title="حذف"
              >
                <Trash size={18} />
                <span className="hidden sm:inline">حذف</span>
              </button>
            </div>
          </td>
        </tr>
      ))}

      {filtered.length === 0 && (
        <tr>
          <td
            colSpan={5}
            className="text-center py-6 text-gray-500 font-medium"
          >
            لا يوجد عملاء
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default Customers;
