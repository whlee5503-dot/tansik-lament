import { useState } from "react";
import { I18N } from "../data/i18n";

export default function StateScreen({ pain, onSelect, onBack, theme: C, mode, toggleMode, lang, setLang, goHome }) {
  const [hovered, setHovered] = useState(null);
  const t = I18N[lang];

  const LANG_TABS = [
    { id: "ko", label: "한국어" },
    { id: "en", label: "English" },
    { id: "id", label: "ID" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.textPrim,
      fontFamily: "'Georgia','Noto Serif KR',serif",
    }}>
      <div style={{
        borderBottom: `1px solid ${C.border}`, padding: "14px 20px",
        background: C.surface,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={goHome} style={{
            background: "transparent", border: "none",
            color: C.amber, cursor: "pointer", fontSize: "18px", padding: "0",
          }} title="처음으로">✝</button>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "2px", color: C.amber }}>
              {pain.icon} {pain.label}
            </div>
            <div style={{ fontSize: "15px" }}>{t.howAreYou}</div>
            <div style={{ fontSize: "11px", color: C.textDim }}>{t.selectClosest}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {LANG_TABS.map(l => (
            <button key={l.id} onClick={() => setLang(l.id)} style={{
              padding: "3px 8px", fontSize: "10px", cursor: "pointer",
              border: `1px solid ${lang === l.id ? C.amber : C.border}`,
              background: lang === l.id ? C.amberDim : "transparent",
              color: lang === l.id ? C.amber : C.textDim,
              borderRadius: "2px", fontFamily: "inherit",
            }}>{l.label}</button>
          ))}
          <button onClick={toggleMode} style={{
            background: "transparent", border: `1px solid ${C.border}`,
            color: C.textDim, padding: "4px 8px", borderRadius: "2px",
            cursor: "pointer", fontSize: "11px", fontFamily: "inherit", marginLeft: "4px",
          }}>
            {mode === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "620px", margin: "0 auto", padding: "24px 16px" }}>
        {pain.states.map(s => (
          <div key={s.id} onClick={() => onSelect(s)}
            onMouseEnter={() => setHovered(s.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: "16px 20px", marginBottom: "10px", cursor: "pointer",
              background: hovered === s.id ? C.surface : "transparent",
              border: `1px solid ${hovered === s.id ? C.amber : C.border}`,
              borderLeft: `3px solid ${hovered === s.id ? C.amber : C.border}`,
              borderRadius: "2px", fontSize: "15px", lineHeight: "1.7",
              color: C.textPrim, transition: "all 0.18s",
            }}>
            {s.text}
          </div>
        ))}
        <button onClick={onBack} style={{
          marginTop: "8px", width: "100%", padding: "11px",
          background: "transparent", border: `1px solid ${C.border}`,
          color: C.textDim, borderRadius: "2px", cursor: "pointer",
          fontFamily: "inherit", fontSize: "12px", letterSpacing: "1px",
        }}>
          {t.back}
        </button>
      </div>
    </div>
  );
}
