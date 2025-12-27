import React, { useState } from 'react';
import { DraftSelector } from './components/DraftSelector';
import { DraftForm } from './components/DraftForm';
import { DraftPreview } from './components/DraftPreview';
import { AIAnalyzer } from './components/AIAnalyzer';
import { SplashScreen } from './components/SplashScreen';
import { ExpertChat } from './components/ExpertChat';
import { DraftType, FormData } from './types';

function App() {
  const [step, setStep] = useState<'SPLASH' | 'SELECT' | 'AI' | 'CHAT' | 'FORM' | 'PREVIEW'>('SPLASH');
  const [selectedType, setSelectedType] = useState<DraftType | null>(null);
  const [draftData, setDraftData] = useState<FormData | null>(null);
  const [aiInitialData, setAiInitialData] = useState<FormData | null>(null);

  const handleSplashFinish = () => {
    setStep('SELECT');
  };

  const handleSelectType = (type: DraftType) => {
    setSelectedType(type);
    setAiInitialData(null); 
    setStep('FORM');
  };

  const handleAIStart = () => {
    setStep('AI');
  };
  
  const handleChatStart = () => {
    setStep('CHAT');
  };

  const handleAIDraftGenerated = (type: DraftType, data: FormData, directToPreview: boolean = false) => {
    setSelectedType(type);
    setAiInitialData(data);
    if (directToPreview) {
      setDraftData(data);
      setStep('PREVIEW');
    } else {
      setStep('FORM');
    }
  };

  const handleFormSubmit = (data: FormData) => {
    setDraftData(data);
    setStep('PREVIEW');
  };

  const handleEdit = () => {
    setStep('FORM');
  };

  const handleReset = () => {
    setStep('SELECT');
    setSelectedType(null);
    setDraftData(null);
    setAiInitialData(null);
  };

  const handleUpdateDraft = (updatedData: FormData) => {
    setDraftData(updatedData);
  };

  const handleBackToSelect = () => {
    setStep('SELECT');
    setSelectedType(null);
    setAiInitialData(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {step === 'SPLASH' && <SplashScreen onFinish={handleSplashFinish} />}

      {step !== 'PREVIEW' && step !== 'SPLASH' && (
        <header className="bg-indigo-900 text-white p-4 shadow-lg border-b-4 border-yellow-500 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-indigo-900 font-bold text-xl shadow-inner">
                स
              </div>
              <div>
                <h1 className="text-xl font-bold font-serif-hindi leading-tight tracking-wide">नगर पालिका सचिवालय</h1>
                <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-black">Municipal Secretariat & Legal Hub</p>
              </div>
            </div>
          </div>
        </header>
      )}

      {step !== 'SPLASH' && (
        <main className="flex-grow bg-slate-100">
          {step === 'SELECT' && (
            <DraftSelector 
              onSelect={handleSelectType} 
              onAIStart={handleAIStart}
              onChatStart={handleChatStart}
            />
          )}

          {step === 'AI' && (
            <AIAnalyzer 
              onDraftGenerated={handleAIDraftGenerated}
              onCancel={handleBackToSelect}
            />
          )}
          
          {step === 'CHAT' && (
            <ExpertChat 
              onBack={handleBackToSelect}
            />
          )}
          
          {step === 'FORM' && selectedType && (
            <DraftForm 
              draftType={selectedType} 
              initialData={aiInitialData}
              onSubmit={handleFormSubmit}
              onBack={handleBackToSelect}
            />
          )}

          {step === 'PREVIEW' && selectedType && draftData && (
            <DraftPreview 
              data={draftData}
              type={selectedType}
              onEdit={handleEdit}
              onReset={handleReset}
              onUpdate={handleUpdateDraft}
            />
          )}
        </main>
      )}
    </div>
  );
}

export default App;