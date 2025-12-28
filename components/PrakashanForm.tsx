
import React, { useState, useEffect } from 'react';
import { FormData, PrakashanNoticeBasis, PrakashanNoticeType } from '../types';
import { generatePrakashanNotice } from '../services/gemini';
import { ArrowLeft, Megaphone, SendHorizontal, Loader2 } from 'lucide-react';

export interface PrakashanData {
    noticeType: PrakashanNoticeType;
    noticeBasis?: PrakashanNoticeBasis | null;
    applicantName: string;
    applicantFatherName: string;
    propertyMohalla: string;
    propertyWard: string;
    propertyHouseNo: string;
    originalOwnerName: string; // Seller or original owner for will/deed
    originalOwnerFatherName: string; // Seller's father
    deceasedOwnerName: string; // Deceased for inheritance
    deathDate: string; // For inheritance
    willDate: string; // For will/deed
    isConstructed?: 'yes' | 'no';
}

interface Props {
  noticeType: PrakashanNoticeType;
  noticeBasis?: PrakashanNoticeBasis | null;
  initialData?: FormData | null;
  onSubmit: (data: FormData) => void;
  onBack: () => void;
}

export const PrakashanForm: React.FC<Props> = ({ noticeType, noticeBasis, initialData, onSubmit, onBack }) => {
    const [details, setDetails] = useState<Partial<PrakashanData>>({
        noticeType: noticeType,
        noticeBasis: noticeBasis,
        applicantName: '',
        applicantFatherName: '',
        propertyMohalla: '',
        propertyWard: '',
        propertyHouseNo: '',
        originalOwnerName: '',
        originalOwnerFatherName: '',
        deceasedOwnerName: '',
        deathDate: '',
        willDate: '',
        isConstructed: undefined,
    });
    const [loading, setLoading] = useState(false);

    // Determine if the property is a plot based on house number input
    const isPlot = (details.propertyHouseNo || '').trim() === '0' || (details.propertyHouseNo || '').trim() === '';

    useEffect(() => {
        if(initialData) {
            // Logic to pre-fill from draft data can be added here
        }
    }, [initialData]);

    const handleInputChange = (field: keyof PrakashanData, value: string | undefined) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (noticeType === 'assessment' && isPlot && !details.isConstructed) {
             alert('कृपया बताएं कि प्लाट पर भवन बना है या नहीं।');
             return;
        }
        setLoading(true);
        try {
            // Add noticeType and noticeBasis before sending
            const fullDetails: PrakashanData = {
                ...details,
                noticeType: noticeType,
                noticeBasis: noticeBasis,
            } as PrakashanData;
            const generatedData = await generatePrakashanNotice(fullDetails);
            onSubmit(generatedData);
        } catch (error) {
            console.error(error);
            alert('सूचना बनाने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
        } finally {
            setLoading(false);
        }
    };
    
    const inputField = (label: string, key: keyof PrakashanData, placeholder: string, required: boolean = true) => (
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{label}{required ? ' *' : ''}</label>
            <input 
                required={required}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 p-3 font-serif-hindi"
                placeholder={placeholder}
                value={details[key] as string || ''}
                onChange={e => handleInputChange(key, e.target.value)}
            />
        </div>
    );

    const getTitle = () => {
        if (noticeType === 'assessment') return 'कर निर्धारण हेतु सूचना';
        if (noticeBasis === 'inheritance') return 'नामांतरण सूचना (वरासत)';
        if (noticeBasis === 'will') return 'नामांतरण सूचना (विलेख/वसीयत)';
        return 'प्रकाशन सूचना';
    };

    return (
        <div className="max-w-4xl mx-auto p-4 animate-fade-in pb-20">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full mr-4 text-slate-600">
                    <ArrowLeft />
                </button>
                <h2 className="text-3xl font-bold font-serif-hindi text-indigo-900 flex items-center gap-3">
                    <Megaphone className="text-yellow-500"/>
                    {getTitle()}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-slate-200">
                <p className="text-center text-slate-600 mb-8 p-4 bg-indigo-50/70 border-l-4 border-indigo-500 rounded-lg font-serif-hindi">
                कृपया चुने गए प्रकरण के अनुसार विवरण भरें। AI स्वतः ही सही विधिक प्रारूप तैयार कर देगा। आप अंग्रेजी में भी नाम/स्थान भर सकते हैं, AI उसे हिंदी में परिवर्तित कर देगा।
                </p>

                <div className="space-y-8">
                    {/* Applicant Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                        <div className="md:col-span-2 flex items-center gap-2">
                            <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest">
                                {noticeType === 'mutation' ? '1. आवेदक (क्रेता/उत्तराधिकारी)' : '1. आवेदक (भवन स्वामी)'}
                            </h3>
                            <div className="h-0.5 flex-1 bg-indigo-50"></div>
                        </div>
                        {inputField('आवेदक का नाम', 'applicantName', noticeBasis === 'inheritance' ? 'उदा. राम सिंह (वारिस)' : 'उदा. शिवविजय सिंह')}
                        {inputField('पिता का नाम', 'applicantFatherName', 'उदा. जयराम सिंह')}
                    </div>

                    {/* Property Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100">
                         <div className="md:col-span-3 flex items-center gap-2">
                            <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest">2. संपत्ति का विवरण</h3>
                            <div className="h-0.5 flex-1 bg-indigo-50"></div>
                        </div>
                        {inputField('मोहल्ला', 'propertyMohalla', 'उदा. समदनगर')}
                        {inputField('वार्ड संख्या', 'propertyWard', 'उदा. सिंह भवानी')}
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">भवन संख्या *</label>
                            <input 
                                required
                                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 p-3 font-serif-hindi"
                                placeholder={noticeType === 'assessment' ? "प्लाट के लिए '0' लिखें" : "उदा. 740"}
                                value={details.propertyHouseNo || ''}
                                onChange={e => handleInputChange('propertyHouseNo', e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {/* Owner/Seller/Deceased Details */}
                    {noticeType === 'mutation' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                             <div className="md:col-span-2 flex items-center gap-2">
                                <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest">
                                    {noticeBasis === 'inheritance' ? '3. मृतक का विवरण' : '3. विक्रेता का विवरण'}
                                </h3>
                                <div className="h-0.5 flex-1 bg-indigo-50"></div>
                            </div>
                            {noticeBasis === 'will' && !isPlot && (
                                <>
                                {inputField('रजिस्टर में अंकित नाम', 'originalOwnerName', 'उदा. छन्नूलाल कुशवाहा')}
                                {inputField('रजिस्टर में अंकित पिता का नाम', 'originalOwnerFatherName', 'उदा. तुलसीदास')}
                                </>
                            )}
                             {noticeBasis === 'inheritance' ?
                                 inputField('मृतक का नाम', 'deceasedOwnerName', 'उदा. श्याम सिंह')
                               : inputField('विक्रेता का नाम', 'deceasedOwnerName', 'उदा. जयराम सिंह')
                             }
                        </div>
                    )}

                    {/* Key Dates and construction status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 flex items-center gap-2">
                            <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest">
                                {noticeType === 'assessment' ? '3. निर्माण की स्थिति' : '4. महत्वपूर्ण तिथियाँ'}
                            </h3>
                            <div className="h-0.5 flex-1 bg-indigo-50"></div>
                        </div>
                         {noticeBasis === 'inheritance' && inputField('मृत्यु दिनांक', 'deathDate', 'उदा. 19.11.2025')}
                         {noticeBasis === 'will' && inputField('रजिस्टर्ड विलेख/वसीयत दिनांक', 'willDate', 'उदा. 13.11.2025')}
                         
                         {noticeType === 'assessment' && isPlot && (
                             <div className="md:col-span-2 bg-indigo-50 p-6 rounded-2xl border-2 border-dashed border-indigo-200">
                                <label className="block text-sm font-bold text-indigo-800 mb-3">क्या प्लाट पर भवन बना लिया गया है? *</label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer">
                                        <input type="radio" name="isConstructed" value="yes" checked={details.isConstructed === 'yes'} onChange={() => handleInputChange('isConstructed', 'yes')} className="w-5 h-5 text-indigo-600 focus:ring-indigo-500" />
                                        <span className="font-bold text-lg font-serif-hindi">हाँ, भवन निर्मित है</span>
                                    </label>
                                </div>
                            </div>
                         )}
                    </div>
                </div>

                <div className="pt-10">
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-5 rounded-2xl text-2xl font-black shadow-xl shadow-indigo-100 transition-all flex justify-center items-center gap-4 active:scale-95 disabled:opacity-50"
                    >
                         {loading ? (
                            <><Loader2 className="animate-spin" size={32} /> सूचना बन रही है...</>
                         ) : (
                            <> प्रकाशन सूचना बनाएं <SendHorizontal size={28} /></>
                         )}
                    </button>
                </div>
            </form>
        </div>
    );
};
