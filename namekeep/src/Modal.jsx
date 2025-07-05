import React, { useState } from 'react';

const Modal = ({ card, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...card });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.heading}>📝 명함 정보 수정</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="name" value={form.name || ''} onChange={handleChange} placeholder="이름" style={styles.input} />
          <input name="position" value={form.position || ''} onChange={handleChange} placeholder="직책" style={styles.input} />
          <input name="company" value={form.company || ''} onChange={handleChange} placeholder="회사명" style={styles.input} />
          <input name="address" value={form.address || ''} onChange={handleChange} placeholder="주소" style={styles.input} />
          <input name="mobile" value={form.mobile || ''} onChange={handleChange} placeholder="핸드폰" style={styles.input} />
          <input name="phone" value={form.phone || ''} onChange={handleChange} placeholder="전화번호" style={styles.input} />
          <input name="email" value={form.email || ''} onChange={handleChange} placeholder="이메일" style={styles.input} />
          <input name="website" value={form.website || ''} onChange={handleChange} placeholder="홈페이지" style={styles.input} />

          <div style={styles.actions}>
            <button type="submit" style={styles.save}>💾 저장</button>
            <button type="button" onClick={onCancel} style={styles.cancel}>❌ 취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '320px',
    boxShadow: '0 0 12px rgba(0,0,0,0.3)'
  },
  heading: {
    marginBottom: '15px',
    color: '#f60',
    fontSize: '18px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  input: {
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '12px'
  },
  save: {
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer'
  },
  cancel: {
    backgroundColor: '#bbb',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer'
  }
};

export default Modal;
