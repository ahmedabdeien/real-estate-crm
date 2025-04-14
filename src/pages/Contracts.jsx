import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Eye, FileSignature, FileText, Pencil, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import {   Plus, Download, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ClipLoader } from 'react-spinners';
import Breadcrumb from '../components/Breadcrumb';
const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredContracts = contracts.filter((c) =>
    c.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type?.includes(searchTerm)
  );
  
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await axios.get('/contracts');
        setContracts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('فشل في تحميل العقود', err);
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العقد؟')) return;
    try {
      await axios.delete(`/contracts/${id}`);
      const updated = contracts.filter((c) => c._id !== id);
      setContracts(updated);
    } catch (err) {
      console.error('خطأ في حذف العقد', err);
    }
  };


  const exportToExcel = () => {
    const data = filteredContracts.map((c) => ({
      العميل: c.customer?.name,
      الوحدة: c.unit?.code,
      النوع: c.type,
      السعر: c.price,
      'تاريخ البدء': new Date(c.startDate).toLocaleDateString(),
      'تاريخ الانتهاء': new Date(c.endDate).toLocaleDateString(),
    }));
  
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Contracts');
    XLSX.writeFile(wb, 'العقود.xlsx');
  };
  
  const exportToPDF = () => {
    const doc = new jsPDF();
    const rows = filteredContracts.map((c, i) => [
      i + 1,
      c.customer?.name,
      c.unit?.code,
      c.type,
      `${c.price?.toLocaleString()} ج.م`,
      new Date(c.startDate).toLocaleDateString(),
      new Date(c.endDate).toLocaleDateString()
    ]);
  
    doc.autoTable({
      head: [['#', 'العميل', 'الوحدة', 'النوع', 'السعر', 'تاريخ البدء', 'تاريخ الانتهاء']],
      body: rows,
      styles: { font: 'arabic' },
    });
  
    doc.save('العقود.pdf');
  };
  

  return (
    <div className="pt-4 p-6">
      <Breadcrumb />
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg shadow-sm">
  <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
    <FileSignature size={26} /> العقود
  </h2>
</div>

{/* أدوات التحكم */}
<div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

  {/* أزرار التصدير */}
  <div className="flex gap-3">
    <button
      onClick={exportToPDF}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow"
    >
      <Download size={16} /> <span>تصدير PDF</span>
    </button>
    <button
      onClick={exportToExcel}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow"
    >
      <Download size={16} /> <span>تصدير Excel</span>
    </button>
  </div>

  {/* البحث */}
  <div className="relative w-full md:w-1/3">
    <input
      type="text"
      placeholder="بحث باسم العميل أو نوع العقد..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
    <Search
      size={18}
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
    />
  </div>

  {/* زر إضافة عقد */}
  <Link
    to="/contracts/new"
    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md flex items-center justify-center gap-2 shadow"
  >
    <Plus size={18} />
    <span>عقد جديد</span>
  </Link>
</div>

      {loading ? (
        <div className="flex flex-col justify-center items-center space-y-4 w-full h-[55vh]">
        <ClipLoader size={50} color="#016FB9" />
        <p className="text-gray-600">جارٍ تحميل البيانات...</p>
      </div>

      ) : (
        <div className="overflow-x-auto shadow ">
        <table className="min-w-full bg-white text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-center">
            <tr>
              <th className="px-3 py-2 border">#</th>
              <th className="px-3 py-2 border">العميل</th>
              <th className="px-3 py-2 border">الوحدة</th>
              <th className="px-3 py-2 border">النوع</th>
              <th className="px-3 py-2 border">السعر</th>
              <th className="px-3 py-2 border">تاريخ البدء</th>
              <th className="px-3 py-2 border">تاريخ الانتهاء</th>
              <th className="px-3 py-2 border">التحكم</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract, index) => (
              <tr key={contract._id} className="hover:bg-gray-50 text-center transition duration-200">
                <td className="px-3 py-2 border">{index + 1}</td>
                <td className="px-3 py-2 border">{contract.customer?.name || '—'}</td>
                <td className="px-3 py-2 border">{contract.unit?.code || '—'}</td>
                <td className="px-3 py-2 border">
                  <span className={`px-2 py-1 rounded text-white text-xs font-medium ${contract.type === 'بيع' ? 'bg-green-600' : 'bg-blue-600'}`}>
                    {contract.type}
                  </span>
                </td>
                <td className="px-3 py-2 border">{contract.price?.toLocaleString()} ج.م</td>
                <td className="px-3 py-2 border">{new Date(contract.startDate).toLocaleDateString()}</td>
                <td className="px-3 py-2 border">{new Date(contract.endDate).toLocaleDateString()}</td>
                <td className="px-3 py-2 border">
                  <div className="flex justify-center flex-wrap gap-2 rtl:flex-row-reverse">
      
                    <Link
                      to={`/contracts/${contract._id}`}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      title="تفاصيل"
                    >
                      <Eye size={18} />
                      <span className="hidden sm:inline text-xs">تفاصيل</span>
                    </Link>
      
                    <Link
                      to={`/contracts/edit/${contract._id}`}
                      className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800"
                      title="تعديل"
                    >
                      <Pencil size={18} />
                      <span className="hidden sm:inline text-xs">تعديل</span>
                    </Link>
      
                    <button
                      onClick={() => handleDelete(contract._id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800"
                      title="حذف"
                    >
                      <Trash size={18} />
                      <span className="hidden sm:inline text-xs">حذف</span>
                    </button>
      
                    <Link
                      to={`/invoices/contracts/${contract._id}`}
                      className="flex items-center gap-1 text-green-600 hover:text-green-800"
                      title="الفاتورة"
                    >
                      <FileText size={18} />
                      <span className="hidden sm:inline text-xs">فاتورة</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      )}
    </div>
  );
};

export default Contracts;
