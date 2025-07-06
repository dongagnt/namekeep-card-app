// src/App.jsx
import React, { useState } from "react";
import { jsPDF } from "jspdf";
import CardShareModal from "./components/CardShareModal";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    address: "",
    website: ""
  });

  // 명함 정보 입력 핸들링
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };

  // OCR 결과 적용 (예시: 버튼 클릭 시 호출)
  const applyOCRResult = () => {
    const dummyOCRText = `
      이름: KIM JONG UN
      회사명: Pyongyang Industries
      전화번호: 010-1234-5678
      이메일: kim@example.com
      주소: Pyongyang, DPRK
      홈페이지: www.kimcard.com
    `;
    const lines = dummyOCRText.trim().split("\n");
    const parsedInfo = {};
    lines.forEach((line) => {
      const [key, value] = line.split(":").map((s) => s.trim());
      if (key && value) {
        const fieldMap = {
          이름: "name",
          회사명: "company",
          전화번호: "phone",
          이메일: "email",
          주소: "address",
          홈페이지: "website"
        };
        const field = fieldMap[key];
        if (field) parsedInfo[field] = value;
      }
    });
    setCardInfo(parsedInfo);
  };

  // PDF 생성
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("📇 명함 정보", 20, 20);
    let y = 30;
    Object.entries(cardInfo).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 20, y);
      y += 10;
    });
    doc.save(`${cardInfo.name}_명함.pdf`);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>📇 NameKeep 명함 앱</h1>

      {/* 명함 정보 입력 */}
      <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
        {["name", "company", "phone", "email", "address", "website"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            value={cardInfo[field]}
            onChange={handleChange}
            style={{ padding: "10px", fontSize: "15px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        ))}
        <button
          onClick={applyOCRResult}
          style={{
            padding: "10px",
            fontSize: "15px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          🔍 OCR 결과 적용하기
        </button>
      </div>

      {/* 공유 모달 버튼 */}
      <button
        onClick={() => setModalOpen(true)}
        style={{
          width: "100%",
          maxWidth: "400px",
          margin: "0 auto 30px",
          display: "block",
          padding: "12px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        🔗 명함 공유하기
      </button>

      {/* 모달 */}
      {modalOpen && (
        <CardShareModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          cardInfo={cardInfo}
          generatePDF={generatePDF}
        />
      )}
    </div>
  );
}

export default App;
