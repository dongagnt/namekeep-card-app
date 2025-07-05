import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const OCR = ({ onExtract }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [highlightedText, setHighlightedText] = useState('');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'kor+eng+jpn+chi_sim');
      extractAndAddCard(text, reader.result);
      setHighlightedText(highlightFields(text));
    } catch (error) {
      console.error('OCR 실패:', error);
      setHighlightedText('<p>텍스트 인식 실패</p>');
    } finally {
      setLoading(false);
    }
  };

  const highlightFields = (text) => {
    let html = text;
    const patterns = [
      { regex: /^[가-힣]{2,}$/gm, style: 'color:#3f51b5;font-weight:bold;font-size:18px;' }, // 이름
      { regex: /(대표|이사|팀장|과장|CEO|Manager|Director)/gi, style: 'color:#2e7d32;font-weight:bold;' }, // 직책
      { regex: /(㈜|회사|PT\.|CO|CORP|INC|GROUP|ENTERPRISE)/gi, style: 'color:#00838f;font-weight:bold;' }, // 회사
      { regex: /(도|시|구|동|로|길|주소)[^\n]*/gi, style: 'background:#fff9c4;' }, // 주소
      { regex: /(T|TEL)[^\d]*(\d{2,4}[^\d]?\d{3,4}[^\d]?\d{4})/gi, style: 'color:#f57c00;font-weight:bold;' }, // 전화
      { regex: /(M|H|휴대폰|핸드폰)[^\d]*(\d{2,4}[^\d]?\d{3,4}[^\d]?\d{4})/gi, style: 'color:#e91e63;font-weight:bold;' }, // 휴대폰
      { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi, style: 'background:#ffecb3;color:#000;' }, // 이메일
      { regex: /(https?:\/\/[^\s]+|www\.[^\s]+)/gi, style: 'background:#c8e6c9;color:#000;' } // 홈페이지
    ];
    patterns.forEach(({ regex, style }) => {
      html = html.replace(regex, match => `<span style="${style}">${match}</span>`);
    });
    return html.replace(/\n/g, '<br>');
  };

  const extractAndAddCard = (text, image) => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const name = lines.find(l => /^[가-힣A-Za-z]{2,}$/.test(l)) || '';
    const position = lines.find(l => /(대표|이사|팀장|과장|CEO|Manager)/i) || '';
    const company = lines.find(l => /(㈜|회사|PT\.|CO|CORP|INC)/i) || '';
    const address = lines.find(l => /(도|시|구|동|로|길|주소)/) || '';
    const phoneMatch = text.match(/(T|TEL)[^\d]*(\d{2,4}[^\d]?\d{3,4}[^\d]?\d{4})/i);
    const mobileMatch = text.match(/(M|H|휴대폰|핸드폰)[^\d]*(\d{2,4}[^\d]?\d{3,4}[^\d]?\d{4})/i);
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
    const websiteMatch = text.match(/(https?:\/\/[^\s]+|www\.[^\s]+)/);

    const card = {
      id: Date.now(),
      image,
      name,
      position,
      company,
      address,
      mobile: mobileMatch?.[2] || '',
      phone: phoneMatch?.[2] || '',
      email: emailMatch?.[0] || '',
      website: websiteMatch?.[0] || ''
    };
    onExtract(card);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📷 명함 이미지 OCR</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} style={styles.input} />
      {preview && <img src={preview} alt="명함 이미지" style={styles.image} />}
      {loading ? (
        <p style={styles.status}>⏳ 텍스트 인식 중...</p>
      ) : (
        <div style={styles.result} dangerouslySetInnerHTML={{ __html: highlightedText }} />
      )}
    </div>
  );
};

const styles = {
  container: { margin: '20px 0', padding: '15px', border: '1px dashed #ccc', borderRadius: '8px' },
  title: { marginBottom: '10px', color: '#f60' },
  input: { marginBottom: '10px' },
  image: { maxWidth: '100%', borderRadius: '5px', marginBottom: '10px' },
  status: { fontSize: '14px', backgroundColor: '#fdf4ea', padding: '10px', borderRadius: '5px' },
  result: { background: '#fafafa', padding: '12px', borderRadius: '6px', fontSize: '14px', lineHeight: '1.6' }
};

export default OCR;
