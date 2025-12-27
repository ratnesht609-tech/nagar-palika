
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { DraftType, FormData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AnalysisResult {
  summary: string;
  suggestions: {
    label: string;
    description: string;
    actionType: DraftType;
    intent: string;
  }[];
}

// --- Image/PDF Analysis ---

export const analyzeLetterImage = async (base64Data: string, mimeType: string = 'image/jpeg'): Promise<AnalysisResult> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this document (Municipal letter, Hindi or English). 
    IMPORTANT: This system operates as the 'Municipal Secretariat (नगर पालिका सचिवालय)'.
    The legal framework is the 'Uttar Pradesh Municipalities Act, 1916 (उत्तर प्रदेश नगर पालिका अधिनियम, 1916)'.
    1. Summarize the content briefly (Who sent it? To whom? What is the subject?).
    2. Suggest 3 distinct actions a Municipal Commissioner or Executive Officer would take based on UP Municipalities Act, 1916 rules.
    
    Output JSON format:
    {
      "summary": "string (in Hindi)",
      "suggestions": [
        { "label": "string", "description": "string", "actionType": "LETTER" | "ORDER" | "NOTE_SHEET" | "MEMO", "intent": "string" }
      ]
    }
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { inlineData: { mimeType: mimeType, data: base64Data } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json"
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as AnalysisResult;
  }
  throw new Error("Failed to analyze document");
};

// --- MAIN FEATURE: GENERATE FROM TEXT PROMPT ---

export const generateDraftFromTextPrompt = async (userInstruction: string): Promise<{type: DraftType, data: FormData}> => {
  const model = "gemini-3-pro-preview";

  const prompt = `
    ROLE: Senior Director (Municipal Secretariat) / Chief Legal Consultant for Municipalities in Uttar Pradesh.
    MISSION: Generate a professional, legally-sound government draft based ONLY on the user description provided.
    LAWS: Adhere strictly to the 'Uttar Pradesh Municipalities Act, 1916'.
    USER DESCRIPTION: "${userInstruction}".
    
    STRICT SECRETARIAT RULES:
    1. SENDER: Always a high-ranking municipal official (EO, CMO, Commissioner).
    2. PROFESSIONALISM: Use standard Administrative Hindi (मानक प्रशासनिक हिंदी).
    3. DETAILS: Invent realistic dates, dispatch numbers (e.g., स.प्र./2025/...), and appropriate departments if not specified.
    4. STRUCTURE: Follow standard secretariat formatting (Subject, Ref, Body, Signature Block).

    Output MUST be a valid JSON matching this exact schema:
    {
      "type": "LETTER" | "ORDER" | "NOTE_SHEET" | "MEMO" | "PROPOSAL",
      "data": {
        "departmentName": "Required - e.g. 'नगर पालिका परिषद् सचिवालय'",
        "officeName": "Required - e.g. 'प्रशासनिक अनुभाग'",
        "location": "District Name",
        "dispatchNo": "e.g. 'सचि./स्था./2025/104'",
        "date": "Current Date",
        "hasReference": false,
        "refLetterNo": "",
        "refDate": "",
        "subjectTemplateId": "GENERAL",
        "subjectData": { "subject": "Comprehensive Subject in Hindi" },
        "addresseeName": "Recipient Designation",
        "addresseeDept": "Recipient Office/Dept",
        "senderName": "Official Name",
        "senderDesignation": "Official Designation (e.g. अधिशासी अधिकारी)",
        "introType": "GENERAL",
        "factText": "Comprehensive body text in high-standard Hindi.",
        "ruleText": "RULE_GEN",
        "decisionType": "DEC_APPROVE",
        "copyTo": ["Generated CC List"]
      }
    }
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });

  if (response.text) {
    const res = JSON.parse(response.text);
    return { type: res.type as DraftType, data: res.data as FormData };
  }
  throw new Error("Text prompt generation failed");
};

// --- IMAGE/PDF GENERATION ---

export const generateFullDraftWithAI = async (base64Data: string, userInstruction: string, mimeType: string = 'image/jpeg'): Promise<{type: DraftType, data: FormData}> => {
  const model = "gemini-3-pro-preview"; 

  const prompt = `
    ROLE: Senior Director (Municipal Secretariat) / Chief Legal Consultant for Municipalities.
    MISSION: Generate a professional, legally-sound government draft on behalf of a MUNICIPAL SECRETARIAT (नगर पालिका सचिवालय).
    LAWS: Adhere strictly to the terminology and provisions of the 'Uttar Pradesh Municipalities Act, 1916 (उत्तर प्रदेश नगर पालिका अधिनियम, 1916)'.
    USER COMMAND: "${userInstruction}".
    
    STRICT SECRETARIAT RULES:
    1. SENDER: Always on behalf of "नगर पालिका परिषद्" or "नगर पालिक निगम".
    2. PROFESSIONALISM: No informal language. Use terms like 'अधिशासी अधिकारी' (EO), 'मुख्य नगर पालिका अधिकारी' (CMO), 'अध्यक्ष', or 'नगर आयुक्त'.
    3. LEGAL CONTEXT: Reference relevant sections of the UP Municipalities Act, 1916 where appropriate.
    4. NO PLACEHOLDERS: Invent realistic details based on common municipal workflows in Uttar Pradesh.
    5. LANGUAGE: High-standard Administrative Hindi (मानक प्रशासनिक हिंदी).

    Output MUST be a valid JSON matching this exact schema:
    {
      "type": "LETTER" | "ORDER" | "NOTE_SHEET" | "MEMO" | "PROPOSAL",
      "data": {
        "departmentName": "Required - e.g. 'नगर पालिका परिषद् सचिवालय'",
        "officeName": "Required - e.g. 'प्रशासनिक एवं स्थापना अनुभाग'",
        "location": "Required - District Name",
        "dispatchNo": "Required - e.g. 'सचि./स्था./2025/104'",
        "date": "Required - Current Date",
        "hasReference": true,
        "refLetterNo": "Ref No from document",
        "refDate": "Ref Date from document",
        "subjectTemplateId": "GENERAL",
        "subjectData": { "subject": "Formal Comprehensive Subject in Hindi" },
        "addresseeName": "Recipient Designation",
        "addresseeDept": "Recipient Office/Dept",
        "senderName": "Official Designation Placeholder Name",
        "senderDesignation": "e.g. 'अधिशासी अधिकारी' or 'नगर आयुक्त'",
        "introType": "REF_BASED",
        "factText": "Comprehensive, legally-sound body text (Pure Hindi) in context of UP Municipalities Act, 1916.",
        "ruleText": "RULE_GEN",
        "decisionType": "DEC_APPROVE",
        "copyTo": ["Generated CC List (e.g. जिला मजिस्ट्रेट, निदेशक स्थानीय निकाय, संबंधित पटल)"]
      }
    }
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { inlineData: { mimeType: mimeType, data: base64Data } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });

  if (response.text) {
    const res = JSON.parse(response.text);
    return { type: res.type as DraftType, data: res.data as FormData };
  }
  throw new Error("Secretariat generation failed");
};

