import React, { useState, useEffect } from 'react';
import { DraftType, FormData, SubjectTemplate } from '../types';
import { SUBJECT_TEMPLATES, PHRASES, COMMON_PHRASES } from '../constants/phrases';
import { ArrowRight, ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface Props {
  draftType: DraftType;
  initialData?: FormData | null;
  onSubmit: (data: FormData) => void;
  onBack: () => void;
}

export const DraftForm: React.FC<Props> = ({ draftType, initialData, onSubmit, onBack }) => {
  const [formData, setFormData] = useState<Partial<FormData>>({
    departmentName: 'नगर पालिक निगम / परिषद्',
    officeName: 'मुख्यालय',
    location: '',
    hasReference: false,
    subjectData: {},
    copyTo: [],
    decisionType: '',
    introType: 'GENERAL',
    ruleText: 'RULE_GEN'
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
      if (initialData.subjectTemplateId) {
        setSelectedTemplateId(initialData.subjectTemplateId);
      }
    }
  }, [initialData]);

  const currentTemplate = SUBJECT_TEMPLATES.find(t => t.id === selectedTemplateId);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubjectDataChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      subjectData: { ...prev.subjectData, [key]: value }
    }));
  };

  const addCopyTo = () => {
    setFormData(prev => ({ ...prev, copyTo: [...(prev.copyTo || []), ''] }));
  };

  const updateCopyTo = (index: number, val: string) => {
    const newCopy = [...(formData.copyTo || [])];
    newCopy[index] = val;
    setFormData(prev => ({ ...prev, copyTo: newCopy }));
  };

  const removeCopyTo = (index: number) => {
    setFormData(prev => ({ ...prev, copyTo: (prev.copyTo || []).filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.departmentName || !selectedTemplateId || !formData.senderName) {
      alert('कृपया सभी अनिवार्य फ़ील्ड भरें');
      return;
    }
    onSubmit({
      ...formData,
      subjectTemplateId: selectedTemplateId
    } as FormData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in pb-20">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full mr-4 text-slate-600">
          <ArrowLeft />
        </button>
        <h2 className="text-2xl font-bold font-serif-hindi text-indigo-900">
          विवरण दर्ज करें: {draftType}
        </h2>
        {initialData && (
          <span className="ml-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">
             AI ऑटो-फिल्ड
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-slate-200">
        
        {/* Section 1: Nagar Palika Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
          <div className="md:col-span-2 flex items-center gap-2">
            <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest">1. कार्यालय विवरण (नगर पालिका)</h3>
            <div className="h-0.5 flex-1 bg-indigo-50"></div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">नगर पालिका/निगम का नाम *</label>
            <input 
              required
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 p-3 font-serif-hindi"
              placeholder="उदा. नगर पालिक निगम, इन्दौर"
              value={formData.departmentName}
              onChange={e => handleInputChange('departmentName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">शाखा / अनुभाग *</label>
            <input 
              required
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 p-3 font-serif-hindi"
              placeholder="उदा. सामान्य प्रशासन विभाग / राजस्व शाखा"
              value={formData.officeName}
              onChange={e => handleInputChange('officeName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">शहर / जिला</label>
            <input 
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 p-3 font-serif-hindi"
              placeholder="शहर का नाम लिखें"
              value={formData.location}
              onChange={e => handleInputChange('location', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">दिनांक</label>
                <input 
                  type="text"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 p-3"
                  value={formData.date}
                  placeholder="DD-MM-YYYY"
                  onChange={e => handleInputChange('date', e.target.value)}
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">पत्रांक (Ref No)</label>
                <input 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 p-3"
                  placeholder="न.पा./प्रशा./2025/123"
                  value={formData.dispatchNo}
                  onChange={e => handleInputChange('dispatchNo', e.target.value)}
                />
             </div>
          </div>
        </div>

        {/* Section 2: Subject Builder */}
        <div className="pb-6 border-b border-slate-100">
           <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-4">2. विषय चयन (Subject)</h3>
           <div className="mb-4">
             <label className="block text-sm font-bold text-slate-700 mb-2">विषय श्रेणी चुनें *</label>
             <select 
                required
                className="w-full bg-indigo-50 border-2 border-indigo-100 rounded-xl focus:border-indigo-500 focus:ring-0 p-3 font-serif-hindi"
                value={selectedTemplateId}
                onChange={e => setSelectedTemplateId(e.target.value)}
             >
                <option value="">-- श्रेणी चुनें --</option>
                {SUBJECT_TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
             </select>
           </div>

           {currentTemplate && (
             <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 animate-fade-in">
               <p className="text-xs text-indigo-600 mb-4 font-bold uppercase tracking-wider">प्रारूप: {currentTemplate.template}</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {currentTemplate.fields.map(field => (
                   <div key={field.key} className={field.key === 'subject' ? 'md:col-span-2' : ''}>
                     <label className="block text-xs font-black text-slate-400 mb-1 uppercase">{field.label}</label>
                     {field.options ? (
                        <select
                          className="w-full bg-white border border-slate-200 rounded-lg p-3"
                          value={formData.subjectData?.[field.key] || ''}
                          onChange={e => handleSubjectDataChange(field.key, e.target.value)}
                        >
                          <option value="">चुनें</option>
                          {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                     ) : (
                       <input 
                          type={field.type || 'text'}
                          className="w-full bg-white border border-slate-200 rounded-lg p-3 font-serif-hindi"
                          placeholder={field.placeholder}
                          value={formData.subjectData?.[field.key] || ''}
                          onChange={e => handleSubjectDataChange(field.key, e.target.value)}
                       />
                     )}
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>

        {/* Section 4: Content Construction (Nagar Palika Logic) */}
        <div className="pb-6 border-b border-slate-100">
           <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-6">3. ड्राफ्ट सामग्री (Content)</h3>
           
           <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-indigo-700 mb-2">प्रारंभिक वाक्य (Opening)</label>
                <select 
                  className="w-full border-2 border-slate-200 rounded-xl p-3 bg-white font-serif-hindi"
                  value={formData.introType}
                  onChange={e => handleInputChange('introType', e.target.value)}
                >
                  {PHRASES[draftType]?.openers.map(o => (
                    <option key={o.id} value={o.id}>{o.text.substring(0, 100)}...</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-indigo-700 mb-2">मुख्य विवरण / तथ्य (Fact)</label>
                <textarea 
                  rows={8}
                  className="w-full border-2 border-slate-200 rounded-xl p-4 font-serif-hindi text-lg leading-relaxed focus:border-indigo-500 focus:ring-0"
                  placeholder="यहाँ मुख्य बात विस्तार से लिखें..."
                  value={formData.factText}
                  onChange={e => handleInputChange('factText', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-indigo-700 mb-2">नियम / प्रक्रिया</label>
                  <select 
                    className="w-full border-2 border-slate-200 rounded-xl p-3 bg-white font-serif-hindi"
                    value={formData.ruleText}
                    onChange={e => handleInputChange('ruleText', e.target.value)}
                  >
                    {COMMON_PHRASES.rules.map(r => (
                      <option key={r.id} value={r.id}>{r.text}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-indigo-700 mb-2">निष्कर्ष / निर्णय</label>
                  <select 
                    className="w-full border-2 border-slate-200 rounded-xl p-3 bg-white font-serif-hindi"
                    value={formData.decisionType}
                    onChange={e => handleInputChange('decisionType', e.target.value)}
                  >
                    {COMMON_PHRASES.decisions.map(d => (
                      <option key={d.id} value={d.id}>{d.text}</option>
                    ))}
                  </select>
                </div>
              </div>
           </div>
        </div>

        {/* Section 5: Signature */}
        <div className="pb-6">
           <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-4">4. हस्ताक्षरकर्ता (CMO/अधिकारी)</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">अधिकारी का नाम *</label>
                <input 
                  required
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 font-serif-hindi"
                  placeholder="नाम लिखें"
                  value={formData.senderName || ''}
                  onChange={e => handleInputChange('senderName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">पदनाम (Designation) *</label>
                <input 
                  required
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 font-serif-hindi"
                  placeholder="उदा. मुख्य नगरपालिका अधिकारी"
                  value={formData.senderDesignation || ''}
                  onChange={e => handleInputChange('senderDesignation', e.target.value)}
                />
              </div>
           </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-5 rounded-2xl text-2xl font-black shadow-xl shadow-indigo-100 transition-all flex justify-center items-center gap-4 active:scale-95"
          >
            ड्राफ्ट तैयार करें <ArrowRight size={28} />
          </button>
        </div>

      </form>
    </div>
  );
};
