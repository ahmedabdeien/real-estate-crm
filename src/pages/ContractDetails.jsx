import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import {
  User,
  FileText,
  Home,
  Calendar,
  Coins,
  StickyNote,
  ArrowLeft,
  Printer,
  FileSearch,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const ContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  const printRef = useRef();

  const handlePrint = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`تفاصيل_العقد_${contract._id}.pdf`);
  };

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/contracts/${id}`);
        setContract(res.data);
        setLoading(false);
      } catch (err) {
        console.error('فشل في جلب بيانات العقد', err);
        setLoading(false);
      }
    };

    fetchContract();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4 w-full h-[90vh]">
        <ClipLoader size={50} color="#016FB9" />
        <p className="text-gray-600">جارٍ تحميل البيانات...</p>
      </div>
    );
  }
  if (!contract) return <p className="p-4">العقد غير موجود</p>;

  return (
    <div className="pt-4 p-6">
  <Breadcrumb />

  <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-900 dark:text-white rounded shadow border border-gray-200 dark:border-gray-700 border-b-4 border-b-blue-600">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-400">
      <FileText size={22} /> تفاصيل العقد
    </h2>

    {/* محتوى الطباعة */}
    <div ref={printRef} className="space-y-3 text-gray-700 dark:text-gray-200">
      <p className="flex items-center gap-2">
        <User size={18} /> <strong>العميل:</strong> {contract.customer?.name}
      </p>
      <p className="flex items-center gap-2">
        <Home size={18} /> <strong>الوحدة:</strong> {contract.unit?.code}
      </p>
      <p className="flex items-center gap-2">
        <FileText size={18} /> <strong>نوع العقد:</strong> {contract.type}
      </p>
      <p className="flex items-center gap-2">
        <Coins size={18} /> <strong>السعر:</strong> {contract.price?.toLocaleString()} ج.م
      </p>
      <p className="flex items-center gap-2">
        <Calendar size={18} /> <strong>تاريخ البدء:</strong> {new Date(contract.startDate).toLocaleDateString()}
      </p>
      <p className="flex items-center gap-2">
        <Calendar size={18} /> <strong>تاريخ الانتهاء:</strong> {new Date(contract.endDate).toLocaleDateString()}
      </p>
      {contract.notes && (
        <p className="flex items-center gap-2">
          <StickyNote size={18} /> <strong>ملاحظات:</strong> {contract.notes}
        </p>
      )}
    </div>

    {/* الأزرار */}
    <div className="mt-6 flex flex-wrap gap-4">
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-flex items-center gap-2 transition"
      >
        <ArrowLeft size={18} /> رجوع
      </button>

      <button
        onClick={handlePrint}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded inline-flex items-center gap-2 transition"
      >
        <Printer size={18} /> طباعة PDF
      </button>

      <Link
        to={`/invoices/contracts/${contract._id}`}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded inline-flex items-center gap-2 transition"
      >
        <FileSearch size={18} /> عرض الفاتورة
      </Link>
    </div>
  </div>
</div>
  );
};

export default ContractDetails;
