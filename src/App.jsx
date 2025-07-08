import React, { useState } from "react";
import { jsPDF } from "jspdf";
import Tesseract from "tesseract.js";
import CardShareModal from "./components/CardShareModal";
// QRCodeCanvas import 제거 (사용하지 않음)

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
    const surnames = ["kim", "lee", "park", "choi", "jung", "lim", "song", "sung", "jun", "jang", "yoo", "cho"];

    lines.forEach((text) => {
      const lower = text.toLowerCase();

      const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
      if (emailMatch && !parsedInfo.email) parsedInfo.email = emailMatch[0];

      if (!text.includes("@") && /(www\.|https?:\/\/|\.com|\.net|\.org)/i.test(lower)) {
        if (!parsedInfo.website) parsedInfo.website = text;
      }

      if (/mobile|cell|핸드폰|m[: ]/i.test(lower)) {
        const mobNum = text.match(/(\+?\d[\d\s\-()]{9,})/);  // 불필요한 이스케이프 제거
        if (mobNum && !parsedInfo.mobile) parsedInfo.mobile = mobNum[0];
      }

      if (/tel|전화|contact/i.test(lower)) {
        const phoneNum = text.match(/(\+?\d[\d\s\-()]{9,})/);  // 불필요한 이스케이프 제거
        if (phoneNum && !parsedInfo.phone) parsedInfo.phone = phoneNum[0];
      }

      if (/(co\.|inc|company|기업|조직)/i.test(text) && !parsedInfo.company) {
        parsedInfo.company = text;
      }

      if (/(seoul|korea|street|road|동|구)/i.test(lower)) {
        parsedInfo.address = parsedInfo.address ? parsedInfo.address + " " + text : text;
      }

      const wordCount = text.trim().split(" ").length;
      const firstWord = text.split(" ")[0].toLowerCase();
      if (
        /^[A-Z\s\-]{3,}$/.test(text) &&
        wordCount >= 2 &&
        surnames.includes(firstWord) &&
        !parsedInfo.name
      ) {
        parsedInfo.name = text.trim();
      }
    });

    setCardInfo(parsedInfo);
  };

  const translateToEnglish = async (text) => {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|en`);
    const json = await res.json();
    return json.responseData?.translatedText || text;
  };

  const generateCSV = async () => {
    if (cardList.length === 0) return;

    const header = ["name", "name_en", "company", "company_en", "mobile", "phone", "email", "address", "address_en", "website"];
    const rows = await Promise.all(cardList.map(async (card) => [
      card.name,
      await translateToEnglish(card.name),
      card.company,
      await translateToEnglish(card.company),
      card.mobile,
      card.phone,
      card.email,
      card.address,
      await translateToEnglish(card.address),
      card.website
    ]));

    const csvContent = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const filename = `${cardList[0].name?.replaceAll(" ", "_") || "namelist"}_translated.csv`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor("#d35400");
    doc.text("🧾 NameKeep 명함 정보", 20, 20);

    let y = 30;
    const infoList = [
      ["Name", selectedCard?.name],
      ["Company", selectedCard?.company],
      ["Mobile", selectedCard?.mobile],
      ["Phone", selectedCard?.phone],
      ["Email", selectedCard?.email],
      ["Address", selectedCard?.address],
      ["Website", selectedCard?.website]
    ];

    doc.setFontSize(12);
    doc.setTextColor("#555");
    infoList.forEach(([label, value]) => {
      doc.text(`${label}: ${value || ""}`, 20, y);
      y += 10;
    });

    doc.save(`${selectedCard?.name || "card"}_명함.pdf`);
  };
  
  return (
    <div style={{
      padding: "20px",
      maxWidth: "700px",
      margin: "auto",
      fontFamily: "sans-serif",
      backgroundColor: "#fff8f2"
    }}>
      <h1 style={{
        textAlign: "center",
        marginBottom: "20px",
        color: "#e67e22"
      }}>
        🍊 NameKeep 명함 앱
      </h1>

      {/* 입력 필드 */}
      <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
        {["name", "company", "mobile", "phone", "email", "address", "website"].map((field) => (
          <input
            key={field}
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

      {/* 파일 업로드 */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ marginBottom: "20px" }}
      />

      {/* 버튼 영역 */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button onClick={addCard} style={btnStyle("#e67e22")}>➕ 명함 추가</button>
        <button onClick={generateCSV} style={btnStyle("#f39c12")}>📄 CSV 저장</button>
      </div>

      {/* 명함 목록 */}
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
              <img
                src={card.preview}
                alt="명함 이미지"
                style={{
                  width: "120px",
                  marginTop: "10px",
                  borderRadius: "6px"
                }}
              />
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

      {/* 모달 */}
      <CardShareModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        cardInfo={selectedCard || {}}
        generatePDF={generatePDF}
      />
    </div>
  );
}

// 버튼 스타일 함수
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