import React, { useState, useRef } from 'react';
import { Camera, Sparkles, X, Wand2, Loader2, SendHorizontal, AlertCircle, FileText, UploadCloud } from 'lucide-react';
import { generateFullDraftWithAI } from '../services/gemini';
import { DraftType, FormData } from '../types';

interface Props {
  onDraftGenerated: (type: DraftType, data: FormData, directToPreview?: boolean) => void;
  onCancel: () => void;
}

interface FileData {
  base64: string;
  mimeType: string;
  name: string;
}

export const AIAnalyzer: React.FC<Props> = ({ onDraftGenerated, onCancel }) => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [userPrompt, setUserPrompt] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const mimeType = file.type;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const res = ev.target.result as string;
          const base64 = res.split(',')[1];
          setFileData({
            base64,
            mimeType,
            name: file.name
          });
          // Focus the prompt area after upload
          setTimeout(() => {
            const el = document.getElementById('magic-prompt');
            el?.focus();
          }, 100);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMagicDraft = async () => {
    if (!fileData) return;
    if (!userPrompt.trim()) {
      alert("कृपया बताएं कि क्या ड्राफ्ट करना है। (Please tell me what to draft)");
      return;
    }

    setLoading(true);
    setStatus('AI दस्तावेज़ पढ़ रहा है और पत्र तैयार कर रहा है... (AI Generating Letter)');
    try {
      const { type, data } = await generateFullDraftWithAI(fileData.base64, userPrompt, fileData.mimeType);
      // Skip the form and go straight to the ready-to-print preview
      onDraftGenerated(type, data, true);
    } catch (error) {
      console.error(error);
      alert("त्रुटि: AI ड्राफ्ट नहीं बना सका। कृपया निर्देश स्पष्ट लिखें।");
    } finally {
      setLoading(false);
    }
  };

  const isPdf = fileData?.mimeType === 'application/pdf';

  return (
    <div className="max-w-6xl mx-auto p-4 animate-fade-in pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold font-serif-hindi flex items-center gap-3 text-indigo-900">
            <Sparkles className="text-yellow-500 animate-pulse" /> जादुई एआई ड्राफ्टर
          </h2>
          <p className="text-slate-500 text-sm mt-1">फोटो या PDF अपलोड करें और निर्देश दें - एआई खुद पत्र तैयार करेगा।</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
          <X size={28} />
        </button>
      </div>

      {!fileData ? (
        <div 
          className="bg-white border-4 border-dashed border-indigo-200 rounded-[2rem] p-20 text-center hover:bg-indigo-50/50 transition-all cursor-pointer shadow-xl group relative overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            accept="image/*,application/pdf" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <div className="relative z-10">
            <div className="w-32 h-32 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-indigo-200 shadow-2xl">
              <UploadCloud size={56} />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-3 font-serif-hindi">फोटो या PDF अपलोड करें</h3>
            <p className="text-slate-500 max-w-sm mx-auto text-lg">
              कैमरा खोलें, गैलरी से पत्र चुनें या PDF फ़ाइल डालें
            </p>
          </div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: File Preview */}
          <div className="lg:w-1/3">
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl sticky top-24">
              <div className="bg-slate-800 p-3 text-xs text-slate-400 flex justify-between items-center px-4 border-b border-slate-700">
                 <span className="font-bold uppercase tracking-wider">{isPdf ? 'PDF दस्तावेज़' : 'संदर्भ पत्र'}</span>
                 <button onClick={() => setFileData(null)} className="text-red-400 hover:text-red-300 font-bold px-2 py-1 rounded">हटाएं (X)</button>
              </div>
              <div className="aspect-[3/4] flex flex-col items-center justify-center bg-slate-950 p-6">
                 {isPdf ? (
                   <div className="text-center space-y-4">
                     <FileText size={80} className="text-red-500 mx-auto" />
                     <p className="text-white font-medium break-all text-sm">{fileData.name}</p>
                     <p className="text-slate-400 text-xs uppercase tracking-widest">PDF Document</p>
                   </div>
                 ) : (
                   <img src={`data:${fileData.mimeType};base64,${fileData.base64}`} alt="Uploaded Letter" className="max-w-full max-h-full object-contain" />
                 )}
              </div>
            </div>
          </div>

          {/* Right: The Generation Command Center */}
          <div className="lg:w-2/3 space-y-6">
             <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
               <div className="bg-indigo-900 p-6 text-white">
                 <div className="flex items-center gap-3">
                   <Wand2 className="text-yellow-400" size={28} />
                   <div>
                     <h3 className="text-xl font-bold font-serif-hindi">आपका निर्देश (AI Instructions)</h3>
                     <p className="text-indigo-200 text-xs">AI को बताएं कि आप क्या चाहते हैं</p>
                   </div>
                 </div>
               </div>
               
               <div className="p-8">
                 <textarea 
                   id="magic-prompt"
                   className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 text-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-0 min-h-[180px] font-serif-hindi transition-all"
                   placeholder="उदा: 'इस पत्र का उत्तर दें और संबंधित विभाग को जांच के निर्देश दें'..."
                   value={userPrompt}
                   onChange={(e) => setUserPrompt(e.target.value)}
                   disabled={loading}
                 />

                 <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                   <div className="flex items-center gap-2 text-slate-500 text-sm italic">
                     <AlertCircle size={16} />
                     एआई सभी विवरण (दिनांक, पत्रांक, पदनाम) खुद भर देगा।
                   </div>
                   
                   <button 
                     onClick={handleMagicDraft}
                     disabled={loading || !userPrompt.trim()}
                     className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-xl shadow-indigo-200 flex items-center justify-center gap-4 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                   >
                     {loading ? (
                       <>
                         <Loader2 className="animate-spin" size={24} />
                         प्रतीक्षा करें...
                       </>
                     ) : (
                       <>
                         जादुई ड्राफ्ट बनाएं
                         <SendHorizontal size={24} />
                       </>
                     )}
                   </button>
                 </div>
               </div>
             </div>

             {loading && (
               <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-indigo-100 flex flex-col items-center animate-pulse">
                 <div className="flex gap-2 mb-4">
                   <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                   <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
                 <p className="text-indigo-900 font-bold font-serif-hindi text-lg text-center px-4">{status}</p>
                 <p className="text-slate-500 text-sm mt-2">वरिष्ठ बाबू जी ड्राफ्ट तैयार कर रहे हैं...</p>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};