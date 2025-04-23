import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { BotMessageSquare, SendHorizonal, Loader2, Paperclip, X, Volume2, Trash2, Download, Copy } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useAIStore from '../store/useAIStore';
import useThemeStore from '../store/useThemeStore';
import { toast } from 'react-toastify';

const ChatWithAI = () => {
  // Store states
  const { userId, user } = useAuthStore();
  const { setAICommand } = useAIStore();
  const { theme } = useThemeStore();
  
  // Local states
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [listening, setListening] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);
  
  // Refs
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);
  
  // Effect: Load previous conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const storedConversations = localStorage.getItem(`ai_chat_${userId}`);
        if (storedConversations) {
          setConversations(JSON.parse(storedConversations));
        } else {
          // Optional: Add welcome message on first visit
          setConversations([{ 
            role: 'assistant', 
            content: `مرحباً ${user?.name || ''}! كيف يمكنني مساعدتك اليوم؟`,
            timestamp: new Date().toISOString()
          }]);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    };
    
    if (userId) {
      loadConversations();
    }
  }, [userId, user]);
  
  // Effect: Save conversations to localStorage
  useEffect(() => {
    if (userId && conversations.length > 0) {
      localStorage.setItem(`ai_chat_${userId}`, JSON.stringify(conversations));
    }
  }, [conversations, userId]);

  // Effect: Scroll to bottom when conversations change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);
  
  // Effect: Setup speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'ar-SA'; // Arabic language
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
          
        setMessage(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);
  
  // Text-to-speech for assistant messages
  const speakText = useCallback((text) => {
    if (synthesisRef.current && textToSpeech) {
      synthesisRef.current.cancel(); // Stop any current speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA'; // Arabic language
      utterance.rate = 1.0;
      
      // Find an Arabic voice if available
      const voices = synthesisRef.current.getVoices();
      const arabicVoice = voices.find(voice => voice.lang.includes('ar'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }
      
      synthesisRef.current.speak(utterance);
    }
  }, [textToSpeech]);
  
  // Handle new assistant message with speech synthesis
  useEffect(() => {
    const lastMessage = conversations[conversations.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.isAction && !lastMessage.isError) {
      speakText(lastMessage.content);
    }
  }, [conversations, speakText]);

  const toggleSpeechRecognition = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        toast.error('فشل في تشغيل التعرف على الصوت. الرجاء المحاولة مرة أخرى.');
      }
    }
  };
  
  const toggleTextToSpeech = () => {
    setTextToSpeech(prev => !prev);
  };

  const handleSend = async () => {
    if (!message.trim() && !attachment) return;

    // Add user message to conversation with timestamp
    const userMessage = message;
    const userMessageObj = { 
      role: 'user', 
      content: userMessage, 
      attachment: attachment?.name,
      timestamp: new Date().toISOString()
    };
    
    setConversations(prev => [...prev, userMessageObj]);
    setLoading(true);
    setMessage('');
    
    // Prepare form data if there's an attachment
    const formData = new FormData();
    formData.append('message', userMessage);
    formData.append('userId', userId);
    
    if (attachment) {
      formData.append('file', attachment);
      setAttachment(null);
    }

    try {
      const res = await axios.post('/chat/ask', 
        attachment ? formData : { message: userMessage, userId },
        attachment ? { headers: { 'Content-Type': 'multipart/form-data' }} : {}
      );

      if (res.data.type === 'action') {
        const payload = res.data.payload;

        // Special handling for search_contracts
        if (payload.action === 'search_contracts') {
          setAICommand(payload);
          setConversations(prev => [...prev, { 
            role: 'assistant', 
            content: `جاري البحث عن عقود ${payload.data.customerName}`,
            timestamp: new Date().toISOString()
          }]);
        }
        
        // Add AI action message to chat
        setConversations(prev => [...prev, { 
          role: 'assistant', 
          content: `تم التعرف على إجراء: ${payload.action || 'توجيه'}`,
          isAction: true,
          actionData: payload,
          timestamp: new Date().toISOString()
        }]);

        // Handle different actions
        if (payload.navigate) {
          setTimeout(() => navigate(payload.navigate), 1000);
        } else if (payload.action === 'add_contract') {
          console.log('🔧 مطلوب تنفيذ إضافة عقد:', payload.data);
          setTimeout(() => {
            toast.info('تم التعرف على أمر إضافة عقد وجاري التنفيذ');
          }, 500);
        }
      } else {
        // Add AI response to chat
        setConversations(prev => [...prev, { 
          role: 'assistant', 
          content: res.data.message,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('AI Error:', error);
      setConversations(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ حدث خطأ في التواصل مع المساعد الذكي',
        isError: true,
        timestamp: new Date().toISOString()
      }]);
      toast.error('فشل في الاتصال بالمساعد الذكي');
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
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('حجم الملف كبير جداً. الحد الأقصى هو 10 ميجابايت.');
        return;
      }
      setAttachment(file);
      toast.info(`تم إرفاق الملف: ${file.name}`);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const clearConversations = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف جميع المحادثات؟')) {
      setConversations([]);
      localStorage.removeItem(`ai_chat_${userId}`);
      toast.success('تم مسح المحادثات بنجاح');
    }
  };
  
  const copyConversation = () => {
    const conversationText = conversations
      .map(msg => `${msg.role === 'user' ? 'أنت: ' : 'المساعد: '}${msg.content}`)
      .join('\n\n');
      
    navigator.clipboard.writeText(conversationText)
      .then(() => toast.success('تم نسخ المحادثة إلى الحافظة'))
      .catch(() => toast.error('فشل في نسخ المحادثة'));
  };
  
  const exportConversation = () => {
    const conversationText = conversations
      .map(msg => `${msg.role === 'user' ? 'أنت: ' : 'المساعد: '}${msg.content}`)
      .join('\n\n');
      
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `محادثة-المساعد-${new Date().toLocaleDateString('ar-SA')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className=" mx-auto bg-white dark:bg-gray-900 h-full shadow-md">
      {/* Chat header */}
      <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2 text-blue-600 dark:text-white">
          <BotMessageSquare size={22} />
          تحدث مع المساعد الذكي
        </h2>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTextToSpeech}
            className={`p-2 rounded-lg ${
              textToSpeech 
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
            title={textToSpeech ? "إيقاف قراءة الردود" : "قراءة الردود صوتياً"}
          >
            <Volume2 size={18} />
          </button>
          
          <button 
            onClick={copyConversation}
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
            title="نسخ المحادثة"
          >
            <Copy size={18} />
          </button>
          
          <button 
            onClick={exportConversation}
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
            title="تصدير المحادثة"
          >
            <Download size={18} />
          </button>
          
          <button 
            onClick={clearConversations}
            className="p-2 bg-gray-100 hover:bg-red-100 dark:bg-gray-800 dark:hover:bg-red-900/30 rounded-lg text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            title="مسح المحادثة"
          >
            <Trash2 size={18} />
          </button>
        </div>
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
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-left">
                  {formatTime(msg.timestamp)}
                </div>
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
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب سؤالك هنا..."
            className="flex-1 p-3 border dark:border-gray-700 rounded-lg resize-none dark:bg-gray-800 dark:text-white min-h-12 max-h-32"
          />
          
          <div className="flex flex-col gap-2">
            <button
              onClick={toggleSpeechRecognition}
              className={`p-2 rounded-lg ${
                listening 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 animate-pulse' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
              title={listening ? "إيقاف التسجيل" : "التحدث بدلاً من الكتابة"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>
            
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
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />
        </div>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          يمكنك الضغط على Enter للإرسال أو Shift+Enter لإضافة سطر جديد
        </div>
      </div>
    </div>
  );
};

export default ChatWithAI;