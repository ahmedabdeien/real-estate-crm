import React, { useState, useRef, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { BotMessageSquare, SendHorizonal, Loader2, Paperclip, X } from 'lucide-react';

const ChatWithAI = () => {
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scroll to bottom when conversations change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  const handleSend = async () => {
    if (!message.trim() && !attachment) return;

    // Add user message to conversation
    const userMessage = message;
    setConversations(prev => [...prev, { role: 'user', content: userMessage, attachment: attachment?.name }]);
    
    setLoading(true);
    setMessage('');
    
    // Prepare form data if there's an attachment
    const formData = new FormData();
    formData.append('message', userMessage);
    if (attachment) {
      formData.append('file', attachment);
      setAttachment(null);
    }

    try {
      const res = await axios.post('/chat/ask', 
        attachment ? formData : { message: userMessage },
        attachment ? { headers: { 'Content-Type': 'multipart/form-data' }} : {}
      );

      if (res.data.type === 'action') {
        const payload = res.data.payload;

        // Add AI action message to chat
        setConversations(prev => [...prev, { 
          role: 'assistant', 
          content: `تم التعرف على إجراء: ${payload.action || 'توجيه'}`,
          isAction: true
        }]);

        // Handle different actions
        if (payload.navigate) {
          setTimeout(() => navigate(payload.navigate), 1000);
        } else if (payload.action === 'add_contract') {
          console.log('🔧 مطلوب تنفيذ إضافة عقد:', payload.data);
          // Implement your contract logic here
          setTimeout(() => {
            alert('تم التعرف على أمر إضافة عقد وجاري التنفيذ');
            // openModal(payload.data);
          }, 500);
        } else {
          setTimeout(() => {
            alert('تم التعرف على إجراء غير مفعّل بعد');
          }, 500);
        }
      } else {
        // Add AI response to chat
        setConversations(prev => [...prev, { role: 'assistant', content: res.data.message }]);
      }
    } catch (error) {
      console.error('AI Error:', error);
      setConversations(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ حدث خطأ في التواصل مع المساعد الذكي',
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachment = (e) => {
    if (e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md">
      {/* Chat header */}
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold flex items-center gap-2 text-blue-600 dark:text-white">
          <BotMessageSquare size={22} />
          تحدث مع المساعد الذكي
        </h2>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversations.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            ابدأ محادثة مع المساعد الذكي
          </div>
        ) : (
          conversations.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-3/4 p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100' 
                    : msg.isError 
                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                      : msg.isAction
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.attachment && (
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Paperclip size={12} className="mr-1" />
                    {msg.attachment}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-center">
              <Loader2 size={18} className="animate-spin text-blue-600 dark:text-blue-400" />
              <span className="mr-2 text-gray-700 dark:text-gray-300">جاري التفكير...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t dark:border-gray-700">
        {attachment && (
          <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Paperclip size={14} className="mr-1" />
              {attachment.name}
            </div>
            <button 
              onClick={removeAttachment}
              className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            >
              <X size={16} />
            </button>
          </div>
        )}
        
        <div className="flex items-end gap-2">
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب سؤالك هنا..."
            className="flex-1 p-3 border dark:border-gray-700 rounded-lg resize-none dark:bg-gray-800 dark:text-white"
          />
          
          <div className="flex flex-col gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
              title="إرفاق ملف"
            >
              <Paperclip size={20} />
            </button>
            
            <button
              onClick={handleSend}
              disabled={loading}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
              title="إرسال"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <SendHorizonal size={20} />}
            </button>
          </div>
          
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleAttachment}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWithAI;