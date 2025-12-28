
import React, { useState } from 'react';
import { FormData } from '../types';
import { generateHouseTaxBill } from '../services/gemini';
import { ArrowLeft, ReceiptText, SendHorizontal, Loader2 } from 'lucide-react';

export interface HouseTaxData {
    taxpayerName: string;
    fatherHusbandName: string;
    houseNo: string;
    mohalla: string;
    wardNo: string;
    annualValuation: number;
    arrears: number;
    interestRate: number;
    description: string;
}

interface Props {
  onSubmit: (data: FormData) => void;
  onBack: () => void;
}

export const HouseTaxForm: React.FC<Props> = ({ onSubmit, onBack }) => {
    const [details, setDetails] = useState<HouseTaxData>({
        taxpayerName: '',
        fatherHusbandName: '',
        houseNo: '',
        mohalla: '',
        wardNo: '',
        annualValuation: 0,
        arrears: 0,
        interestRate: 12, // Default interest rate
        description: '',
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field: keyof HouseTaxData, value: string | number) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const generatedData = await generateHouseTaxBill(details);
            onSubmit(generatedData);
        } catch (error) {
            console.error(error);
            alert('बिल बनाने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
        } finally {
            setLoading(false);
        }
    };
    
    const inputField = (label: string, key: keyof HouseTaxData, placeholder: string, type: 'text' | 'number' = 'text') => (
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{label} *</label>
            <input 
                required
                type={type}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 p-3 font-serif-hindi"
                placeholder={placeholder}
                value={details[key]}
                onChange={e => handleInputChange(key, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
            />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4 animate-fade-in pb-20">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full mr-4 text-slate-600">
                    <ArrowLeft />
                </button>
                <h2 className="text-3xl font-bold font-serif-hindi text-indigo-900 flex items-center gap-3">
                    <ReceiptText className="text-green-500"/>
                    गृहकर बिल विवरण
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-slate-200">
                <p className="text-center text-slate-600 mb-8 p-4 bg-green-50/70 border-l-4 border-green-500 rounded-lg font-serif-hindi">
                कृपया गृहकर बिल बनाने हेतु सभी विवरण भरें। AI स्वतः ही गृहकर, जलकर एवं ब्याज की गणना कर लेगा।
                </p>

                <div className="space-y-8">
                    {/* Taxpayer Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                        <div className="md:col-span-2 flex items-center gap-2">
                            <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest">1. करदाता का विवरण</h3>
                            <div className="h-0.5 flex-1 bg-indigo-50"></div>
                        </div>
                        {inputField('करदाता का नाम', 'taxpayerName', 'उदा. रामभरोसे')}
                        {inputField('पिता/पति का नाम', 'fatherHusbandName', 'उदा. श्यामलाल')}
                    </div>

                    {/* Property Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100">
                         <div className="md:col-span-3 flex items-center gap-2">
                            <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest">2. संपत्ति का विवरण</h3>
                            <div className="h-0.5 flex-1 bg-indigo-50"></div>
                        </div>
                        {inputField('भवन संख्या', 'houseNo', 'उदा. 123/A')}
                        {inputField('मोहल्ला', 'mohalla', 'उदा. गांधी नगर')}
                        {inputField('वार्ड संख्या', 'wardNo', 'उदा. 15')}
                    </div>
                    
                    {/* Calculation Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="md:col-span-3 flex items-center gap-2">
                            <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest">3. कर गणना हेतु विवरण</h3>
                            <div className="h-0.5 flex-1 bg-indigo-50"></div>
                        </div>
                        {inputField('वार्षिक मूल्यांकन (ARV)', 'annualValuation', 'उदा. 10000', 'number')}
                        {inputField('बकाया धनराशि (Arrears)', 'arrears', 'उदा. 500', 'number')}
                        {inputField('ब्याज दर (%)', 'interestRate', 'उदा. 12', 'number')}
                    </div>

                     {/* Description */}
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">अतिरिक्त विवरण (Optional)</label>
                        <input 
                            type="text"
                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 p-3 font-serif-hindi"
                            placeholder="उदा. वित्तीय वर्ष 2024-25 हेतु"
                            value={details.description}
                            onChange={e => handleInputChange('description', e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-10">
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl text-2xl font-black shadow-xl shadow-green-100 transition-all flex justify-center items-center gap-4 active:scale-95 disabled:opacity-50"
                    >
                         {loading ? (
                            <><Loader2 className="animate-spin" size={32} /> बिल बन रहा है...</>
                         ) : (
                            <> बिल बनाएं <SendHorizontal size={28} /></>
                         )}
                    </button>
                </div>
            </form>
        </div>
    );
};
