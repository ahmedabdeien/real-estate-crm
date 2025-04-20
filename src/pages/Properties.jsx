import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { Eye, Trash, Pencil, Plus, Search, Building2, Printer, FileSpreadsheet, FileDown, FileText } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import useSweetAlert from '../utils/useSweetAlert';
import useAuthStore from '../store/useAuthStore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { success, error, confirm } = useSweetAlert();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { role } = useAuthStore();

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const res = await axios.get('/properties');
        setProperties(res.data);
        setLoading(false);
      } catch (err) {
        console.error('فشل في تحميل العقارات', err);
        setLoading(false);
      }
    };
    fetchProps();
  }, []);

  const handleDelete = async (id) => {
    confirm({
      title: 'هل أنت متأكد من حذف هذا العقار؟',
      text: 'لن تتمكن من التراجع بعد الحذف!',
      confirmText: 'نعم، احذف',
      cancelText: 'إلغاء',
      onConfirm: async () => {
        try {
          await axios.delete(`/properties/${id}`);
          setProperties((prev) => prev.filter((p) => p._id !== id));
          success('تم حذف العقار بنجاح');
        } catch (err) {
          console.error('خطأ في حذف العقار', err);
          error('حدث خطأ أثناء الحذف');
        }
      },
    });
  };

  const filtered = properties.filter((p) => {
    const nameMatch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const locationMatch = p.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const date = new Date(p.createdAt);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    const dateMatch = (!from || date >= from) && (!to || date <= to);
    return (nameMatch || locationMatch) && dateMatch;
  });

  const paginated = [...filtered].reverse().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('قائمة العقارات', 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [['#', 'الاسم', 'الموقع', 'الوصف', 'تاريخ الإضافة']],
      body: [...filtered].reverse().map((p, i) => [
        i + 1,
        p.name,
        p.location,
        p.description || '—',
        new Date(p.createdAt).toLocaleDateString(),
      ]),
    });
    doc.save('properties.pdf');
  };

  const exportToExcel = () => {
    const data = [...filtered].reverse().map((p, i) => ({
      '#': i + 1,
      'الاسم': p.name,
      'الموقع': p.location,
      'الوصف': p.description || '—',
      'تاريخ الإضافة': new Date(p.createdAt).toLocaleDateString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Properties');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer]), 'properties.xlsx');
  };

  const uniqueLocations = [...new Set(properties.map(p => p.location).filter(Boolean))];
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4 w-full h-screen">
        <ClipLoader size={50} color="#016FB9" />
        <p className="text-gray-600">جارٍ تحميل البيانات...</p>
      </div>
    );
  }
  return (
    <div className="pt-4 p-6 ">
      <Breadcrumb />
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Building2 size={26} /> العقارات
        </h2>
      </div>

{/* 🎛️ أدوات التحكم */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">

  {/* 🔍 حقل البحث */}
  <div className="col-span-2 xl:col-span-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">بحث بالاسم أو الموقع</label>
    <div className="relative">
      <input
        type="text"
        placeholder="مثال: القاهرة، المهندسين..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    </div>
  </div>

  {/* 📍 فلترة الموقع */}
  <div className="col-span-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">فلترة حسب الموقع</label>
    <select
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="">كل المواقع</option>
      {uniqueLocations.map((loc, idx) => (
        <option key={idx} value={loc}>{loc}</option>
      ))}
    </select>
  </div>

  {/* 📅 فلترة التاريخ */}
  <div className="flex gap-2 col-span-3 xl:col-span-1">
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">من تاريخ</label>
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">إلى تاريخ</label>
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  </div>

  {/* 💾 أزرار التصدير والطباعة */}
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 col-span-3">

    {/* ➕ زر الإضافة */}
    {['admin'].includes(role) && (
      <Link
        to="/properties/new"
        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow transition"
      >
        <Plus size={18} />
        <span>إضافة عقار جديد</span>
      </Link>
    )}

    <button
      onClick={exportToPDF}
      className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
    >
      <FileText  size={16} />
      <span>تصدير PDF</span>
    </button>

    <button
      onClick={exportToExcel}
      className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
    >
      <FileSpreadsheet size={16} />
      <span>تصدير Excel</span>
    </button>

    <button
      onClick={() => window.print()}
      className="inline-flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
    >
      <Printer size={16} />
      <span>طباعة</span>
    </button>

  </div>
</div>

      {/* جدول العقارات */}
      
        
      <div className="border border-gray-200 shadow  bg-white">
  <div className="w-full overflow-x-auto">
    <table className="min-w-[750px] w-full text-sm text-center">
      <thead className="bg-gray-100 text-gray-700 font-bold">
        <tr>
          <th className="whitespace-nowrap px-4 py-2 border">#</th>
          <th className="whitespace-nowrap px-4 py-2  border">الاسم</th>
          <th className="whitespace-nowrap px-4 py-2  border">الموقع</th>
          <th className="whitespace-nowrap px-4 py-2  border">الوصف</th>
          <th className="whitespace-nowrap px-4 py-2  border">تاريخ الإضافة</th>
          <th className="whitespace-nowrap px-4 py-2  border">التحكم</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {paginated.map((p, index) => (
          <tr key={p._id} className="hover:bg-gray-50">
            <td className="whitespace-nowrap px-4 py-2  border">{index + 1}</td>
            <td className="whitespace-nowrap px-4 py-2  border" >{p.name}</td>
            <td className="whitespace-nowrap px-4 py-2  border">{p.location}</td>
            <td className="px-4 py-2 text-start  border">{p.description || '—'}</td>
            <td className="whitespace-nowrap px-4 py-2  border">{new Date(p.createdAt).toLocaleDateString()}</td>
            <td className="whitespace-nowrap px-4 py-2  border">
              <div className="flex justify-center gap-2 rtl:flex-row-reverse">
                <Link to={`/properties/${p._id}`} className="text-blue-600 hover:text-blue-800"><Eye size={16} /></Link>
                <Link to={`/properties/edit/${p._id}`} className="text-yellow-600 hover:text-yellow-800"><Pencil size={16} /></Link>
                <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:text-red-800"><Trash size={16} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            {Array.from({ length: Math.ceil(filtered.length / itemsPerPage ) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded border text-sm ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        
      
    </div>
  );
};

export default Properties;
