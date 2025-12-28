
import React, { useState, useRef } from 'react';
import { analyzeRTIQuery } from '../services/gemini';
import { RTIAnalysisResult } from '../types';
import { ArrowLeft, ShieldQuestion, UploadCloud, FileText, Wand2, Loader2, SendHorizontal, Copy, CheckCircle, AlertTriangle, BadgeCheck, Gavel } from 'lucide-react';

interface Props {
    onCancel: () => void;
}

interface FileData {
    base64: string;
    mimeType: string;
    name: string;
}

export const RTIExpert: React.FC<Props> = ({ onCancel }) => {
    const [fileData, setFileData] = useState<FileData | null>(null);
    const [queryText, setQueryText] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<RTIAnalysisResult | null>(null);
    const [copiedStates, setCopiedStates] = useState<Record<number, boolean>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    const res = ev.target.result as string;
                    setFileData({ base64: res.split(',')[1], mimeType: file.type, name: file.name });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!queryText.trim() && !fileData) {
            alert("कृपया RTI प्रश्न दर्ज करें या फ़ाइल अपलोड करें।");
            return;
        }
        setLoading(true);
        setAnalysisResult(null);
        try {
            const result = await analyzeRTIQuery(queryText, fileData || undefined);
            setAnalysisResult(result);
        } catch (error) {
            console.error(error);
            alert("RTI विश्लेषण में त्रुटि हुई। कृपया पुनः प्रयास करें।");
        } finally {
            setLoading(false);
        }
    };
    
    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedStates(prev => ({ ...prev, [index]: true }));
        setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [index]: false }));
        }, 2000);
    };

    const RecommendationIcon = ({ recommendation }: { recommendation: string }) => {
        switch (recommendation) {
            case 'DENY':
                return <AlertTriangle className="text-red-500" />;
            case 'PROVIDE_LIMITED':
                return <BadgeCheck className="text-yellow-500" />;
            default:
                return <BadgeCheck className="text-green-500" />;
        }
    };
    
    const getRecommendationText = (recommendation: string) => {
        switch (recommendation) {
            case 'DENY': return 'सूचना देने से मना करें';
            case 'PROVIDE_LIMITED': return 'सीमित जानकारी प्रदान करें';
            default: return 'जानकारी प्रदान करें';
        }
    }


    return (
        <div className="max-w-6xl mx-auto p-4 animate-fade-in pb-20">
            <div className="flex items-center mb-6">
                <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full mr-4 text-slate-600">
                    <ArrowLeft />
                </button>
                <h2 className="text-3xl font-bold font-serif-hindi text-indigo-900 flex items-center gap-3">
                    <ShieldQuestion className="text-red-500" />
                    RTI अधिनियम, 2005 - विधिक सलाहकार
                </h2>
            </div>

            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-slate-200">
                <p className="text-center text-slate-600 mb-8 p-4 bg-red-50/70 border-l-4 border-red-500 rounded-lg font-serif-hindi">
                    RTI आवेदन का विश्लेषण करने और कानूनी रूप से बचाव हेतु सही धाराएं एवं उत्तर प्राप्त करने के लिए नीचे दिए गए विकल्पों का उपयोग करें।
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* File Upload */}
                    <div
                        className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-indigo-50/50 transition-all cursor-pointer group flex flex-col items-center justify-center"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input type="file" accept="image/*,application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                           <UploadCloud size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 font-serif-hindi">RTI पत्र अपलोड करें</h3>
                        <p className="text-slate-500 text-sm">{fileData ? `फ़ाइल: ${fileData.name}` : 'JPG, PNG या PDF'}</p>
                    </div>

                    {/* Text Input */}
                    <div>
                        <textarea
                            className="w-full h-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-0 font-serif-hindi transition-all"
                            placeholder="या, RTI में पूछे गए प्रश्न यहाँ टाइप करें..."
                            rows={6}
                            value={queryText}
                            onChange={e => setQueryText(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl text-2xl font-black shadow-xl shadow-red-100 transition-all flex justify-center items-center gap-4 active:scale-95 disabled:opacity-50"
                >
                    {loading ? <><Loader2 className="animate-spin" size={32} /> विश्लेषण हो रहा है...</> : <><Wand2 size={28} /> विश्लेषण करें</>}
                </button>
            </div>
            
            {analysisResult && (
                <div className="mt-12 animate-fade-in">
                    <h3 className="text-2xl font-bold font-serif-hindi text-center mb-6">RTI विधिक विश्लेषण रिपोर्ट</h3>
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-200 space-y-6">
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                             <h4 className="font-bold text-indigo-900 font-serif-hindi">संक्षिप्त विवरण:</h4>
                             <p className="text-indigo-800">{analysisResult.overall_summary}</p>
                        </div>
                       
                        {analysisResult.analysis.map((item, index) => (
                            <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden">
                               <div className="p-4 bg-slate-50 border-b">
                                   <p className="font-serif-hindi font-bold text-slate-700">प्रश्न {index + 1}: "{item.question}"</p>
                               </div>
                               <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                   <div className="md:col-span-1 bg-slate-50 rounded-lg p-3">
                                       <div className="flex items-center gap-2 mb-2">
                                           <RecommendationIcon recommendation={item.recommendation} />
                                           <h5 className="font-bold text-sm uppercase tracking-wider text-slate-600">सुझाव</h5>
                                       </div>
                                       <p className="font-bold font-serif-hindi text-indigo-900">{getRecommendationText(item.recommendation)}</p>
                                   </div>
                                   <div className="md:col-span-2 bg-slate-50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                           <Gavel className="text-red-500" />
                                           <h5 className="font-bold text-sm uppercase tracking-wider text-slate-600">कानूनी आधार (Exemption)</h5>
                                       </div>
                                       <p className="font-bold font-serif-hindi text-red-700">{item.exemption_section}</p>
                                       <p className="text-sm text-slate-600 mt-1">{item.reasoning}</p>
                                   </div>
                               </div>
                               <div className="p-4 bg-slate-100 border-t">
                                    <label className="block text-xs font-bold text-slate-500 mb-2">उत्तर हेतु सुझाया गया वाक्य:</label>
                                    <div className="flex items-center gap-2">
                                        <p className="flex-1 bg-white p-3 rounded-md border text-sm text-slate-800 font-serif-hindi italic">"{item.suggested_response_text}"</p>
                                        <button onClick={() => handleCopy(item.suggested_response_text, index)} className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
                                           {copiedStates[index] ? <CheckCircle size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                               </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};
