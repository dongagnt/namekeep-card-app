// src/components/CardShareModal.jsx
import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function CardShareModal({ cardInfo, isOpen, onClose, generatePDF }) {
  if (!isOpen) return null;

  const saveQRImage = () => {
    const canvas = document.getElementById("qrCanvas");
    if (!canvas) {
      alert("QR 코드가 아직 렌더링되지 않았습니다");
      return;
    }
    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${cardInfo.name || "business-card"}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const qrText = Object.entries(cardInfo)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        maxWidth: "600px",
        margin: "40px auto",
        zIndex: 999,
        position: "relative"
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📇 명함 공유</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        <div style={{ flex: "1 1 250px" }}>
          {Object.entries(cardInfo).map(([key, value]) => (
            <p key={key}><strong>{key}</strong>: {value}</p>
          ))}
        </div>

        <div style={{ flex: "1 1 250px", textAlign: "center" }}>
          <QRCodeCanvas value={qrText} size={180} id="qrCanvas" />
        </div>
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={generatePDF}>📄 PDF 저장</button>
        <button onClick={saveQRImage}>📷 QR 이미지 저장</button>
        <button onClick={onClose}>❌ 닫기</button>
      </div>
    </div>
  );
}
