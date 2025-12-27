
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Briefcase, X, Loader2, Landmark, Gavel } from 'lucide-react';
import { createExpertChatSession } from '../services/gemini';
import { Chat, GenerateContentResponse } from '@google/genai';

interface Props {
  onBack: () => void;
}

interface Message {
  id: number;
  role: 'user' | 'model';
  text: string;
}

// Renders message text, parsing out and styling the legal section block.
const renderMessageText = (text: string) => {
  const dharaBlockRegex = /(>\s*\*\*प्रासंगिक धारा[\s\S]*)/;
  const match = text.match(dharaBlockRegex);

  if (!match) {
    return <p className="whitespace-pre-wrap leading-relaxed">{text}</p>;
  }

  const normalText = text.substring(0, match.index).trim();
  let dharaText = match[0].trim();
  
  // Remove the markdown blockquote '>' from each line
  dharaText = dharaText.split('\n').map(line => line.replace(/^>\s?/, '')).join('\n');

  return (
    <>
      {normalText && <p className="whitespace-pre-wrap leading-relaxed mb-4">{normalText}</p>}
      <div className="bg-slate-100/80 border-l-4 border-indigo-500 p-4 rounded-lg my-2 text-slate-700">
        <div className="flex items-center gap-2 mb-2">
            <Gavel size={18} className="text-indigo-600" />
            <h4 className="font-bold text-sm text-indigo-800 font-sans">प्रासंगिक विधिक प्रावधान (Relevant Legal Provision)</h4>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{dharaText}</p>
      </div>
    </>
  );
};


export const ExpertChat: React.FC<Props> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      role: 'model', 
      text: 'सादर अभिवादन। मैं आपका "मुख्य सचिवालय एवं विधि सलाहकार" हूँ। उत्तर प्रदेश नगर पालिका अधिनियम, 1916, सेवा नियमावली, टेंडर प्रक्रिया अथवा विधिक जटिलताओं के समाधान हेतु आप मुझसे परामर्श प्राप्त कर सकते हैं। कृपया अपनी जिज्ञासा व्यक्त करें।' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSession.current = createExpertChatSession();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession.current) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result: GenerateContentResponse = await chatSession.current.sendMessage({ message: userMsg.text });
      const botMsg: Message = { id: Date.now() + 1, role: 'model', text: result.text || 'क्षमा करें, मैं अपेक्षित प्रतिक्रिया प्राप्त नहीं कर सका।' };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = { id: Date.now() + 1, role: 'model', text: 'विधिक सर्वर पर लोड होने के कारण प्रतिक्रिया में देरी हो रही है, कृपया पुनः प्रयास करें।' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-120px)] flex flex-col animate-fade-in">
      <div className="bg-indigo-900 rounded-t-[2rem] shadow-2xl p-6 flex justify-between items-center text-white border-b-4 border-yellow-500">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
             <Gavel className="text-yellow-400" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif-hindi">विधिक एवं सचिवालय सलाहकार</h2>
            <p className="text-xs text-indigo-300 font-medium uppercase tracking-widest">Legal & Secretariat Advisor (UP Municipalities Act 1916)</p>
          </div>
        </div>
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={28} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 bg-white overflow-y-auto p-6 space-y-6 shadow-inner border-x border-slate-100">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-[1.5rem] p-5 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-100' 
                : 'bg-slate-50 text-slate-800 rounded-bl-none border border-slate-100 font-serif-hindi text-lg'
            }`}>
              {msg.role === 'model' && (
                <div className="text-[10px] font-black text-indigo-600 mb-2 opacity-50 uppercase tracking-tighter">
                  सचिवालय सलाहकार:
                </div>
              )}
              {msg.role === 'model' ? renderMessageText(msg.text) : <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span className="text-sm text-slate-500 font-serif-hindi">विधिक संदर्भ खोजे जा रहे हैं...</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-b-[2rem] shadow-2xl border-t border-slate-100">
        <div className="flex gap-3">
          <input 
            type="text" 
            className="flex-1 bg-slate-100 border-none rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-serif-hindi text-lg"
            placeholder="विधिक नियम या प्रक्रिया दर्ज करें..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 text-white px-8 rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg active:scale-95"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
