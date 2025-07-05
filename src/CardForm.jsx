import React, { useState } from 'react';

const CardForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    name: '',
    company: '',
    address: '',
    mobile: '',
    phone: '',
    email: '',
    website: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const newCard = {
      id: Date.now(),
      ...form
    };

    onAdd(newCard);
    setForm({
      name: '',
      company: '',
      address: '',
      mobile: '',
      phone: '',
      email: '',
      website: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>✍️ 명함 정보 입력</h2>

      <input name="name" value={form.name} onChange={handleChange} placeholder="이름" style={styles.input} />
      <input name="company" value={form.company} onChange={handleChange} placeholder="회사명" style={styles.input} />
      <input name="address" value={form.address} onChange={handleChange} placeholder="주소" style={styles.input} />
      <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="핸드폰" style={styles.input} />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="전화번호" style={styles.input} />
      <input name="email" value={form.email} onChange={handleChange} placeholder="이메일" style={styles.input} />
      <input name="website" value={form.website} onChange={handleChange} placeholder="홈페이지" style={styles.input} />

      <button type="submit" style={styles.button}>➕ 추가</button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px'
  },
  heading: {
    color: '#f60'
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  button: {
    padding: '10px',
    backgroundColor: '#f60',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default CardForm;
