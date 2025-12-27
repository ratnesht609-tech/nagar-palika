export enum DraftType {
  LETTER = 'LETTER', // पत्र
  ORDER = 'ORDER', // आदेश
  MEMO = 'MEMO', // कार्यालय ज्ञापन
  NOTE_SHEET = 'NOTE_SHEET', // नोटशीट
  PROPOSAL = 'PROPOSAL', // प्रस्ताव
}

export interface SubjectTemplate {
  id: string;
  label: string;
  template: string; // "श्री/श्रीमती {name} के {action} के संबंध में"
  fields: {
    key: string;
    label: string;
    placeholder: string;
    type?: 'text' | 'date' | 'select';
    options?: string[];
  }[];
}

export interface FormData {
  departmentName: string; // विभाग
  officeName: string; // कार्यालय
  location: string; // स्थान/जिला
  dispatchNo?: string; // पत्रांक
  date?: string; // दिनांक
  
  // Reference
  hasReference: boolean;
  refLetterNo?: string;
  refDate?: string;

  // Subject
  subjectTemplateId: string;
  subjectData: Record<string, string>;

  // Content
  addresseeName?: string; // प्रति (नाम/पद)
  addresseeDept?: string; // प्रति (विभाग/पता)
  
  senderName: string; // प्रेषक नाम
  senderDesignation: string; // प्रेषक पद
  
  // Specific content blocks chosen from dropdowns
  introType: string;
  factText: string;
  ruleText: string;
  decisionType: string;
  
  copyTo: string[]; // प्रतिलिपि
}

export interface PhraseCategory {
  id: string;
  text: string;
}
