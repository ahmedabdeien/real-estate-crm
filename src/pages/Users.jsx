// src/pages/Users.jsx
import { useEffect, useState, useMemo, useCallback } from 'react';
import axios from '../api/axios';
import {
  UserCog, Trash2, Loader2, ToggleLeft, ToggleRight, Search, Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const MySwal = withReactContent(Swal);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/users');
      console.log('🟢 كل المستخدمين:', res.data);
      setUsers(res.data);
    } catch (err) {
      setMessage('❌ فشل في تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Use useMemo to filter users only when dependencies change
  const filteredUsers = useMemo(() => {
    let result = users;
  
    if (search) {
      result = result.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
      );
    }
  
    if (roleFilter) {
      result = result.filter((u) => u.role === roleFilter);
    }
  
    return result;
  }, [search, roleFilter, users]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`/users/${userId}/role`, { role: newRole });
      
      // Update the user directly in state without refetching all users
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      
      setMessage('✅ تم تحديث الصلاحية بنجاح');
      // Reset message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ فشل في تحديث الدور');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await axios.patch(`/users/${userId}/status`, { status: newStatus });
  
      // Update user status directly in state
      setUsers(prev =>
        prev.map(user =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
  
      setMessage('✅ تم تحديث الحالة');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ فشل في تحديث الحالة');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteUser = async (userId) => {
  const result = await MySwal.fire({
    title: 'هل أنت متأكد؟',
    text: 'لا يمكن التراجع عن هذا الإجراء!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'نعم، احذفه!',
    cancelButtonText: 'إلغاء'
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`/users/${userId}`);
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      setMessage('✅ تم حذف المستخدم بنجاح');

      MySwal.fire('تم الحذف!', 'تم حذف المستخدم بنجاح.', 'success');
    } catch (err) {
      MySwal.fire('خطأ', 'فشل في حذف المستخدم', 'error');
    }
  }
};

  
  return (
    <div className="p-6" dir="rtl">
      <h1 className="text-xl font-bold flex items-center gap-2 text-blue-700 mb-4">
        <UserCog size={20} />
        إدارة المستخدمين
      </h1>

      <p className="text-sm mb-2 text-gray-600">
        عدد المستخدمين: <strong>{filteredUsers.length}</strong>
      </p>

      {message && (
  <div
    className={`mb-4 flex justify-center items-center gap-2 text-sm font-medium ${
      message.includes('✅') ? 'text-green-600' : 'text-red-600'
    }`}
  >
    {message.includes('✅') ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
    <span>{message.replace('✅', '').replace('❌', '')}</span>
  </div>
)}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="بحث بالاسم..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border px-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="بحث بالاسم"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
        </div>

        <div className="relative w-full md:w-1/3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full border px-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="تصفية حسب الدور"
          >
            <option value="">كل الأدوار</option>
            <option value="admin">مدير</option>
            <option value="sales">مندوب مبيعات</option>
            <option value="lawyer">محامي</option>
            <option value="accountant">محاسب</option>
            <option value="viewer">مشاهد فقط</option>
            <option value="user">مستخدم</option>
          </select>
          <Filter className="absolute right-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 flex justify-center items-center gap-2">
          <Loader2 className="animate-spin" />
          جاري تحميل المستخدمين...
        </div>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full table-auto border">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-2 border">الاسم</th>
                <th className="p-2 border">البريد الإلكتروني</th>
                <th className="p-2 border">الصلاحية</th>
                <th className="p-2 border">الحالة</th>
                <th className="p-2 border">تاريخ الإنشاء</th>
                <th className="p-2 border">إجراء</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {filteredUsers.map(user => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="border rounded px-2 py-1"
                      aria-label="تغيير دور المستخدم"
                    >
                      <option value="admin">مدير</option>
                      <option value="sales">مندوب مبيعات</option>
                      <option value="lawyer">محامي</option>
                      <option value="accountant">محاسب</option>
                      <option value="viewer">مشاهد فقط</option>
                      <option value="user">مستخدم</option>
                    </select>
                  </td>
                  <td className="p-2 border text-center">
                    <div className="flex items-center justify-center gap-2 group relative">
                      <button
                        onClick={() => handleStatusToggle(user._id, user.status)}
                        className="text-blue-600 hover:scale-105 transition"
                        title={user.status === 'active' ? 'إلغاء تفعيل المستخدم' : 'تفعيل المستخدم'}
                        aria-label={user.status === 'active' ? 'إلغاء تفعيل المستخدم' : 'تفعيل المستخدم'}
                      >
                        {user.status === 'active' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                      <span
                        className={`text-xs font-semibold ${
                          user.status === 'active' ? 'text-green-600' : 'text-red-500'
                        }`}
                      >
                        {user.status === 'active' ? 'نشط' : 'مغلق'}
                      </span>

                      {/* Tooltip */}
                      <div className="absolute hidden bottom-full mb-1 group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 shadow">
                        {user.status === 'active' ? 'اضغط لإلغاء التفعيل' : 'اضغط لتفعيل المستخدم'}
                      </div>
                    </div>
                  </td>

                  <td className="p-2 border">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 border text-center">
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteUser(user._id)}
                      title="حذف المستخدم"
                      aria-label="حذف المستخدم"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    لا يوجد مستخدمين مطابقين للبحث
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

export default Users;