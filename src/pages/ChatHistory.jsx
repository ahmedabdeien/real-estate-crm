import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const ChatHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`/chat/history/${userId}`);
        setHistory(res.data);
      } catch (err) {
        console.error('فشل تحميل المحادثات', err);
      }
    };

    fetchHistory();
  }, [userId]);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-blue-600 dark:text-white">تاريخ المحادثات</h2>
      {history.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">لا توجد محادثات محفوظة.</p>
      ) : (
        history.map((chat, index) => (
          <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-2">
            <p><strong>السؤال:</strong> {chat.message}</p>
            <p><strong>الرد:</strong> {chat.reply}</p>
            <p className="text-sm text-gray-500">📅 {new Date(chat.date).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatHistory;
