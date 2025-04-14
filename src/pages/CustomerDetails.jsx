import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { ClipLoader } from 'react-spinners';
const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`/customers/${id}`);
        setCustomer(res.data);
      } catch (error) {
        console.error('فشل في جلب بيانات العميل:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4 w-full h-[90vh]">
        <ClipLoader size={50} color="#016FB9" />
        <p className="text-gray-600">جارٍ تحميل البيانات...</p>
      </div>
    );
  }
  if (!customer) return <p className="p-6 text-red-600">العميل غير موجود.</p>;

  return (
    <div className="pt-4 p-6">
    <Breadcrumb />
  
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 dark:text-white rounded shadow border border-gray-200 dark:border-gray-700 border-b-4 border-b-gray-500">
      {/* عنوان + زر رجوع */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
          تفاصيل العميل
        </h2> 
  
        <button
          onClick={() => navigate(-1)}
          className="text-sm flex items-center gap-1 text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} /> رجوع
        </button>
      </div>
  
      {/* بيانات العميل */}
      <div className="space-y-3  text-gray-800 dark:text-gray-200">
        <p>
          <strong>الاسم:</strong> {customer.name}
        </p>
        <p>
          <strong>رقم الهاتف:</strong> {customer.phone}
        </p>
        <p>
          <strong>البريد الإلكتروني:</strong> {customer.email || '—'}
        </p>
        <p>
          <strong>ملاحظات:</strong> {customer.notes || '—'}
        </p>
        <p>
          <strong>تاريخ الإنشاء:</strong>{' '}
          {new Date(customer.createdAt).toLocaleDateString()}
        </p>
      </div>
  
      {/* أزرار التحكم */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={`/customers/edit/${id}`}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition"
        >
          تعديل
        </Link>
        <button
          onClick={() => navigate('/customers')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
        >
          عودة للقائمة
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default CustomerDetails;
