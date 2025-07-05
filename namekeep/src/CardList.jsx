import React, { useState } from 'react';
import Modal from './Modal';

const CardList = ({ cards, onDelete, onUpdate }) => {
  const [search, setSearch] = useState('');
  const [editingCard, setEditingCard] = useState(null);

  // 최신 카드가 맨 위로 오도록 정렬
  const filtered = [...cards].sort((a, b) => b.id - a.id).filter(card =>
    (card.name?.toLowerCase().includes(search.toLowerCase()) ||
     card.company?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = (updated) => {
    const index = cards.findIndex(c => c.id === updated.id);
    if (index !== -1) onUpdate(index, updated);
    setEditingCard(null);
  };

  return (
    <div style={styles.list}>
      <input
        type="text"
        placeholder="🔍 이름 또는 회사명 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {filtered.length === 0 ? (
        <p style={styles.empty}>등록된 명함이 없습니다.</p>
      ) : (
        filtered.map(card => (
          <div key={card.id} style={styles.card}>
            {card.image && <img src={card.image} alt="명함 이미지" style={styles.image} />}
            <CardRow icon="🧑" value={card.name} size="large" />
            <CardRow icon="💼" value={card.position} />
            <CardRow icon="🏭" value={card.company} />
            <CardRow icon="📍" value={card.address} />
            <CardRow icon="📱" value={card.mobile} />
            <CardRow icon="☎️" value={card.phone} />
            <CardRow icon="✉️" value={card.email} />
            <CardRow icon="🌐" value={card.website} />

            <div style={styles.actions}>
              <button style={styles.edit} onClick={() => setEditingCard(card)}>✏️ 수정</button>
              <button style={styles.delete} onClick={() => onDelete(cards.indexOf(card))}>🗑️ 삭제</button>
            </div>
          </div>
        ))
      )}

      {editingCard && (
        <Modal card={editingCard} onSave={handleSave} onCancel={() => setEditingCard(null)} />
      )}
    </div>
  );
};

const CardRow = ({ icon, value, size }) => {
  if (!value) return null;
  return (
    <div style={styles.row}>
      <span style={styles.icon}>{icon}</span>
      <span style={size === 'large' ? styles.largeText : styles.text}>{value}</span>
    </div>
  );
};

const styles = {
  list: { marginTop: '20px' },
  card: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  image: {
    width: '100%',
    borderRadius: '6px',
    marginBottom: '10px'
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px'
  },
  icon: {
    fontSize: '20px',
    width: '24px',
    textAlign: 'center'
  },
  text: {
    fontSize: '15px'
  },
  largeText: {
    fontSize: '18px',
    fontWeight: 'bold'
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  edit: {
    padding: '6px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer'
  },
  delete: {
    padding: '6px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer'
  },
  empty: {
    fontStyle: 'italic',
    color: '#777',
    marginTop: '10px'
  },
  search: {
    padding: '8px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    width: '220px',
    marginBottom: '15px'
  }
};

export default CardList;
