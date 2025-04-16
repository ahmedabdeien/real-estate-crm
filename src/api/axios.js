// src/api/axios.js
import axios from 'axios';
import { EncryptStorage } from 'encrypt-storage';

const encryptStorage = new EncryptStorage('🔒secret-key-123', {
  storageType: 'localStorage',
});

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Interceptor: يضيف التوكن تلقائيًا من التخزين المشفر
instance.interceptors.request.use((config) => {
  try {
    const auth = encryptStorage.getItem('auth-storage'); // ✅ قراءة مباشرة من encrypt-storage
    const token = auth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ لا يوجد توكن!');
    }
  } catch (err) {
    console.warn('❌ فشل في قراءة التوكن:', err.message);
  }

  return config;
}, (error) => Promise.reject(error));

// ✅ دالة لتحديث التوكن يدويًا لو حبيت
export const setAxiosToken = (newToken) => {
  try {
    const auth = encryptStorage.getItem('auth-storage');
    if (auth) {
      auth.token = newToken;
      encryptStorage.setItem('auth-storage', auth);
    }
  } catch (err) {
    console.warn('❌ فشل في تحديث التوكن:', err.message);
  }
};

export default instance;
