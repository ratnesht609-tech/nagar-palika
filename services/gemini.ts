

import { GoogleGenAI, Type, Chat } from "@google/genai";
import { DraftType, FormData, RTIAnalysisResult } from "../types";
import { PrakashanData } from "../components/PrakashanForm";
import { HouseTaxData } from "../components/HouseTaxForm";
import { DemandNoticeData } from "../components/DemandNoticeForm";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Standard rules for all AI drafting prompts to ensure consistency and quality.
const AI_DRAFTING_RULES = `
  AI DRAFTING RULES (MUST FOLLOW):
  1.  HINDI ONLY: The entire final output text MUST be in formal, administrative Hindi (Devanagari script).
  2.  TRANSLITERATION: If any user-provided data (names, places, etc.) is in English, you MUST transliterate it into proper Hindi. For example, "Ramesh Kumar" becomes "रमेश कुमार".
  3.  RICH FORMATTING: To emphasize critical information such as names, property details, dates, and legal clauses, use HTML tags directly in the 'factText'. Use <b> for bold and <u> for underline. Example: "<b><u>श्री रमेश कुमार</u></b>", "भवन संख्या-<b><u>740</u></b>", "दिनांक <b><u>13.11.2025</u></b>". The output JSON string must have these HTML tags embedded in its values.
`;


export interface AnalysisResult {
  summary: string;
  suggestions: {
    label: string;
    description: string;
    actionType: DraftType;
    intent: string;
  }[];
}

// --- RTI EXPERT ANALYZER ---
export const analyzeRTIQuery = async (queryText: string, fileData?: { base64: string, mimeType: string }): Promise<RTIAnalysisResult> => {
    const model = "gemini-3-pro-preview";
    const prompt = `
        ROLE: You are a seasoned First Appellate Authority and expert Public Information Officer (PIO) under the RTI Act, 2005, advising a municipal officer in Uttar Pradesh.
        MISSION: Your sole mission is to protect the officer by identifying all legally sound exemptions under the RTI Act, 2005, to deny or limit the information requested. You must be strategic and defensive.
        INPUT: User has provided an RTI query, either as text or an uploaded document.
        USER'S QUERY: "${queryText}"

        INSTRUCTIONS:
        1.  Analyze the provided RTI request (text and/or document).
        2.  For EACH question/point in the request, determine the best legal response strategy.
        3.  If a question can be legally denied, you MUST cite the **exact Section and sub-section** (e.g., Section 8(1)(j), Section 2(f)).
        4.  Provide a **clear, concise explanation in professional Hindi** of *why* this exemption applies. For example: "यह जानकारी व्यक्तिगत है और इसका सार्वजनिक हित से कोई संबंध नहीं है" for 8(1)(j), or "आवेदक ने 'सूचना' नहीं मांगी है, बल्कि 'क्यों' और 'कैसे' जैसे प्रश्न पूछकर कार्यालय से राय/स्पष्टीकरण मांगा है, जो सूचना की परिभाषा (धारा 2(f)) के अंतर्गत नहीं आता" for 2(f).
        5.  For each point, provide a "suggested_response_text" which is a single, formal sentence in Hindi that the officer can directly use in their reply.
        6.  If information must be provided, your recommendation should be "PROVIDE_LIMITED" and you must suggest how to provide the absolute minimum required by law.

        OUTPUT a valid JSON object matching this exact schema:
        {
          "overall_summary": "A brief summary of the RTI request in Hindi.",
          "analysis": [
            {
              "question": "The specific question from the RTI.",
              "recommendation": "DENY" | "PROVIDE_LIMITED" | "PROVIDE_FULL",
              "exemption_section": "The exact section, e.g., 'धारा 8(1)(j)' or 'धारा 2(f)'.",
              "reasoning": "The detailed explanation in Hindi for the recommendation.",
              "suggested_response_text": "A sample Hindi sentence for the official reply."
            }
          ]
        }
    `;
    
    const contents: any = [{ text: prompt }];
    if (fileData) {
        contents.unshift({ inlineData: { mimeType: fileData.mimeType, data: fileData.base64 } });
    }

    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: contents },
        config: {
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 8000 }
        }
    });

    if (response.text) {
        return JSON.parse(response.text) as RTIAnalysisResult;
    }
    throw new Error("RTI Analysis failed.");
};


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
    ROLE: Senior Director (Municipal Secretariat) for 'Nagar Palika Parishad, Mahoba'.
    MISSION: Generate a professional, legally-sound government draft based ONLY on the user description provided. The draft MUST originate from Nagar Palika Parishad, Mahoba.
    LAWS: Adhere strictly to the 'Uttar Pradesh Municipalities Act, 1916'.
    USER DESCRIPTION: "${userInstruction}".
    
    ${AI_DRAFTING_RULES}

    Output MUST be a valid JSON matching this exact schema:
    {
      "type": "LETTER" | "ORDER" | "NOTE_SHEET" | "MEMO" | "PROPOSAL",
      "data": {
        "departmentName": "नगर पालिका परिषद, महोबा",
        "officeName": "Required - e.g. 'प्रशासनिक अनुभाग'",
        "location": "महोबा",
        "dispatchNo": "e.g. 'न.पा.प.महोबा/सा.प्र./2025/104'",
        "date": "Current Date",
        "hasReference": false,
        "refLetterNo": "",
        "refDate": "",
        "subjectTemplateId": "GENERAL",
        "subjectData": { "subject": "Comprehensive Subject in Hindi" },
        "addresseeName": "Recipient Designation",
        "addresseeDept": "Recipient Office/Dept",
        "senderName": "अधिशासी अधिकारी",
        "senderDesignation": "अधिशासी अधिकारी",
        "introType": "GENERAL",
        "factText": "Comprehensive body text in high-standard Hindi with embedded HTML tags for emphasis.",
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
    // Ensure the hardcoded values are always present as requested
    res.data.departmentName = "नगर पालिका परिषद, महोबा";
    res.data.location = "महोबा";
    res.data.senderName = "अधिशासी अधिकारी";
    res.data.senderDesignation = "अधिशासी अधिकारी";
    return { type: res.type as DraftType, data: res.data as FormData };
  }
  throw new Error("Text prompt generation failed");
};

