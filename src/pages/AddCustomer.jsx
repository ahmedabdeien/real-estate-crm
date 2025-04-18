// src/pages/AddCustomer.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Breadcrumb from '../components/Breadcrumb';
import useSweetAlert from '../utils/useSweetAlert';

import { User, Phone, Mail, StickyNote } from 'lucide-react';

const AddCustomer = () => {
  const navigate = useNavigate();
  const { success, error } = useSweetAlert();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/customers', formData);
      success('تم إضافة العميل بنجاح', () => navigate('/customers'));
    } catch (err) {
      console.error('خطأ أثناء الإضافة:', err);
      error('فشل في إضافة العميل', 'يرجى التحقق من البيانات أو المحاولة لاحقًا');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.name || formData.phone || formData.email || formData.notes) {
      if (window.confirm('هل أنت متأكد من إلغاء إدخال بيانات العميل الجديد؟')) {
        navigate('/customers');
      }
    } else {
      navigate('/customers');
    }
  };

  return (
    <div className="py-4 px-6 min-h-screen bg-gray-50 dark:bg-gray-900 animate-fade-in">
      <Breadcrumb />
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4" style={{ backgroundColor: '#2d5d89' }}>
          <h2 className="text-2xl font-bold text-white text-right">إضافة عميل جديد</h2>
        </div>
        <div className="p-6 text-right" dir="rtl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* الاسم */}
              <div>
                <label htmlFor="name" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                  <span className="inline-flex items-center gap-1"><User size={16} /> الاسم <span className="text-red-500">*</span></span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="مثلاً: أحمد مصطفى"
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              {/* الهاتف */}
              <div>
                <label htmlFor="phone" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                  <span className="inline-flex items-center gap-1"><Phone size={16} /> رقم الهاتف <span className="text-red-500">*</span></span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="مثلاً: 01012345678"
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  dir="rtl"
                />
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label htmlFor="email" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                  <span className="inline-flex items-center gap-1"><Mail size={16} /> البريد الإلكتروني</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@domain.com"
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              {/* ملاحظات */}
              <div>
                <label htmlFor="notes" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                  <span className="inline-flex items-center gap-1"><StickyNote size={16} /> ملاحظات</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="ملاحظات إضافية مثل حالة العميل أو مصدر التواصل"
                  className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex justify-between items-center pt-4 gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-1/2 px-5 py-2.5 text-sm font-medium text-white rounded-md bg-[#2d5d89] hover:opacity-90 transition-all duration-200 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="w-1/2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
