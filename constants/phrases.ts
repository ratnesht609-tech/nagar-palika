

import { DraftType, SubjectTemplate } from '../types';

export const DRAFT_TYPES = [
  { id: DraftType.LETTER, label: 'शासकीय पत्र', desc: 'Official Letter' },
  { id: DraftType.ORDER, label: 'कार्यालय आदेश', desc: 'Office Order' },
  { id: DraftType.MEMO, label: 'कार्यालय ज्ञापन', desc: 'Office Memorandum' },
  { id: DraftType.PRAKASHAN, label: 'प्रकाशन सूचना', desc: 'Publication Notice'},
  { id: DraftType.HOUSE_TAX, label: 'गृहकर बिल', desc: 'House Tax Bill' },
  { id: DraftType.DEMAND_NOTICE, label: 'मांग पत्र', desc: 'Demand Notice' },
  { id: DraftType.NOTE_SHEET, label: 'नोटशीट', desc: 'Note Sheet' },
  { id: DraftType.PROPOSAL, label: 'प्रस्ताव', desc: 'Proposal' },
];

export const SUBJECT_TEMPLATES: SubjectTemplate[] = [
  {
    id: 'GENERAL',
    label: 'सामान्य / अन्य (General)',
    template: '{subject}',
    fields: [
      { key: 'subject', label: 'विषय (Subject)', placeholder: 'विषय यहाँ लिखें...' }
    ]
  },
  {
    id: 'TRANSFER',
    label: 'स्थानांतरण के संबंध में',
    template: 'श्री/श्रीमती {name}, {designation} के स्थानांतरण/पदस्थापना के संबंध में।',
    fields: [
      { key: 'name', label: 'कर्मचारी का नाम', placeholder: 'उदा. रमेश कुमार' },
      { key: 'designation', label: 'पदनाम', placeholder: 'उदा. सहायक ग्रेड-3' }
    ]
  },
  {
    id: 'LEAVE',
    label: 'अवकाश स्वीकृति हेतु',
    template: 'श्री/श्रीमती {name}, {designation} के {leaveType} अवकाश आवेदन के संबंध में।',
    fields: [
      { key: 'name', label: 'आवेदक का नाम', placeholder: 'उदा. सुरेश सिंह' },
      { key: 'designation', label: 'पदनाम', placeholder: 'उदा. अनुभाग अधिकारी' },
      { key: 'leaveType', label: 'अवकाश का प्रकार', placeholder: 'उदा. अर्जित/चिकित्सा' }
    ]
  },
  {
    id: 'EXPLANATION',
    label: 'स्पष्टीकरण (Show Cause)',
    template: 'श्री/श्रीमती {name}, {designation} के विरुद्ध अनुशासनात्मक कार्यवाही/स्पष्टीकरण के संबंध में।',
    fields: [
      { key: 'name', label: 'संबंधित कर्मचारी', placeholder: 'नाम दर्ज करें' },
      { key: 'designation', label: 'पदनाम', placeholder: 'पदनाम दर्ज करें' }
    ]
  },
  {
    id: 'SUPPLY',
    label: 'सामग्री क्रय/आपूर्ति',
    template: 'कार्यालय हेतु {item} के क्रय/आपूर्ति के संबंध में।',
    fields: [
      { key: 'item', label: 'सामग्री का नाम', placeholder: 'उदा. स्टेशनरी/कंप्यूटर' }
    ]
  },
  {
    id: 'MEETING',
    label: 'बैठक सूचना',
    template: 'दिनांक {date} को आयोजित {topic} विषयक बैठक के संबंध में।',
    fields: [
      { key: 'date', label: 'बैठक दिनांक', placeholder: 'DD-MM-YYYY', type: 'date' },
      { key: 'topic', label: 'बैठक का विषय', placeholder: 'उदा. समीक्षा' }
    ]
  }
];