// --- PRAKASHAN SUCHNA GENERATOR ---
export const generatePrakashanNotice = async (details: PrakashanData): Promise<FormData> => {
  const model = "gemin-3-flash-preview";
  const prompt = `
    ROLE: A meticulous clerk at 'Nagar Palika Parishad, Mahoba'.
    TASK: Create a 'Prakashan Suchna' (Publication Notice) under Section 147 of the UP Municipalities Act, 1916, using the provided details and selecting the correct boilerplate template.
    ${AI_DRAFTING_RULES}
    DETAILS:
    - Notice Type: ${details.noticeType}
    - Mutation Basis: ${details.noticeBasis || 'N/A'}
    - Applicant: ${details.applicantName} s/o ${details.applicantFatherName}, resident of ${details.propertyMohalla}.
    - Property: House No. ${details.propertyHouseNo || 'N/A'}, Ward ${details.propertyWard}, Mohalla ${details.propertyMohalla}.
    - Original Owner: ${details.originalOwnerName} s/o ${details.originalOwnerFatherName}.
    - Seller/Deceased: ${details.deceasedOwnerName}.
    - Date of Death: ${details.deathDate || 'N/A'}.
    - Deed/Will Date: ${details.willDate || 'N/A'}.
    INSTRUCTIONS:
    1.  Select the correct TEMPLATE.
    2.  Fill the template with the provided details, applying all AI DRAFTING RULES.
    3.  Output a complete JSON object for a FormData.
    TEMPLATES:
    TEMPLATE_ASSESSMENT: "सर्वसाधारण को सूचित किया जाता है कि श्री {applicantName} पुत्र श्री {applicantFatherName}, निवासी-{propertyMohalla}, महोबा ने एक प्रार्थना पत्र इस आशय का दिया है कि उन्होंने मुहल्ला {propertyMohalla} वार्ड {propertyWard} स्थित प्लाट पर भवन का निर्माण करा लिया है, जिसका गृहकर निर्धारण रजिस्टर में प्रथम बार मूल्यांकन कर दर्ज किया जाना है।\n\nइस सम्बन्ध में यदि किसी को कोई आपत्ति हो तो वह अपनी आपत्ति साक्ष्य सहित <b><u>30 दिन</u></b> के अन्दर इस कार्यालय में प्रस्तुत कर सकता है। उक्त अवधि गुजर जाने के पश्चात् किसी भी आपत्ति पर विचार नहीं किया जायेगा और नियमानुसार भवन का मूल्यांकन कर निर्धारण कर दिया जायेगा।"
    TEMPLATE_MUTATION_INHERITANCE: "सर्वसाधारण को सूचित किया जाता है कि श्री {deceasedOwnerName} की मृत्यु दिनांक {deathDate} को हो जाने के उपरान्त, उनके विधिक वारिस श्री {applicantName} पुत्र श्री {applicantFatherName} ने मुहल्ला {propertyMohalla} वार्ड {propertyWard} स्थित भवन संख्या-{propertyHouseNo} के नामांतरण हेतु वरासत के आधार पर आवेदन किया है। उक्त भवन गृहकर निर्धारण रजिस्टर में मृतक श्री {deceasedOwnerName} के नाम पर अंकित है।\n\nइस सम्बन्ध में यदि किसी को कोई आपत्ति हो तो वह अपनी आपत्ति साक्ष्य सहित <b><u>30 दिन</u></b> के अन्दर इस कार्यालय में प्रस्तुत कर सकता है। उक्त अवधि गुजर जाने के पश्चात् किसी भी आपत्ति पर विचार नहीं किया जायेगा और आवेदक के पक्ष में नियमानुसार नामांतरण की कार्यवाही की जायेगी।"
    TEMPLATE_MUTATION_WILL: "सर्वसाधारण को सूचित किया जाता है कि श्री {applicantName} पुत्र श्री {applicantFatherName}, निवासी-{propertyMohalla}, महोबा ने एक प्रार्थना पत्र इस आशय का दिया है कि उन्होंने मुहल्ला {propertyMohalla} वार्ड {propertyWard} स्थित भवन संख्या-{propertyHouseNo}, जो कि गृहकर निर्धारण रजिस्टर में श्री {originalOwnerName} पुत्र श्री {originalOwnerFatherName} के नाम अंकित है, को पंजीकृत विलेख/वसीयत दिनांक {willDate} के माध्यम से क्रय किया है तथा नामांतरण हेतु आवेदन किया है।\n\nइस सम्बन्ध में यदि किसी को कोई आपत्ति हो तो वह अपनी आपत्ति साक्ष्य सहित <b><u>30 दिन</u></b> के अन्दर इस कार्यालय में प्रस्तुत कर सकता है। उक्त अवधि गुजर जाने के पश्चात् किसी भी आपत्ति पर विचार नहीं किया जायेगा और आवेदक के पक्ष में नियमानुसार नामांतरण की कार्यवाही की जायेगी।"
  `;
  const response = await ai.models.generateContent({ model, contents: prompt, config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { factText: { type: Type.STRING } } } } });
  if (response.text) {
    const data = JSON.parse(response.text) as Partial<FormData>;
    const applicantFullName = `${details.applicantName} पुत्र श्री ${details.applicantFatherName}`;
    return { departmentName: "कार्यालय नगर पालिका परिषद महोबा", officeName: "कर विभाग", location: "महोबा", dispatchNo: `मे.मो./कर विभाग/न०पा०प०महोबा/${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}`, date: new Date().toLocaleDateString('en-GB').replace(/\//g, '.'), hasReference: false, subjectTemplateId: 'GENERAL', subjectData: { subject: "प्रकाशन सूचना" }, senderName: "अधिशासी अधिकारी", senderDesignation: "नगर पालिका परिषद महोबा", factText: data.factText || '', copyTo: [`श्री ${applicantFullName}, निवासी-${details.propertyMohalla}, महोबा इस आशय से कि किसी प्रचलित समाचार-पत्र में अपने व्यय से प्रकाशित कराते हुए एक प्रति पालिका कार्यालय में उपलब्ध करायें।`, "पालिका के नोटिस बोर्ड पर चस्पा करने हेतु।"], introType: 'GENERAL', ruleText: 'RULE_GEN', decisionType: 'DEC_FWD' } as FormData;
  }
  throw new Error("Prakashan Suchna generation failed");
};

// --- HOUSE TAX BILL GENERATOR (BILL ONLY) ---
export const generateHouseTaxBill = async (details: HouseTaxData): Promise<FormData> => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    ROLE: Expert Tax Clerk, Nagar Palika Parishad, Mahoba.
    TASK: Generate a complete House Tax Bill data object.
    
    ${AI_DRAFTING_RULES}

    INPUT DATA:
    - Taxpayer: ${details.taxpayerName} s/o ${details.fatherHusbandName}
    - Property: House No. ${details.houseNo}, Mohalla ${details.mohalla}, Ward ${details.wardNo}
    - Annual Valuation (ARV): ${details.annualValuation}
    - Arrears: ${details.arrears}
    - Interest Rate: ${details.interestRate}
    - Description: ${details.description}

    INSTRUCTIONS:
    1.  Perform Calculations:
        - houseTax = ARV * 0.10 (10% of ARV)
        - waterTax = ARV * 0.025 (2.5% of ARV)
        - interest = Arrears * (Interest Rate / 100)
        - totalAmount = houseTax + waterTax + Arrears + interest
    2.  Generate 'totalInWords' in Hindi.
    3.  Return a single JSON object with the final calculated bill data. DO NOT generate a letter.

    OUTPUT JSON SCHEMA:
    { "billData": { "taxpayerName": string, "fatherHusbandName": string, "houseNo": string, "mohalla": string, "wardNo": string, "annualValuation": number, "arrears": number, "interestRate": number, "description": string, "houseTax": number, "waterTax": number, "interest": number, "totalAmount": number, "totalInWords": string } }
  `;
  const response = await ai.models.generateContent({ model, contents: prompt, config: { responseMimeType: "application/json" } });
  
  if (response.text) {
    const result = JSON.parse(response.text);
    return {
      departmentName: "नगर पालिका परिषद, महोबा",
      officeName: "कर विभाग",
      location: "महोबा",
      dispatchNo: `कर/${new Date().getFullYear()}/${Math.floor(Math.random() * 1000) + 1}`,
      date: new Date().toLocaleDateString('en-GB').replace(/\//g, '.'),
      senderName: "अधिशासी अधिकारी",
      senderDesignation: "नगर पालिका परिषद महोबा",
      billData: result.billData,
      // Default values for FormData
      hasReference: false, subjectTemplateId: 'GENERAL', subjectData: {}, introType: 'GENERAL', factText: '', ruleText: 'RULE_GEN', decisionType: 'DEC_FWD', copyTo: []
    } as FormData;
  }
  throw new Error("House Tax Bill generation failed");
};

// --- NEW FEATURE: DEMAND NOTICE GENERATOR ---
export const generateDemandNotice = async (details: DemandNoticeData): Promise<FormData> => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    ROLE: Legal Clerk, Nagar Palika Parishad, Mahoba.
    TASK: Generate a formal House Tax Demand Notice letter ('मांग पत्र').
    
    ${AI_DRAFTING_RULES}

    INPUT DATA:
    - Taxpayer: ${details.taxpayerName} s/o ${details.fatherHusbandName}
    - Address: ${details.address}
    - Property: House No. ${details.houseNo}, Mohalla ${details.mohalla}, Ward ${details.wardNo}
    - Bill Reference: No. ${details.billRefNo}, Date ${details.billRefDate}
    - Amount Due: ${details.amountDue}
    - Due Date: ${details.dueDate}

    INSTRUCTIONS:
    1.  Create the 'factText' for a formal demand letter.
    2.  The letter must state the total amount due and reference the original bill.
    3.  It must strictly warn the recipient to pay by the due date.
    4.  Mention that failure to pay will result in penalties/legal action as per the UP Municipalities Act, 1916.
    5.  Apply rich formatting (bold/underline) to all key details.
    6.  Return a single JSON object containing the 'factText'.

    OUTPUT JSON SCHEMA:
    { "factText": string }
  `;

  const response = await ai.models.generateContent({ model, contents: prompt, config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { factText: { type: Type.STRING } } } } });
  
  if (response.text) {
    const result = JSON.parse(response.text);
    return {
      departmentName: "नगर पालिका परिषद, महोबा",
      officeName: "कर विभाग",
      location: "महोबा",
      dispatchNo: `मांग-सूचना/${new Date().getFullYear()}/${Math.floor(Math.random() * 1000) + 1}`,
      date: new Date().toLocaleDateString('en-GB').replace(/\//g, '.'),
      senderName: "अधिशासी अधिकारी",
      senderDesignation: "नगर पालिका परिषद महोबा",
      addresseeName: details.taxpayerName,
      addresseeDept: details.address,
      hasReference: true,
      refLetterNo: details.billRefNo,
      refDate: details.billRefDate,
      subjectTemplateId: 'GENERAL',
      subjectData: { subject: `बकाया गृहकर धनराशि रु. ${details.amountDue} जमा करने के संबंध में।` },
      factText: result.factText,
      introType: 'REF_BASED',
      ruleText: 'RULE_GEN',
      decisionType: 'DEC_STRICT',
      copyTo: ["संबंधित वार्ड प्रभारी, वसूली सुनिश्चित करने हेतु।"]
    } as FormData;
  }
  throw new Error("Demand Notice generation failed");
};


