import React, { useEffect } from 'react';

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    // Auto-advance after 4 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50 text-white p-4">
      <div className="flex flex-col items-center animate-[fadeIn_1s_ease-out]">
        {/* Logo / Icon */}
        <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center text-slate-900 mb-6 shadow-2xl shadow-yellow-500/20 scale-110">
           <span className="text-5xl font-bold font-serif-hindi">स</span>
        </div>
        
        {/* App Title */}
        <h1 className="text-4xl md:text-5xl font-bold font-serif-hindi mb-2 text-center text-white">
          नगर पालिका सचिवालय
        </h1>
        <p className="text-slate-400 text-lg mb-16 tracking-widest uppercase text-center">
          Palika Administration & Secretariat
        </p>

        {/* Credits Section */}
        <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 text-center max-w-md w-full backdrop-blur-sm shadow-xl transform transition-all hover:scale-105 duration-500">
          <p className="text-slate-400 text-xs mb-3 uppercase tracking-widest font-semibold">
            Visionary & Creator
          </p>
          <h2 className="text-3xl font-bold text-yellow-400 mb-3 font-serif-hindi">
            Ratnesh Tiwari
          </h2>
          <div className="h-0.5 w-16 bg-indigo-500 mx-auto mb-4"></div>
          <p className="text-indigo-200 text-sm italic">
            उ.प्र. नगर पालिका विधिक एवं सचिवालय सहायता केंद्र
          </p>
        </div>
        
        <button 
          onClick={onFinish}
          className="mt-12 text-slate-500 hover:text-white transition-colors text-sm border-b border-transparent hover:border-white pb-1"
        >
          प्रवेश करें &rarr;
        </button>
      </div>
    </div>
  );
};