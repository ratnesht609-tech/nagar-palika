import React from 'react';
import { DraftType } from '../types';
import { DRAFT_TYPES } from '../constants/phrases';
import { FileText, Scroll, ClipboardList, BookOpen, Send, Sparkles, MessageSquare, FileUp, Landmark, ShieldCheck } from 'lucide-react';

interface Props {
  onSelect: (type: DraftType) => void;
  onAIStart: () => void;
  onChatStart: () => void;
}

const ICONS = {
  [DraftType.LETTER]: Send,
  [DraftType.ORDER]: FileText,
  [DraftType.MEMO]: ClipboardList,
  [DraftType.NOTE_SHEET]: Scroll,
  [DraftType.PROPOSAL]: BookOpen,
};

export const DraftSelector: React.FC<Props> = ({ onSelect, onAIStart, onChatStart }) => {
  return (
    <div className="max-w-5xl mx-auto p-4 animate-fade-in">
      <div className="flex flex-col items-center justify-center gap-2 mb-2">
        <Landmark className="text-indigo-900" size={48} />
        <h1 className="text-4xl font-bold text-slate-800 font-serif-hindi">नगर पालिका सचिवालय</h1>
      </div>
      <p className="text-center text-slate-500 mb-10 text-lg">पालिका प्रशासन एवं विधिक सहायता केंद्र (उ.प्र. नगर पालिका अधिनियम, 1916)</p>
      
      {/* AI Feature Banner */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-950 to-indigo-800 rounded-3xl p-8 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden group border-b-8 border-yellow-500">
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-4">
               <span className="bg-yellow-400 text-indigo-950 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest">ADVANCED AI</span>
               <h2 className="text-2xl font-bold font-serif-hindi">सचिवालय ड्राफ्टिंग (Auto)</h2>
             </div>
             <p className="text-indigo-200 text-md mb-6 leading-relaxed">
               किसी भी संदर्भ पत्र या PDF को अपलोड करें। एआई 1916 अधिनियम के विधिक प्रावधानों के अनुसार त्वरित प्रारूप तैयार करेगा।
             </p>
          </div>
          <button 
            onClick={onAIStart}
            className="relative z-10 bg-white text-indigo-950 hover:bg-yellow-400 px-8 py-4 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center gap-3 w-fit active:scale-95"
          >
            <FileUp size={24} />
            दस्तावेज़ अपलोड करें
          </button>
          <Sparkles className="absolute -right-8 -bottom-8 text-white/5 w-48 h-48 group-hover:rotate-12 transition-transform" />
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden group border-b-8 border-indigo-500">
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-4">
               <span className="bg-white/10 text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/20 flex items-center gap-1">
                 <ShieldCheck size={12} /> LEGAL ADVISOR
               </span>
               <h2 className="text-2xl font-bold font-serif-hindi">विधिक एवं सचिवालय सलाहकार</h2>
             </div>
             <p className="text-slate-400 text-md mb-6 leading-relaxed">
               उ.प्र. नगर पालिका अधिनियम, टेंडर प्रक्रिया, राजस्व वसूली एवं सेवा संबंधी नियमों पर विधिक परामर्श प्राप्त करें।
             </p>
          </div>
          <button 
            onClick={onChatStart}
            className="relative z-10 bg-indigo-600 text-white hover:bg-indigo-500 px-8 py-4 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center gap-3 w-fit active:scale-95"
          >
            <MessageSquare size={24} />
            सलाहकार से चर्चा करें
          </button>
          <div className="absolute -right-8 -bottom-8 text-white/5 w-48 h-48 group-hover:-rotate-12 transition-transform">
             <Landmark size={192} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-lg font-black text-slate-400 uppercase tracking-[0.2em]">मानक सचिवालय प्रारूप (Templates)</h3>
        <div className="h-px flex-1 bg-slate-200"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DRAFT_TYPES.map((dt) => {
          const Icon = ICONS[dt.id as DraftType];
          return (
            <button
              key={dt.id}
              onClick={() => onSelect(dt.id as DraftType)}
              className="flex flex-col items-start p-8 bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all border border-slate-100 group text-left relative overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-slate-50 text-slate-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 font-serif-hindi">{dt.label}</h3>
              <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">{dt.desc}</p>
              
              <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Send className="text-indigo-200" size={48} />
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-12 p-8 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-start gap-6 shadow-inner">
        <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
           <Landmark size={32} />
        </div>
        <div>
          <p className="font-black text-indigo-900 uppercase tracking-widest text-sm mb-2">विधिक अनुदेश (Legal Instruction):</p>
          <p className="text-indigo-700/80 leading-relaxed font-medium italic">"यह प्रणाली उत्तर प्रदेश नगर पालिका अधिनियम, 1916 एवं समय-समय पर जारी शासनादेशों के विधिक परामर्श पर आधारित है। प्रारूपों का उपयोग करने से पूर्व सक्षम विधिक अधिकारी का अभिमत प्राप्त करना श्रेयस्कर है।"</p>
        </div>
      </div>
    </div>
  );
};