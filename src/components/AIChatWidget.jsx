// 📁 src/components/AIChatWidget.jsx
import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

import useSidebarStore from '../store/sidebarStore';

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { collapsed } = useSidebarStore();
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);
  
    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const botMessage = { sender: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'حدث خطأ أثناء جلب الرد.' }]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`fixed bottom-20 right-4 xl:bottom-4 ${collapsed? " xl:-translate-x-20" :"xl:-translate-x-[17rem] "} transition-transform duration-300 xl:right-0 z-50`}>
      {/* زر فتح/غلق الشات */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-xl"
        >
          <MessageCircle size={24} />
        </button>
      ) : (
        <div className="bg-white border rounded-lg shadow-xl w-80 h-[400px] flex flex-col">
          {/* رأس الشات */}
          <div className="flex items-center justify-between p-2 bg-blue-600 text-white rounded-t-lg">
            <span className="font-semibold text-sm">مساعد العقارات الذكي</span>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* الرسائل */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-md max-w-[85%] ${
                  msg.sender === 'user'
                    ? 'bg-blue-100 self-end ml-auto'
                    : 'bg-gray-100 self-start mr-auto'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <p className="text-center text-xs text-gray-500">جاري التحميل...</p>}
          </div>

          {/* إدخال المستخدم */}
          <div className="flex border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اسأل أي شيء عن النظام..."
              className="flex-1 px-2 py-2 text-sm outline-none"
            />
            <button onClick={handleSend} className="text-blue-600 px-2">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatWidget;
