import { FormData, DraftType } from '../types';
import { SUBJECT_TEMPLATES, PHRASES, COMMON_PHRASES } from '../constants/phrases';

export const toHindiDigits = (str: string): string => {
  const map: Record<string, string> = {
    '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
    '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
  };
  return str.replace(/\d/g, (match) => map[match] || match);
};

export const generateDraft = (type: DraftType, data: FormData): string => {
  const subjectTemplate = SUBJECT_TEMPLATES.find(t => t.id === data.subjectTemplateId);
  let subjectText = "विषय उपलब्ध नहीं है";

  if (subjectTemplate) {
    subjectText = subjectTemplate.template;
    Object.entries(data.subjectData).forEach(([key, value]) => {
      subjectText = subjectText.replace(`{${key}}`, value || '_______');
    });
  }

  const opener = PHRASES[type]?.openers.find(o => o.id === data.introType)?.text || '';
  const rule = COMMON_PHRASES.rules.find(r => r.id === data.ruleText)?.text || '';
  const decision = COMMON_PHRASES.decisions.find(d => d.id === data.decisionType)?.text || '';
  const ending = COMMON_PHRASES.endings.find(e => e.id === 'END_STD')?.text || '';

  let referenceText = '';
  if (data.hasReference && data.refLetterNo && data.refDate) {
    referenceText = COMMON_PHRASES.reference
      .replace('{refNo}', data.refLetterNo)
      .replace('{refDate}', data.refDate);
  }

  const bodyParagraphs = [
    opener,
    data.factText,
    rule,
    decision,
    ending
  ].filter(p => p && p.trim().length > 0);

  const renderedBody = bodyParagraphs.map(p => 
    `<p style="text-align: justify; text-justify: inter-word; margin-bottom: 15px; line-height: 1.6; text-indent: 40px;">${p}</p>`
  ).join('');

  const signatureBlock = `
    <table style="width: 100%; margin-top: 40px; border-collapse: collapse;">
      <tr>
        <td style="width: 60%;"></td>
        <td style="width: 40%; text-align: center; vertical-align: top;">
          <div style="margin-bottom: 50px;"></div>
          <p style="font-weight: bold; margin: 0;">(${data.senderName})</p>
          <p style="margin: 0;">${data.senderDesignation}</p>
          <p style="margin: 0;">${data.officeName}</p>
        </td>
      </tr>
    </table>
  `;

  const copyToBlock = data.copyTo.length > 0 ? `
    <div style="margin-top: 30px; border-top: 1px solid #000; pt-20px;">
      <p style="font-weight: bold; margin-bottom: 10px;">प्रतिलिपि: निम्नलिखित को सूचनार्थ एवं आवश्यक कार्यवाही हेतु प्रेषित -</p>
      <ol style="margin-left: 25px; margin-bottom: 20px;">
        ${data.copyTo.map(c => `<li style="margin-bottom: 4px;">${c}</li>`).join('')}
        <li>कार्यालय प्रति।</li>
      </ol>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 60%;"></td>
          <td style="width: 40%; text-align: center;">
            <p style="font-weight: bold; margin: 0;">(${data.senderName})</p>
            <p style="margin: 0;">${data.senderDesignation}</p>
          </td>
        </tr>
      </table>
    </div>
  ` : '';

  // Container styling for A4 feel
  const containerStyle = `
    font-family: 'Noto Serif Devanagari', serif;
    padding: 20mm;
    color: #000;
    background: #fff;
    line-height: 1.5;
    font-size: 12pt;
    width: 210mm;
    min-height: 297mm;
    box-sizing: border-box;
    margin: 0 auto;
  `;

  if (type === DraftType.NOTE_SHEET) {
    return `
      <div style="${containerStyle}">
        <div style="text-align: center; font-weight: bold; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 16pt;">${data.departmentName}</h2>
          <p style="margin: 0; font-size: 12pt;">(टिप्पणी पत्र / नोटशीट)</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="font-weight: bold; padding: 5px 0;">विषय: ${subjectText}</td>
          </tr>
        </table>

        <div style="display: table; width: 100%; border-top: 1px solid #ccc;">
          <div style="display: table-cell; width: 50px; border-right: 1px solid #ccc; vertical-align: top; padding: 10px; font-size: 10pt; color: #666; text-align: center;">
            नम्बर
          </div>
          <div style="display: table-cell; padding: 10px 20px; vertical-align: top;">
            ${renderedBody}
            ${signatureBlock}
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div style="${containerStyle}">
      <!-- Office Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="margin: 0; font-size: 16pt; font-weight: bold;">${data.departmentName}</h2>
        <h3 style="margin: 0; font-size: 14pt; font-weight: bold;">${data.officeName}</h3>
        ${data.location ? `<p style="margin: 5px 0 0 0; font-size: 12pt;">${data.location}</p>` : ''}
      </div>

      <!-- Reference and Date Table (Stable for Copying) -->
      <table style="width: 100%; margin-bottom: 30px; border-collapse: collapse;">
        <tr>
          <td style="text-align: left; vertical-align: bottom;">
            <strong>क्रमांक:</strong> ${data.dispatchNo || '_______'}
          </td>
          <td style="text-align: right; vertical-align: bottom;">
            <strong>दिनांक:</strong> ${data.date || '_______'}
          </td>
        </tr>
      </table>

      <!-- Addressee -->
      ${(type === DraftType.LETTER || type === DraftType.PROPOSAL) ? `
      <div style="margin-bottom: 25px;">
        <p style="font-weight: bold; margin-bottom: 5px;">प्रति,</p>
        <div style="padding-left: 40px;">
          <p style="margin: 0;">${data.addresseeName || 'श्रीमान ...'},</p>
          <p style="margin: 0;">${data.addresseeDept || '...'}</p>
        </div>
      </div>` : ''}

      <!-- Specific Type Titles -->
      ${type === DraftType.ORDER ? `<div style="text-align: center; font-weight: bold; font-size: 14pt; text-decoration: underline; margin-bottom: 25px;">:: आदेश ::</div>` : ''}
      ${type === DraftType.MEMO ? `<div style="text-align: center; font-weight: bold; font-size: 14pt; text-decoration: underline; margin-bottom: 25px;">:: कार्यालय ज्ञापन ::</div>` : ''}

      <!-- Subject Block -->
      <div style="margin-bottom: 25px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 60px; font-weight: bold; vertical-align: top;">विषय:</td>
            <td style="font-weight: bold; text-decoration: underline; text-underline-offset: 4px;">${subjectText}</td>
          </tr>
          ${referenceText ? `
          <tr>
            <td style="width: 60px; font-weight: bold; vertical-align: top; padding-top: 5px;">संदर्भ:</td>
            <td style="padding-top: 5px;">${referenceText}</td>
          </tr>` : ''}
        </table>
      </div>

      <!-- Main Body -->
      <div style="min-height: 100px;">
        ${renderedBody}
      </div>

      <!-- Signature Section -->
      ${signatureBlock}

      <!-- Pratilipi Section -->
      ${copyToBlock}
    </div>
  `;
};
