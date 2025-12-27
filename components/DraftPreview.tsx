
import React, { useState } from 'react';
import { FormData, DraftType } from '../types';
import { generateDraft } from '../utils/generator';
import { Printer, ArrowLeft, Save, Copy, CheckCircle, Sparkles, SendHorizontal, Loader2, FileText } from 'lucide-react';
import { updateDraftWithAI } from '../services/gemini';

interface Props {
  data: FormData;
  type: DraftType;
  onEdit: () => void;
  onReset: () => void;
  onUpdate: (updatedData: FormData) => void;
}

export const DraftPreview: React.FC<Props> = ({ data, type, onEdit, onReset, onUpdate }) => {
  const [copied, setCopied] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [updating, setUpdating] = useState(false);
  
  const htmlContent = generateDraft(type, data);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const element = document.getElementById('draft-content-inner');
    if (element) {
      // Create a temporary range and selection to copy as formatted text
      const range = document.createRange();
      range.selectNode(element);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Copy failed', err);
        // Fallback for plain text
        navigator.clipboard.writeText(element.innerText);
      }
      
      selection?.removeAllRanges();
    }
  };

  // Fix: Added missing handleRefine function to process AI refinement requests
  const handleRefine = async () => {
    if (!refinePrompt.trim()) return;
    setUpdating(true);
    try {
      const updatedData = await updateDraftWithAI(data, refinePrompt);
      onUpdate(updatedData);
      setRefinePrompt('');
    } catch (error) {
      console.error(error);
      alert("संशोधन विफल रहा। कृपया पुनः प्रयास करें।");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-300 pb-32">
      {/* Toolbar - Professional Dark */}
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-xl no-print">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onEdit} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium">
              <ArrowLeft size={20} /> संपादन
            </button>
            <div className="h-6 w-px bg-slate-700 hidden md:block"></div>
            <h2 className="text-lg font-bold font-serif-hindi hidden md:flex items-center gap-2">
              <FileText size={20} className="text-yellow-500" />
              राजपत्रित प्रारूप पूर्वावलोकन
            </h2>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={handleCopy} className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-all shadow-lg active:scale-95">
               {copied ? <CheckCircle size={18} className="text-green-400"/> : <Copy size={18} />}
               <span className="hidden sm:inline font-bold">{copied ? 'कॉपी हो गया' : 'टेक्स्ट कॉपी करें'}</span>
             </button>
             <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all font-bold shadow-lg shadow-indigo-900/20 active:scale-95">
               <Printer size={18} />
               <span className="hidden sm:inline">प्रिंट / PDF सेव करें</span>
             </button>
             <button onClick={onReset} className="flex items-center gap-2 px-4 py-2 bg-red-900/50 text-red-200 border border-red-900/20 rounded-xl hover:bg-red-800 transition-colors text-sm font-bold">
               नया ड्राफ्ट
             </button>
          </div>
        </div>
      </div>

      {/* A4 Paper Display Container */}
      <div className="flex justify-center p-4 md:p-10 print:p-0">
        <div className="bg-white shadow-[0_0_50px_rgba(0,0,0,0.2)] print:shadow-none w-full max-w-[210mm] transition-all duration-500">
          <div 
            id="draft-content-inner"
            className="print:p-0"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </div>
      </div>

      {/* AI Refinement Panel - Secretariat Style */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-5 no-print shadow-[0_-20px_50px_rgba(0,0,0,0.3)] z-40">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-5">
            <div className="bg-yellow-500 p-3 rounded-2xl text-slate-950 hidden sm:block shadow-lg shadow-yellow-500/20">
              <Sparkles size={24} />
            </div>
            <div className="flex-1 relative">
              <input 
                type="text"
                className="w-full bg-slate-800 border-2 border-slate-700 focus:border-indigo-500 focus:bg-slate-800 text-white rounded-2xl px-6 py-4 pr-20 outline-none transition-all font-serif-hindi text-xl placeholder:text-slate-500"
                placeholder="पत्र में कोई विधिक संशोधन या नया अनुच्छेद जोड़ना है? यहाँ लिखें..."
                value={refinePrompt}
                onChange={(e) => setRefinePrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                disabled={updating}
              />
              <button 
                onClick={handleRefine}
                disabled={updating || !refinePrompt.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-500 disabled:opacity-30 transition-all active:scale-90 shadow-lg shadow-indigo-600/20"
              >
                {updating ? <Loader2 size={24} className="animate-spin" /> : <SendHorizontal size={24} />}
              </button>
            </div>
          </div>
          {updating && (
            <div className="flex justify-center items-center gap-2 mt-3 text-indigo-400 font-bold text-sm tracking-widest animate-pulse font-serif-hindi">
              <Loader2 size={16} className="animate-spin" />
              सचिवालय सलाहकार द्वारा पत्र संशोधित किया जा रहा है...
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-slate-500 text-sm pb-24 no-print mt-6 italic">
         * टिप: प्रिंट सेटिंग में 'Margins: None' और 'Scale: 100%' का चयन करें।
      </div>
    </div>
  );
};
