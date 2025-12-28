

import React from 'react';
import { DraftType } from '../types';
import { DRAFT_TYPES } from '../constants/phrases';
import { FileText, Scroll, ClipboardList, BookOpen, Send, Sparkles, MessageSquare, FileUp, Landmark, ShieldCheck, PenTool, Megaphone, ReceiptText, FileWarning, ShieldQuestion, Wand2 } from 'lucide-react';

interface Props {
  onSelect: (type: DraftType) => void;
  onAIStart: () => void;
  onChatStart: () => void;
  onPromptStart: () => void;
  onRTIStart: () => void;
}

const ICONS = {
  [DraftType.LETTER]: Send,
  [DraftType.ORDER]: FileText,
  [DraftType.MEMO]: ClipboardList,
  [DraftType.NOTE_SHEET]: Scroll,
  [DraftType.PROPOSAL]: BookOpen,
  [DraftType.PRAKASHAN]: Megaphone,
  [DraftType.HOUSE_TAX]: ReceiptText,
  [DraftType.DEMAND_NOTICE]: FileWarning,
};

export const DraftSelector: React.FC<Props> = ({ onSelect, onAIStart, onChatStart, onPromptStart, onRTIStart }) => {
  return (
    <div className="max-w-6xl mx-auto p-4 animate-fade-in">
      <div className="flex flex-col items-center justify-center gap-2 mb-2">
        <Landmark className="text-indigo-900" size={48} />
        <h1 className="text-4xl font-bold text-slate-800 font-serif-hindi text-center">नगर पालिका सचिवालय</h1>
      </div>
      <p className="text-center text-slate-500 mb-10 text-lg">पालिका प्रशासन एवं विधिक सहायता केंद्र (उ.प्र. नगर पालिका अधिनियम, 1916)</p>
      
      {/* AI Feature Banners */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-950 to-indigo-800 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden group border-b-4 border-yellow-500">
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-3">
               <span className="bg-yellow-400 text-indigo-950 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">VISION AI</span>
               <h2 className="text-xl font-bold font-serif-hindi">दस्तावेज़ स्कैन</h2>
             </div>
             <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
               PDF या फोटो अपलोड करें, AI विधिक प्रावधानों सहित प्रारूप तैयार करेगा।
             </p>
          </div>
          <button 
            onClick={onAIStart}
            className="relative z-10 bg-white text-indigo-950 hover:bg-yellow-400 px-6 py-3 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center gap-2 w-fit active:scale-95"
          >
            <FileUp size={18} />
            अपलोड करें
          </button>
          <Sparkles className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 group-hover:rotate-12 transition-transform" />
        </div>
        
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden group border-b-4 border-blue-400">
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-3">
               <span className="bg-white text-blue-900 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">PROMPT AI</span>
               <h2 className="text-xl font-bold font-serif-hindi">विवरण से ड्राफ्ट</h2>
             </div>
             <p className="text-blue-200 text-sm mb-6 leading-relaxed">
              केवल विवरण लिखें, AI स्वतः ही एक सम्पूर्ण शासकीय पत्र तैयार कर देगा।
             </p>
          </div>
          <button 
            onClick={onPromptStart}
            className="relative z-10 bg-white text-blue-900 hover:bg-blue-100 px-6 py-3 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center gap-2 w-fit active:scale-95"
          >
            <Wand2 size={18} />
            लिखना शुरू करें
          </button>
          <PenTool className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 group-hover:rotate-12 transition-transform" />
        </div>

        {/* NEW: RTI Expert */}
        <div className="bg-gradient-to-br from-red-900 to-red-700 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden group border-b-4 border-red-400">
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-3">
               <span className="bg-white text-red-900 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">RTI ACT, 2005</span>
               <h2 className="text-xl font-bold font-serif-hindi">RTI विशेषज्ञ</h2>
             </div>
             <p className="text-red-200 text-sm mb-6 leading-relaxed">
              RTI आवेदन का विश्लेषण करें और कानूनी बचाव हेतु सही धाराएं एवं उत्तर प्राप्त करें।
             </p>
          </div>
          <button 
            onClick={onRTIStart}
            className="relative z-10 bg-white text-red-900 hover:bg-red-100 px-6 py-3 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center gap-2 w-fit active:scale-95"
          >
            <ShieldQuestion size={18} />
            विश्लेषण करें
          </button>
          <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 group-hover:-rotate-12 transition-transform" />
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden group border-b-4 border-slate-500">
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-3">
               <span className="bg-white/10 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest border border-white/20 flex items-center gap-1">
                 <ShieldCheck size={10} /> LEGAL
               </span>
               <h2 className="text-xl font-bold font-serif-hindi">विधिक सलाहकार</h2>
             </div>
             <p className="text-slate-400 text-sm mb-6 leading-relaxed">
               टेंडर, राजस्व एवं सेवा नियमों पर विधिक परामर्श प्राप्त करें।
             </p>
          </div>
          <button 
            onClick={onChatStart}
            className="relative z-10 bg-slate-700 text-white hover:bg-slate-600 px-6 py-3 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center gap-2 w-fit active:scale-95"
          >
            <MessageSquare size={18} />
            चर्चा करें
          </button>
          <div className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 group-hover:-rotate-6 transition-transform">
             <Landmark size={128} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-lg font-black text-slate-400 uppercase tracking-[0.2em] text-sm">मानक प्रारूप (Templates)</h3>
        <div className="h-px flex-1 bg-slate-200"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {DRAFT_TYPES.map((dt) => {
          const Icon = ICONS[dt.id as DraftType];
          return (
            <button
              key={dt.id}
              onClick={() => onSelect(dt.id as DraftType)}
              className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border border-slate-100 group text-center relative overflow-hidden"
            >
              <div className="p-3 rounded-xl bg-slate-50 text-slate-400 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {Icon && <Icon size={24} />}
              </div>
              <h3 className="text-lg font-bold text-slate-800 font-serif-hindi">{dt.label}</h3>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{dt.desc}</p>
            </button>
          );
        })}
      </div>
      
      <div className="mt-12 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex items-start gap-4">
        <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600 shrink-0">
           <Landmark size={24} />
        </div>
        <div>
          <p className="font-black text-indigo-900 uppercase tracking-widest text-[10px] mb-1">विधिक अनुदेश (Legal Instruction):</p>
          <p className="text-indigo-700/80 text-xs leading-relaxed font-medium italic">"यह प्रणाली उत्तर प्रदेश नगर पालिका अधिनियम, 1916 एवं सूचना का अधिकार अधिनियम, 2005 के विधिक परामर्श पर आधारित है। एआई द्वारा जनरेट किए गए प्रारूपों एवं सलाह का विधिक सत्यापन अनिवार्य है।"</p>
        </div>
      </div>
    </div>
  );
};