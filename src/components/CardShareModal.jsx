// components/CardShareModal.jsx

import React from "react";
import Modal from "react-modal";
import { QRCodeCanvas } from "qrcode.react"; // ✅ QR 오류 수정된 import

Modal.setAppElement("#root");

function CardShareModal({ isOpen, onClose, cardInfo, generatePDF }) {
  const qrValue = cardInfo.email || cardInfo.website || "https://namekeep.app";

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="명함 공유 모달"
      style={{
        content: {
          maxWidth: "400px",
          margin: "auto",
          padding: "20px",
          borderRadius: "12px"
        }
      }}
    >
      <h2 style={{ color: "#e67e22", marginBottom: "10px" }}>🔗 공유 정보</h2>

      <div style={{ marginBottom: "10px" }}>
        <p><strong>이름:</strong> {cardInfo.name}</p>
        <p><strong>회사:</strong> {cardInfo.company}</p>
        <p><strong>Email:</strong> {cardInfo.email}</p>
        <p><strong>Website:</strong> {cardInfo.website}</p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <QRCodeCanvas
          value={qrValue}
          size={200}
          level="H"
          includeMargin={true}
        />
        <p style={{ fontSize: "12px", marginTop: "6px", color: "#999" }}>
          이메일 또는 웹사이트로 연결됩니다
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        <button onClick={generatePDF} style={btnStyle("#f39c12")}>📄 PDF 저장</button>
        <button onClick={onClose} style={btnStyle("#95a5a6")}>닫기</button>
      </div>
    </Modal>
  );
}

const btnStyle = (bg) => ({
  padding: "10px",
  fontSize: "14px",
  backgroundColor: bg,
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
});

export default CardShareModal;
