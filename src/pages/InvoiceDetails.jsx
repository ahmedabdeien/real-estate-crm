import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Breadcrumb from '../components/Breadcrumb';
const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/invoices/contract/${id}`); // 👈 هنا
        setInvoice(res.data);
        setLoading(false);
      } catch (err) {
        console.error('فشل في تحميل بيانات الفاتورة', err);
      }
    };
    fetchInvoice();
  }, [id]);
  

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4 w-full h-[90vh]">
        <ClipLoader size={50} color="#016FB9" />
        <p className="text-gray-600">جارٍ تحميل البيانات...</p>
      </div>
    );
  }

  if (!invoice) return <p className="text-center p-6 text-red-500">لم يتم العثور على الفاتورة</p>;

  return (
    <div className="pt-4 p-6">
  <Breadcrumb />

  <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 dark:text-white shadow rounded border border-gray-200 dark:border-gray-700 border-b-4 border-b-blue-600">
    <h2 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-400">
      تفاصيل الفاتورة
    </h2>

    <div className="space-y-5 text-sm text-gray-800 dark:text-gray-200">
      {/* معلومات الفاتورة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <strong>رقم الفاتورة:</strong> {invoice.invoiceNumber}
        </div>

        <div>
          <strong>الحالة:</strong>
          <span
            className={`ml-2 px-2 py-1 rounded text-white text-xs font-semibold ${
              invoice.status === 'مدفوعة' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {invoice.status}
          </span>
        </div>

        <div>
          <strong>المبلغ:</strong> {invoice.amount?.toLocaleString()} ج.م
        </div>

        <div>
          <strong>تاريخ الإصدار:</strong> {formatDate(invoice.issueDate)}
        </div>

        <div>
          <strong>العميل:</strong> {invoice.contract?.customer?.name}
        </div>

        <div>
          <strong>كود الوحدة:</strong> {invoice.contract?.unit?.code}
        </div>
      </div>

      {/* ملاحظات */}
      {invoice.notes && (
        <div>
          <strong>ملاحظات:</strong>
          <p className="mt-1 bg-gray-100 dark:bg-gray-800 p-3 rounded leading-relaxed">
            {invoice.notes}
          </p>
        </div>
      )}

      {/* الأزرار */}
      <div className="mt-6 flex flex-wrap gap-4">
        <button
          onClick={() => navigate('/invoices')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
        >
          العودة
        </button>

        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          طباعة
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default InvoiceDetails;
