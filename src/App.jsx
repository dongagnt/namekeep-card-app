import React, { useState } from "react";
import { jsPDF } from "jspdf";
import Tesseract from "tesseract.js";
import CardShareModal from "./components/CardShareModal";
import { QRCodeCanvas } from "qrcode.react";

function App() {
  const [cardInfo, setCardInfo] = useState({
    name: "", company: "", mobile: "", phone: "", email: "", address: "", website: ""
  });
  const [cardList, setCardList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };

  const addCard = () => {
    const hasValue = Object.values(cardInfo).some((v) => v?.trim());
    if (!hasValue) return;
    setCardList((prev) => [...prev, { ...cardInfo, preview: previewURL }]);
    setCardInfo({ name: "", company: "", mobile: "", phone: "", email: "", address: "", website: "" });
    setPreviewURL(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imgURL = URL.createObjectURL(file);
    setPreviewURL(imgURL);

    Tesseract.recognize(file, "eng+kor+jpn+chi_sim", {
      langPath: "https://tessdata.projectnaptha.com/4.0.0",
      logger: (m) => console.log(m)
    }).then(({ data: { text } }) => {
      parseOCRText(text);
    });
  };

  const parseOCRText = (ocrText) => {
    const lines = ocrText.trim().split("\n");
    const parsedInfo = {};
    const koreanSurnames = ["kim", "lee", "park", "choi", "jung", "lim", "song", "sung", "jun", "jang", "yoo", "cho"];

    lines.forEach((text) => {
      const lower = text.toLowerCase();

      const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
      if (emailMatch && !parsedInfo.email) parsedInfo.email = emailMatch[0];

      if (!text.includes("@") && /(www\.|https?:\/\/|\.com|\.net|\.org)/i.test(lower) && !parsedInfo.website) {
        parsedInfo.website = text;
      }

      if (/mobile|cell|handphone|핸드폰|m[: ]/i.test(lower)) {
        const mobNum = text.match(/(\+?\d[\d\s\-\(\)]{9,})/);
        if (mobNum && !parsedInfo.mobile) parsedInfo.mobile = mobNum[0];
      }

      if (/tel|전화|contact/i.test(lower)) {
        const phoneNum = text.match(/(\+?\d[\d\s\-\(\)]{9,})/);
        if (phoneNum && !parsedInfo.phone) parsedInfo.phone = phoneNum[0];
      }

      if (/(co\.|ltd|pt\.|inc|corp|company|기업|조직|소속)/i.test(text) && !parsedInfo.company) {
        parsedInfo.company = text;
      }

      if (/(seoul|korea|road|ro|dong|구|동|street|city|jakarta|hanoi)/i.test(lower)) {
        parsedInfo.address = parsedInfo.address ? parsedInfo.address + " " + text : text;
      }

      const wordCount = text.trim().split(" ").length;
      const firstWord = text.split(" ")[0].toLowerCase();
      if (
        /^[A-Z\s\-]{3,}$/.test(text) &&
        wordCount >= 2 && wordCount <= 4 &&
        koreanSurnames.includes(firstWord) &&
        !parsedInfo.name
      ) {
        parsedInfo.name = text.trim();
      }
    });

    setCardInfo(parsedInfo);
  };
  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto", fontFamily: "sans-serif", backgroundColor: "#fff8f2" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#e67e22" }}>
        🍊 NameKeep 명함 앱
      </h1>

      <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
        {["name", "company", "mobile", "phone", "email", "address", "website"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            value={cardInfo[field]}
            onChange={handleChange}
            style={{
              padding: "10px",
              fontSize: "15px",
              borderRadius: "6px",
              border: "1px solid #e67e22"
            }}
          />
        ))}
      </div>

      <input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  style={{ marginBottom: "20px" }}
/>

<div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
  <button onClick={addCard} style={btnStyle("#e67e22")}>➕ 명함 추가</button>
  <button onClick={generateCSV} style={btnStyle("#f39c12")}>📄 CSV 저장</button>
</div>

<h3 style={{ color: "#d35400" }}>📂 등록된 명함</h3>

{cardList.length === 0 ? (
  <p>아직 등록된 명함이 없습니다</p>
) : (
  cardList.map((card, idx) => (
    <div key={idx} style={{
      border: "1px solid #d35400",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "6px",
      backgroundColor: "#fff"
    }}>
      <strong>{card.name}</strong> - {card.company}<br />
      {card.preview && (
        <img src={card.preview} alt="명함 이미지" style={{ width: "120px", marginTop: "10px", borderRadius: "6px" }} />
      )}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => {
            setSelectedCard(card);
            setModalOpen(true);
          }}
          style={btnStyle("#3498db")}
        >
          🔗 공유하기
        </button>
      </div>
    </div>
  ))
)}

      <CardShareModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        cardInfo={selectedCard || {}}
        generatePDF={generatePDF}
      />
    </div>
  );
}

const btnStyle = (bg = "#333") => ({
  padding: "10px",
  fontSize: "15px",
  backgroundColor: bg,
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
});

export default App;
