

import { FormData, DraftType } from '../types';
import { SUBJECT_TEMPLATES, PHRASES, COMMON_PHRASES } from '../constants/phrases';

export const toHindiDigits = (str: string): string => {
  if (!str) return '';
  const map: Record<string, string> = {
    '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
    '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
  };
  return String(str).replace(/[0-9]/g, (match) => map[match] || match);
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

  const renderedBody = data.factText.split('\n\n').map(p =>
    `<p style="text-align: justify; text-justify: inter-word; margin-bottom: 15px; line-height: 1.7; text-indent: 40px;">${p}</p>`
  ).join('');
  
  const signatureBlock = (isCopyTo = false, name?: string, designation?: string) => `
    <table style="width: 100%; margin-top: ${isCopyTo ? '0' : '50px'}; border-collapse: collapse;">
      <tr>
        <td style="width: 60%;"></td>
        <td style="width: 40%; text-align: center; vertical-align: top;">
          ${!isCopyTo ? '<div style="margin-bottom: 60px;"></div>' : ''}
          <p style="font-weight: bold; margin: 0;">${name || data.senderName}</p>
          <p style="margin: 0;">${designation || data.senderDesignation}</p>
          ${!isCopyTo && data.officeName ? `<p style="margin: 0;">${data.officeName}</p>` : ''}
        </td>
      </tr>
    </table>
  `;

  const copyToBlock = data.copyTo && data.copyTo.length > 0 ? `
    <div style="margin-top: 40px; ${type !== DraftType.PRAKASHAN ? `border-top: 1px solid #000;` : ''} padding-top: 20px;">
      <p style="font-weight: bold; margin-bottom: 10px;">प्रतिलिपि:-</p>
      <ol style="margin: 0; padding-left: 25px; list-style-type: decimal;">
        ${data.copyTo.map(c => `<li style="margin-bottom: 8px; padding-left: 5px;">${c}</li>`).join('')}
      </ol>
      ${signatureBlock(true)}
    </div>
  ` : '';

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

  if (type === DraftType.HOUSE_TAX) {
    const bill = data.billData;
    return `
      <div style="${containerStyle}">
        <div style="border: 2px solid #000; padding: 15px; background: #f9f9f9;">
          <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
            <h2 style="margin: 0; font-size: 18pt; font-weight: bold;">${data.departmentName}</h2>
            <h3 style="margin: 5px 0; font-size: 14pt; font-weight: bold;">गृहकर बिल (House Tax Bill)</h3>
            <p style="margin: 0;">${bill.description || `वित्तीय वर्ष ${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(2)}`}</p>
          </div>

          <table style="width: 100%; margin-bottom: 15px; border-collapse: collapse;">
            <tr>
              <td><strong>बिल संख्या:</strong> ${data.dispatchNo}</td>
              <td style="text-align: right;"><strong>दिनांक:</strong> ${data.date}</td>
            </tr>
          </table>

          <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px; background: #fff;">
            <h4 style="margin: 0 0 10px 0; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">करदाता का विवरण</h4>
            <table style="width: 100%; font-size: 11pt;">
              <tr><td style="width: 150px;"><strong>नाम:</strong></td><td>${bill.taxpayerName}</td></tr>
              <tr><td><strong>पिता/पति का नाम:</strong></td><td>${bill.fatherHusbandName}</td></tr>
              <tr><td><strong>भवन संख्या:</strong></td><td>${toHindiDigits(bill.houseNo)}</td></tr>
              <tr><td><strong>मोहल्ला/वार्ड:</strong></td><td>${bill.mohalla}, वार्ड-${toHindiDigits(bill.wardNo)}</td></tr>
            </table>
          </div>

          <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px; background: #fff;">
            <h4 style="margin: 0 0 10px 0; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">कर का विवरण एवं गणना</h4>
            <table style="width: 100%; font-size: 11pt; border-collapse: collapse;">
              <thead style="background: #eee;">
                <tr>
                  <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">विवरण</th>
                  <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">धनराशि (रु.)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">वार्षिक मूल्यांकन (ARV)</td><td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${toHindiDigits(bill.annualValuation.toFixed(2))}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">गृहकर (ARV का 10%)</td><td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${toHindiDigits(bill.houseTax.toFixed(2))}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">जलकर (ARV का 2.5%)</td><td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${toHindiDigits(bill.waterTax.toFixed(2))}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">गत वर्ष का बकाया</td><td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${toHindiDigits(bill.arrears.toFixed(2))}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">बकाया पर ब्याज (@${toHindiDigits(String(bill.interestRate))}%)</td><td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${toHindiDigits(bill.interest.toFixed(2))}</td></tr>
                <tr style="background: #e6f7ff; font-weight: bold; font-size: 13pt;">
                  <td style="padding: 10px; border: 1px solid #91d5ff;">कुल देय धनराशि</td>
                  <td style="text-align: right; padding: 10px; border: 1px solid #91d5ff;">रु. ${toHindiDigits(bill.totalAmount.toFixed(2))}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p style="margin-top: 15px;"><strong>कुल राशि शब्दों में:</strong> ${bill.totalInWords}</p>
          <p style="font-size: 10pt; text-align: center; margin-top: 20px;">कृपया बिल प्राप्ति के 15 दिवस के अन्दर भुगतान सुनिश्चित करें।</p>
          
          ${signatureBlock(false, "कर अधीक्षक", data.departmentName)}
        </div>
      </div>
    `;
  }

  if (type === DraftType.PRAKASHAN) {
     return `
      <div style="${containerStyle}">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 16pt; font-weight: bold;">${data.departmentName}</h2>
        </div>
         <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">
          <tr>
            <td style="text-align: left; vertical-align: bottom;">
              <strong>पत्रांक:</strong> ${data.dispatchNo || '_______'}
            </td>
            <td style="text-align: right; vertical-align: bottom;">
              <strong>दिनांक:</strong> ${data.date || '_______'}
            </td>
          </tr>
        </table>
        <div style="text-align: center; margin-bottom: 20px;">
            <p style="margin: 0;">(नगर पालिका अधिनियम 1916 की धारा 147 के अर्न्तगत)</p>
        </div>
        <div style="text-align: center; font-weight: bold; font-size: 14pt; text-decoration: underline; margin-bottom: 25px;">प्रकाशन सूचना</div>
        
        <div style="min-height: 100px;">
          ${renderedBody}
        </div>
        
        ${signatureBlock(false)}
        ${copyToBlock}
      </div>
    `;
  }

  if (type === DraftType.NOTE_SHEET) {
    // ... existing note sheet logic ...
  }

  return `
    <div style="${containerStyle}">
      <!-- Office Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="margin: 0; font-size: 16pt; font-weight: bold;">${data.departmentName}</h2>
        <h3 style="margin: 0; font-size: 14pt; font-weight: bold;">${data.officeName}</h3>
        ${data.location ? `<p style="margin: 5px 0 0 0; font-size: 12pt;">${data.location}</p>` : ''}
      </div>

      <!-- Reference and Date Table -->
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
      ${(type === DraftType.LETTER || type === DraftType.PROPOSAL || type === DraftType.DEMAND_NOTICE) ? `
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
      ${type === DraftType.DEMAND_NOTICE ? `<div style="text-align: center; font-weight: bold; font-size: 14pt; text-decoration: underline; margin-bottom: 25px;">:: मांग सूचना (Demand Notice) ::</div>` : ''}

      <!-- Subject Block -->
      <div style="margin-bottom: 35px;">
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
        ${bodyParagraphs.map(p => 
          `<p style="text-align: justify; text-justify: inter-word; margin-bottom: 15px; line-height: 1.7; text-indent: 40px;">${p}</p>`
        ).join('')}
      </div>

      <!-- Signature Section -->
      ${signatureBlock(false)}

      <!-- Pratilipi Section -->
      ${copyToBlock}
    </div>
  `;
};