// --- IMAGE/PDF GENERATION ---
export const generateFullDraftWithAI = async (base64Data: string, userInstruction: string, mimeType: string = 'image/jpeg'): Promise<{type: DraftType, data: FormData}> => {
  const model = "gemini-3-pro-preview"; 
  const prompt = `
    ROLE: Senior Director (Municipal Secretariat) for Municipalities.
    MISSION: Generate a professional government draft on behalf of a MUNICIPAL SECRETARIAT.
    LAWS: Adhere strictly to the 'Uttar Pradesh Municipalities Act, 1916'.
    USER COMMAND: "${userInstruction}".
    ${AI_DRAFTING_RULES}
    Output MUST be a valid JSON matching this exact schema:
    { "type": "LETTER" | "ORDER" | "NOTE_SHEET" | "MEMO" | "PROPOSAL", "data": { "departmentName": "e.g. 'नगर पालिका परिषद् सचिवालय'", "officeName": "e.g. 'प्रशासनिक एवं स्थापना अनुभाग'", "location": "District Name", "dispatchNo": "e.g. 'सचि./स्था./2025/104'", "date": "Current Date", "hasReference": true, "refLetterNo": "Ref No from document", "refDate": "Ref Date from document", "subjectTemplateId": "GENERAL", "subjectData": { "subject": "Formal Comprehensive Subject in Hindi" }, "addresseeName": "Recipient Designation", "addresseeDept": "Recipient Office/Dept", "senderName": "Official Designation Placeholder Name", "senderDesignation": "e.g. 'अधिशासी अधिकारी' or 'नगर आयुक्त'", "introType": "REF_BASED", "factText": "Comprehensive, legally-sound body text (Pure Hindi) with HTML formatting.", "ruleText": "RULE_GEN", "decisionType": "DEC_APPROVE", "copyTo": ["Generated CC List"] } }
  `;
  const response = await ai.models.generateContent({ model, contents: { parts: [ { inlineData: { mimeType: mimeType, data: base64Data } }, { text: prompt } ] }, config: { responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 4000 } } });
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
    ${AI_DRAFTING_RULES}
    CURRENT DRAFT DATA:
    ${JSON.stringify(currentData, null, 2)}
    INSTRUCTIONS:
    1. Apply requested changes to 'factText' or other fields, following all AI DRAFTING RULES.
    2. Return the UPDATED JSON only.
  `;
  const response = await ai.models.generateContent({ model, contents: prompt, config: { responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 2000 } } });
  if (response.text) {
    return JSON.parse(response.text) as FormData;
  }
  throw new Error("Secretariat update failed");
};

export const generateDraftFromAnalysis = async (base64Data: string, actionType: DraftType, intent: string, mimeType: string = 'image/jpeg'): Promise<FormData> => {
  const model = "gemini-3-flash-preview";
  const prompt = `Act as a Municipal Secretariat Expert. Generate a professional draft for "${actionType}" based on "${intent}". Use terminology from UP Municipalities Act, 1916. Output JSON matching the FormData schema.`;
  const response = await ai.models.generateContent({ model, contents: { parts: [ { inlineData: { mimeType: mimeType, data: base64Data } }, { text: prompt } ] }, config: { responseMimeType: "application/json" } });
  if (response.text) {
    return JSON.parse(response.text) as FormData;
  }
  throw new Error("Failed to generate secretariat draft");
};

export const createExpertChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
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