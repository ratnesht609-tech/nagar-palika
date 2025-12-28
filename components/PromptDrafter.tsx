
import React, { useState } from 'react';
import { Wand2, ArrowLeft, Loader2, SendHorizontal, Sparkles } from 'lucide-react';
import { generateDraftFromTextPrompt } from '../services/gemini';
import { DraftType, FormData } from '../types';

interface Props {
  onDraftGenerated: (type: DraftType, data: FormData, directToPreview?: boolean) => void;
  onCancel: () => void;
}

export const PromptDrafter: React.FC<Props> = ({ onDraftGenerated, onCancel }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const { type, data } = await generateDraftFromTextPrompt(prompt);
      onDraftGenerated(type, data, true);
    } catch (error) {
      console.error(error);
      alert("ड्राफ्ट जनरेट करने में त्रुटि हुई। कृपया स्पष्ट निर्देश लिखें।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in pb-20">
      <div className="flex items-center mb-8">
        <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full mr-4 text-slate-600 transition-colors">
          <ArrowLeft />
        </button>
        <h2 className="text-3xl font-bold font-serif-hindi text-indigo-900 flex items-center gap-3">
          <Wand2 className="text-yellow-500" /> विवरण से ड्राफ्ट
        </h2>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-indigo-900 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold font-serif-hindi mb-2">एआई लेखन सहायक (AI Writer)</h3>
            <p className="text-indigo-200 text-sm">बस एक लाइन में बताएं कि आपको क्या लिखवाना है। एआई पत्रांक, दिनांक और विधिक भाषा खुद जोड़ देगा। सभी पत्र नगर पालिका परिषद, महोबा की ओर से अधिशासी अधिकारी द्वारा जारी किए जाएंगे।</p>
          </div>
          <Sparkles className="absolute -right-8 -top-8 text-white/5 w-48 h-48" />
        </div>

        <div className="p-8">
          <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-4">पत्र का संक्षिप्त विवरण (Description)</label>
          <textarea 
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 text-2xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-0 min-h-[250px] font-serif-hindi transition-all leading-relaxed"
            placeholder="उदा: 'सफाई कर्मचारी के अवकाश स्वीकृति हेतु एक कार्यालय आदेश लिखें' या 'अवैध अतिक्रमण हटाने हेतु चेतावनी पत्र'..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />

          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-slate-500 text-sm italic font-serif-hindi max-w-sm">
              * टिप: एआई उत्तर प्रदेश नगर पालिका अधिनियम, 1916 की आधिकारिक शब्दावली का उपयोग करेगा।
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-xl shadow-indigo-200 flex items-center justify-center gap-4 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  ड्राफ्ट तैयार हो रहा है...
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
        <div className="mt-12 flex flex-col items-center animate-pulse">
           <div className="flex gap-2 mb-4">
             <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
             <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
             <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
           </div>
           <p className="text-indigo-900 font-bold font-serif-hindi text-xl">सचिवालय सलाहकार द्वारा पत्र का मसौदा तैयार किया जा रहा है...</p>
        </div>
      )}
    </div>
  );
};
