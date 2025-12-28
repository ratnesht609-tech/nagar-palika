
import React, { useState } from 'react';
import { PrakashanNoticeBasis, PrakashanNoticeType } from '../types';
import { ArrowLeft, Building, Users, FileSignature, BookUser } from 'lucide-react';

interface Props {
  onSelect: (type: PrakashanNoticeType, basis?: PrakashanNoticeBasis) => void;
  onBack: () => void;
}

export const PrakashanTypeSelector: React.FC<Props> = ({ onSelect, onBack }) => {
  const [mutationStep, setMutationStep] = useState(false);

  const handlePrimarySelect = (type: PrakashanNoticeType) => {
    if (type === 'assessment') {
      onSelect('assessment');
    } else {
      setMutationStep(true);
    }
  };

  const handleBasisSelect = (basis: PrakashanNoticeBasis) => {
    onSelect('mutation', basis);
  };
  
  const handleBackStep = () => {
      if (mutationStep) {
          setMutationStep(false);
      } else {
          onBack();
      }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in">
       <div className="flex items-center mb-6">
            <button onClick={handleBackStep} className="p-2 hover:bg-slate-200 rounded-full mr-4 text-slate-600">
                <ArrowLeft />
            </button>
            <h2 className="text-3xl font-bold font-serif-hindi text-indigo-900">
                प्रकाशन सूचना का प्रकार चुनें
            </h2>
        </div>
        
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-slate-200 text-center">
            {!mutationStep ? (
                <>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 font-serif-hindi">सूचना का प्रयोजन क्या है?</h3>
                    <p className="text-slate-500 mb-10">सही विकल्प चुनें ताकि AI आपके लिए सटीक विधिक प्रारूप तैयार कर सके।</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button 
                            onClick={() => handlePrimarySelect('assessment')}
                            className="flex flex-col items-center p-8 bg-indigo-50 rounded-3xl shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-indigo-500 group text-center"
                        >
                            <div className="p-5 rounded-2xl bg-indigo-600 text-white mb-6 shadow-lg shadow-indigo-200">
                               <Building size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-indigo-900 font-serif-hindi mb-2">कर निर्धारण</h3>
                            <p className="text-slate-600">नए बने भवन का पहली बार मूल्यांकन और गृहकर निर्धारण हेतु।</p>
                        </button>
                        <button 
                             onClick={() => handlePrimarySelect('mutation')}
                            className="flex flex-col items-center p-8 bg-green-50 rounded-3xl shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-green-500 group text-center"
                        >
                            <div className="p-5 rounded-2xl bg-green-600 text-white mb-6 shadow-lg shadow-green-200">
                               <Users size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-green-900 font-serif-hindi mb-2">नामांतरण</h3>
                            <p className="text-slate-600">संपत्ति के स्वामी का नाम बदलने (मृत्यु या विक्रय के कारण) हेतु।</p>
                        </button>
                    </div>
                </>
            ) : (
                 <div className="animate-fade-in">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 font-serif-hindi">नामांतरण का आधार क्या है?</h3>
                    <p className="text-slate-500 mb-10">यह चयन नामांतरण की प्रक्रिया और आवश्यक सूचना के प्रारूप को निर्धारित करेगा।</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button 
                            onClick={() => handleBasisSelect('inheritance')}
                            className="flex flex-col items-center p-8 bg-rose-50 rounded-3xl shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-rose-500 group text-center"
                        >
                            <div className="p-5 rounded-2xl bg-rose-600 text-white mb-6 shadow-lg shadow-rose-200">
                               <BookUser size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-rose-900 font-serif-hindi mb-2">वरासत के आधार पर</h3>
                            <p className="text-slate-600">स्वामी की मृत्यु के बाद विधिक उत्तराधिकारी के नाम पर हस्तांतरण।</p>
                        </button>
                        <button 
                             onClick={() => handleBasisSelect('will')}
                            className="flex flex-col items-center p-8 bg-sky-50 rounded-3xl shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-sky-500 group text-center"
                        >
                            <div className="p-5 rounded-2xl bg-sky-600 text-white mb-6 shadow-lg shadow-sky-200">
                               <FileSignature size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-sky-900 font-serif-hindi mb-2">पंजीकृत विलेख/वसीयत</h3>
                            <p className="text-slate-600">संपत्ति की खरीद-बिक्री या वसीयत के आधार पर नाम परिवर्तन।</p>
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