/**
 * Updates an existing draft with new user instructions.
 */
export const updateDraftWithAI = async (currentData: FormData, updateInstruction: string): Promise<FormData> => {
  const model = "gemini-3-pro-preview";

  const prompt = `
    ROLE: Senior Secretariat Advisor.
    TASK: Update a municipal draft JSON based on the user instruction: "${updateInstruction}".
    CONTEXT: Uttar Pradesh Municipalities Act, 1916.
    
    CURRENT DRAFT DATA:
    ${JSON.stringify(currentData, null, 2)}
    
    INSTRUCTIONS:
    1. Maintain professional secretariat tone and Administrative Hindi.
    2. Apply requested changes to 'factText' or other fields.
    3. Ensure compliance with UP Municipal rules.
    
    Return the UPDATED JSON only.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 2000 }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as FormData;
  }
  throw new Error("Secretariat update failed");
};

export const generateDraftFromAnalysis = async (base64Data: string, actionType: DraftType, intent: string, mimeType: string = 'image/jpeg'): Promise<FormData> => {
  const model = "gemini-3-flash-preview";

  const prompt = `Act as a Municipal Secretariat Expert. Generate a professional draft for "${actionType}" based on "${intent}". Use terminology from UP Municipalities Act, 1916. Output JSON matching the FormData schema.`;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { inlineData: { mimeType: mimeType, data: base64Data } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json"
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as FormData;
  }
  throw new Error("Failed to generate secretariat draft");
};

export const createExpertChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `
        आप 'मुख्य सचिवालय एवं विधि सलाहकार' (Chief Secretariat & Legal Advisor) हैं। 
        आप उत्तर प्रदेश नगर पालिका अधिनियम, 1916 (Uttar Pradesh Municipalities Act, 1916) के प्रकांड विद्वान हैं। 
        आपका कार्य नगर पालिका अधिकारियों को नियमों, उप-विधियों (Bye-laws), और प्रशासनिक प्रक्रियाओं पर सटीक सलाह देना है। 
        
        अति महत्वपूर्ण: जब भी आपकी सलाह अधिनियम के किसी विशिष्ट धारा (Section) को संदर्भित करती है, तो आपको पहले अपनी सलाह देनी होगी, और फिर उस धारा को उद्धृत करना होगा। उद्धृत धारा को कड़ाई से एक मार्कडाउन ब्लॉककोट के रूप में प्रारूपित करें जो '**प्रासंगिक धारा (Relevant Section): [Section Number]**' शीर्षक से शुरू हो।

        उदाहरण प्रतिक्रिया प्रारूप:
        आपके प्रश्न के आधार पर, संबंधित प्राधिकारी को नोटिस जारी किया जाना चाहिए। यह शक्ति धारा 314 के अंतर्गत आती है।

        > **प्रासंगिक धारा (Relevant Section): 314**
        > [यहाँ धारा 314 का पूरा टेक्स्ट आएगा...]

        भाषा: अत्यंत औपचारिक, मानक प्रशासनिक हिंदी। 
        आपका दृष्टिकोण पूर्णतः पेशेवर और सचिवालय कार्यप्रणाली के अनुरूप होना चाहिए।
      `,
    },
  });
};
