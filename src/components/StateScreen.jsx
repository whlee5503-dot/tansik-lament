import { useState } from "react";
import { I18N } from "../data/i18n";

export default function StateScreen({ pain, onSelect, onBack, theme: C, mode, toggleMode, lang, setLang, goHome }) {
  const [hovered, setHovered] = useState(null);
  const t = I18N[lang];

  const LANG_TABS = [
    { id: "ko", flag: "🇰🇷" },
    { id: "en", flag: "🇺🇸" },
    { id: "id", flag: "🇮🇩" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.textPrim,
      fontFamily: "'Georgia','Noto Serif KR',serif",
    }}>
      {/* 헤더 */}
      <div style={{
        borderBottom: `1px solid ${C.border}`, padding: "14px 20px",
        background: C.surface,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ fontSize: "10px", letterSpacing: "2px", color: C.amber }}>
          {pain.icon} {pain.label}
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{
            fontSize: "20px", padding: "4px 8px",
            border: `1px solid ${C.amber}`,
            borderRadius: "4px", background: C.amberDim,
          }}>
            {LANG_TABS.find(l => l.id === lang)?.flag}
          </span>
          <button onClick={toggleMode} style={{
            background: "transparent", border: `1px solid ${C.border}`,
            color: C.textDim, padding: "4px 8px", borderRadius: "2px",
            cursor: "pointer", fontSize: "12px", fontFamily: "inherit", marginLeft: "2px",
          }}>
            {mode === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "620px", margin: "0 auto", padding: "24px 16px" }}>

        {/* 페이지 제목 */}
        <div style={{ fontSize: "22px", color: C.textPrim, marginBottom: "6px" }}>
          {t.howAreYou}
        </div>
        <div style={{ fontSize: "15px", color: C.textDim, marginBottom: "24px" }}>
          {t.selectClosest}
        </div>

        {/* 상태 목록 */}
        {pain.states.map(s => (
          <div key={s.id} onClick={() => onSelect(s)}
            onMouseEnter={() => setHovered(s.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: "18px 20px", marginBottom: "10px", cursor: "pointer",
              background: hovered === s.id ? C.surface : "transparent",
              border: `1px solid ${hovered === s.id ? C.amber : C.border}`,
              borderLeft: `3px solid ${hovered === s.id ? C.amber : C.border}`,
              borderRadius: "2px", fontSize: "17px", lineHeight: "1.7",
              color: C.textPrim, transition: "all 0.18s",
            }}>
            {s.text}
          </div>
        ))}

        {/* 하단 버튼 */}
        <button onClick={onBack} style={{
          marginTop: "8px", width: "100%", padding: "12px",
          background: "transparent", border: `1px solid ${C.border}`,
          color: C.textDim, borderRadius: "2px", cursor: "pointer",
          fontFamily: "inherit", fontSize: "13px", letterSpacing: "0.5px",
        }}>
          {t.back}
        </button>

        <button onClick={goHome} style={{
          marginTop: "8px", width: "100%", padding: "12px",
          background: "transparent", border: `1px solid ${C.border}`,
          color: C.textDim, borderRadius: "2px", cursor: "pointer",
          fontFamily: "inherit", fontSize: "13px", letterSpacing: "0.5px",
        }}>
          🏠 {lang === "ko" ? "처음으로 돌아가기" : lang === "id" ? "Kembali ke awal" : "Back to home"}
        </button>
      </div>
    </div>
  );
}
