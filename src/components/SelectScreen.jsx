import { useState } from "react";
import { PAIN_TYPES } from "../data/painTypes";
import { I18N } from "../data/i18n";

export default function SelectScreen({ onSelect, theme: C, mode, toggleMode, lang, setLang, goHome }) {
  const [hovered, setHovered] = useState(null);
  const t = I18N[lang];
  const pains = PAIN_TYPES[lang];

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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "3px", color: C.amber }}>
            LAMENT · 탄식 · RATAPAN
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {LANG_TABS.map(l => (
            <button key={l.id} onClick={() => setLang(l.id)} style={{
              padding: "4px 10px", fontSize: "11px", cursor: "pointer",
              border: `1px solid ${lang === l.id ? C.amber : C.border}`,
              background: lang === l.id ? C.amberDim : "transparent",
              color: lang === l.id ? C.amber : C.textDim,
              borderRadius: "2px", fontFamily: "inherit",
            }}>{l.flag}</button>
          ))}
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
        <div style={{
          fontSize: "22px", color: C.textPrim,
          marginBottom: "20px", lineHeight: "1.4",
        }}>
          {t.selectPain}
        </div>

        {/* 온보딩 문구 */}
        <div style={{
          padding: "14px 16px", marginBottom: "20px",
          borderLeft: `3px solid ${C.amber}`,
          fontSize: "14px", color: C.textDim, lineHeight: "1.9",
        }}>
          {t.onboarding}
        </div>

        {/* 고통 유형 목록 */}
        {pains.map(p => (
          <div key={p.id} onClick={() => onSelect(p)}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex", alignItems: "center", gap: "16px",
              padding: "18px 20px", marginBottom: "10px", cursor: "pointer",
              background: hovered === p.id ? C.surface : "transparent",
              border: `1px solid ${hovered === p.id ? C.amber : C.border}`,
              borderLeft: `3px solid ${hovered === p.id ? C.amber : C.border}`,
              borderRadius: "2px", transition: "all 0.18s",
            }}>
            <span style={{ fontSize: "24px", minWidth: "30px" }}>{p.icon}</span>
            <div>
              <div style={{ fontSize: "17px", marginBottom: "4px" }}>{p.label}</div>
              <div style={{ fontSize: "13px", color: C.textDim }}>{p.sub}</div>
            </div>
          </div>
        ))}

        {/* 하단 — 처음으로 돌아가기 */}
        <button onClick={goHome} style={{
          marginTop: "16px", width: "100%", padding: "12px",
          background: "transparent",
          border: `1px solid ${C.border}`,
          color: C.textDim, borderRadius: "2px",
          cursor: "pointer", fontFamily: "inherit",
          fontSize: "13px", letterSpacing: "0.5px",
        }}>
          🏠 {lang === "ko" ? "처음으로 돌아가기" : lang === "id" ? "Kembali ke awal" : "Back to home"}
        </button>
      </div>
    </div>
  );
}
