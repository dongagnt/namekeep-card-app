import React from 'react';
import { downloadCSV } from './exportCSV';

function ExportCSV({ cards }) {
  return (
    <div style={{ marginTop: '20px' }}>
      <button onClick={() => downloadCSV(cards)}>📤 CSV로 내보내기</button>
    </div>
  );
}

export default ExportCSV;