export const PHRASES = {
  [DraftType.LETTER]: {
    openers: [
      { id: 'DIRECT_CMD', text: 'उपर्युक्त विषय के संदर्भ में मुझे यह कहने का निदेश हुआ है कि' },
      { id: 'REF_BASED', text: 'कृपया उपर्युक्त विषय एवं संदर्भित पत्र का अवलोकन करने का कष्ट करें। इस संबंध में लेख है कि' },
      { id: 'GENERAL', text: 'उपर्युक्त विषय के संबंध में अवगत कराना है कि' },
    ],
    closers: [
      { id: 'FAITHFULLY', text: 'भवदीय,' },
    ]
  },
  [DraftType.ORDER]: {
    openers: [
      { id: 'ORDER_STD', text: 'एतद्वारा प्रशासनिक दृष्टिकोण से निम्नलिखित आदेश तत्काल प्रभाव से जारी किए जाते हैं:' },
      { id: 'ORDER_SANCTION', text: 'एतद्वारा सक्षम प्राधिकारी की स्वीकृति के अनुक्रम में निम्नलिखित व्यय की स्वीकृति प्रदान की जाती है:' },
    ],
    closers: [
      { id: 'ORDER_BY', text: 'हस्ताक्षर' }, // Actually usually just signature block
    ]
  },
  [DraftType.MEMO]: {
    openers: [
      { id: 'MEMO_INFORM', text: 'अधोहस्ताक्षरी को यह सूचित करने का निदेश हुआ है कि' },
      { id: 'MEMO_EXPLAIN', text: 'संबंधित कर्मचारी को निर्देशित किया जाता है कि वे अपना स्पष्टीकरण ३ दिवस के भीतर प्रस्तुत करें।' },
    ],
    closers: [
      { id: 'CMD_BY', text: 'आज्ञा से,' },
    ]
  },
  [DraftType.PRAKASHAN]: {
    openers: [],
    closers: []
  },
  [DraftType.HOUSE_TAX]: {
    openers: [],
    closers: []
  },
  [DraftType.DEMAND_NOTICE]: {
    openers: [
        { id: 'REF_BASED', text: 'कृपया उपर्युक्त विषय एवं संदर्भित पत्र का अवलोकन करने का कष्ट करें। इस संबंध में लेख है कि' },
        { id: 'GENERAL', text: 'उपर्युक्त विषय के संबंध में आपको सूचित किया जाता है कि' },
    ],
    closers: []
  },
  [DraftType.NOTE_SHEET]: {
    openers: [
      { id: 'NOTE_PUTUP', text: 'प्रस्तुत प्रकरण ________ के संबंध में है।' },
      { id: 'NOTE_RULE', text: 'नियमानुसार स्थिति यह है कि' },
    ],
    closers: [
      { id: 'NOTE_SUBMIT', text: 'अवलोकनार्थ एवं अनुमोदनार्थ प्रस्तुत।' },
    ]
  },
  [DraftType.PROPOSAL]: {
     openers: [
      { id: 'PROP_INTRO', text: 'विभागीय कार्यों के सुचारू संचालन हेतु निम्नलिखित प्रस्ताव सक्षम अनुमोदन हेतु प्रस्तुत है।' },
    ],
    closers: [
      { id: 'PROP_END', text: 'अतः उक्त प्रस्ताव पर प्रशासनिक एवं वित्तीय स्वीकृति अपेक्षित है।' },
    ]
  }
};

export const COMMON_PHRASES = {
  reference: 'संदर्भ: इस कार्यालय का पत्र क्रमांक {refNo} दिनांक {refDate} के क्रम में।',
  rules: [
    { id: 'RULE_GEN', text: 'उक्त कार्यवाही नियमानुसार एवं निर्धारित प्रक्रिया के तहत की गई है।' },
    { id: 'RULE_FIN', text: 'उक्त व्यय हेतु बजट शीर्ष ____ में पर्याप्त प्रावधान उपलब्ध है।' },
    { id: 'RULE_ABS', text: 'संबंधित कर्मचारी अनाधिकृत रूप से कार्य से अनुपस्थित हैं, जो कि सेवा नियमों के विपरीत है।' },
  ],
  decisions: [
    { id: 'DEC_APPROVE', text: 'अतः प्रकरण में सक्षम स्वीकृति प्रदान की जाती है।' },
    { id: 'DEC_REJECT', text: 'अतः प्रस्तुत प्रस्ताव को नियमानुसार न होने के कारण अमान्य किया जाता है।' },
    { id: 'DEC_FWD', text: 'आवश्यक कार्यवाही हेतु प्रेषित।' },
    { id: 'DEC_STRICT', text: 'भविष्य के लिए सचेत किया जाता है कि पुनरावृत्ति न हो।' },
  ],
  endings: [
    { id: 'END_STD', text: 'अतः उपर्युक्त के आलोक में आवश्यक कार्यवाही सुनिश्चित करें।' },
    { id: 'END_ORDER', text: 'आदेशानुसार, इसे तत्काल प्रभाव से लागू माना जावे।' },
    { id: 'END_REQ', text: 'अनुरोध है कि वांछित जानकारी शीघ्र उपलब्ध कराने का कष्ट करें।' },
  ]
};
