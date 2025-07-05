import React, { useState, useEffect } from 'react';
import CardForm from './CardForm';
import CardList from './CardList';
import OCR from './OCR';
import { downloadCSV } from './exportCSV';

const App = () => {
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('namecards');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('namecards', JSON.stringify(cards));
  }, [cards]);

  const addCard = (card) => {
    setCards(prev => [...prev, card]);
  };

  const deleteCard = (index) => {
    setCards(prev => prev.filter((_, i) => i !== index));
  };

  const updateCard = (index, updatedCard) => {
    setCards(prev =>
      prev.map((card, i) => (i === index ? updatedCard : card))
    );
  };

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1 style={{ color: '#f60' }}>📇 NameKeep 명함 관리</h1>
      
      <CardForm onAdd={addCard} />
      <OCR onExtract={addCard} />
      <CardList cards={cards} onDelete={deleteCard} onUpdate={updateCard} />
      
      <button
        onClick={() => downloadCSV(cards)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#f60',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        📥 CSV 다운로드
      </button>
    </div>
  );
};

export default App;
