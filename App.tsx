

import React, { useState } from 'react';
import { DraftSelector } from './components/DraftSelector';
import { DraftForm } from './components/DraftForm';
import { PrakashanTypeSelector } from './components/PrakashanTypeSelector';
import { PrakashanForm } from './components/PrakashanForm';
import { HouseTaxForm } from './components/HouseTaxForm';
import { DemandNoticeForm } from './components/DemandNoticeForm';
import { DraftPreview } from './components/DraftPreview';
import { AIAnalyzer } from './components/AIAnalyzer';
import { RTIExpert } from './components/RTIExpert';
import { PromptDrafter } from './components/PromptDrafter';
import { SplashScreen } from './components/SplashScreen';
import { ExpertChat } from './components/ExpertChat';
import { DraftType, FormData, PrakashanNoticeBasis, PrakashanNoticeType } from './types';

function App() {
  const [step, setStep] = useState<'SPLASH' | 'SELECT' | 'AI' | 'PROMPT_AI' | 'CHAT' | 'RTI_EXPERT' | 'FORM' | 'PRAKASHAN_SELECT_TYPE' | 'PRAKASHAN_FORM' | 'HOUSE_TAX_FORM' | 'DEMAND_NOTICE_FORM' | 'PREVIEW'>('SPLASH');
  const [selectedType, setSelectedType] = useState<DraftType | null>(null);
  const [prakashanType, setPrakashanType] = useState<PrakashanNoticeType | null>(null);
  const [prakashanBasis, setPrakashanBasis] = useState<PrakashanNoticeBasis | null>(null);
  const [draftData, setDraftData] = useState<FormData | null>(null);
  const [aiInitialData, setAiInitialData] = useState<FormData | null>(null);

  const handleSplashFinish = () => {
    setStep('SELECT');
  };

  const handleSelectType = (type: DraftType) => {
    setSelectedType(type);
    setAiInitialData(null);
    setDraftData(null); // Reset previous data
    if (type === DraftType.PRAKASHAN) {
      setStep('PRAKASHAN_SELECT_TYPE');
    } else if (type === DraftType.HOUSE_TAX) {
      setStep('HOUSE_TAX_FORM');
    } else if (type === DraftType.DEMAND_NOTICE) {
      setStep('DEMAND_NOTICE_FORM');
    } else {
      setStep('FORM');
    }
  };

  const handlePrakashanTypeSelect = (type: PrakashanNoticeType, basis?: PrakashanNoticeBasis) => {
    setPrakashanType(type);
    setPrakashanBasis(basis || null);
    setStep('PRAKASHAN_FORM');
  };

  const handleAIStart = () => {
    setStep('AI');
  };
  
  const handlePromptStart = () => {
    setStep('PROMPT_AI');
  };
  
  const handleChatStart = () => {
    setStep('CHAT');
  };

  const handleRTIStart = () => {
    setStep('RTI_EXPERT');
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
    if (selectedType === DraftType.PRAKASHAN) {
      setStep('PRAKASHAN_FORM');
    } else if (selectedType === DraftType.HOUSE_TAX) {
      setStep('HOUSE_TAX_FORM');
    } else if (selectedType === DraftType.DEMAND_NOTICE) {
      setStep('DEMAND_NOTICE_FORM');
    } else {
      setStep('FORM');
    }
  };
  
  const handlePrakashanBack = () => {
      if (prakashanBasis || prakashanType === 'assessment') {
          // If we are on the form, go back to type selection
          setStep('PRAKASHAN_SELECT_TYPE');
      } else {
          // If we are on type selection, go back to main menu
          setStep('SELECT');
      }
  };

  const handleReset = () => {
    setStep('SELECT');
    setSelectedType(null);
    setDraftData(null);
    setAiInitialData(null);
    setPrakashanType(null);
    setPrakashanBasis(null);
  };

  const handleUpdateDraft = (updatedData: FormData) => {
    setDraftData(updatedData);
  };

  const handleBackToSelect = () => {
    setStep('SELECT');
    setSelectedType(null);
    setAiInitialData(null);
    setPrakashanType(null);
    setPrakashanBasis(null);
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
              onPromptStart={handlePromptStart}
              onRTIStart={handleRTIStart}
            />
          )}

          {step === 'AI' && (
            <AIAnalyzer 
              onDraftGenerated={handleAIDraftGenerated}
              onCancel={handleBackToSelect}
            />
          )}
          
          {step === 'PROMPT_AI' && (
            <PromptDrafter 
              onDraftGenerated={handleAIDraftGenerated}
              onCancel={handleBackToSelect}
            />
          )}
          
          {step === 'CHAT' && (
            <ExpertChat 
              onBack={handleBackToSelect}
            />
          )}
          
          {step === 'RTI_EXPERT' && (
            <RTIExpert 
              onCancel={handleBackToSelect}
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
          
          {step === 'PRAKASHAN_SELECT_TYPE' && (
            <PrakashanTypeSelector
              onSelect={handlePrakashanTypeSelect}
              onBack={handleBackToSelect}
            />
          )}

          {step === 'PRAKASHAN_FORM' && prakashanType && (
            <PrakashanForm
              noticeType={prakashanType}
              noticeBasis={prakashanBasis}
              initialData={draftData}
              onSubmit={handleFormSubmit}
              onBack={handlePrakashanBack}
            />
          )}

          {step === 'HOUSE_TAX_FORM' && (
            <HouseTaxForm
              onSubmit={handleFormSubmit}
              onBack={handleBackToSelect}
            />
          )}

          {step === 'DEMAND_NOTICE_FORM' && (
            <DemandNoticeForm
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