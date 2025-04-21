// src/pages/ChatHistory.jsx
import useChatStore from '../store/useChatStore';
import { Bot, UserCircle2, Trash2 } from 'lucide-react';

const ChatHistory = () => {
  const { messages = [], clearMessages } = useChatStore();

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow rounded-xl text-right">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          🗂️ تاريخ المحادثات
        </h2>
        <button
          onClick={clearMessages}
          className="flex items-center gap-1 text-sm bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded"
        >
          <Trash2 size={16} />
          حذف الكل
        </button>
      </div>

      {messages.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">لا توجد محادثات محفوظة.</p>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs text-sm whitespace-pre-wrap ${
                  msg.from === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white rounded-bl-none'
                }`}
              >
                <div className="flex items-center gap-1 mb-1 text-xs text-gray-300">
                  {msg.from === 'user' ? (
                    <UserCircle2 size={14} />
                  ) : (
                    <Bot size={14} />
                  )}
                  {msg.from === 'user' ? 'أنت' : 'المساعد'}
                </div>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
