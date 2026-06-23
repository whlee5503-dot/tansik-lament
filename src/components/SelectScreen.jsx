import { useState } from "react";
import { PAIN_TYPES } from "../data/painTypes";
import { I18N } from "../data/i18n";

export default function SelectScreen({ onSelect, theme: C, mode, toggleMode, lang }) {
  const [hovered, setHovered] = useState(null);
  const t = I18N[lang];
  const pains = PAIN_TYPES[lang];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.textPrim,
      fontFamily: "'Georgia','Noto Serif KR',serif",
    }}>
      <div style={{
        borderBottom: `1px solid ${C.border}`, padding: "16px 20px",
        background: C.surface,
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      }}>
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "3px", color: C.amber, marginBottom: "5px" }}>
            LAMENT · 탄식 · RATAPAN
          </div>
          <div style={{ fontSize: "20px" }}>{t.appSub}</div>
        </div>
        <button onClick={toggleMode} style={{
          background: "transparent", border: `1px solid ${C.border}`,
          color: C.textDim, padding: "6px 12px", borderRadius: "2px",
          cursor: "pointer", fontSize: "12px", fontFamily: "inherit",
        }}>
          {mode === "dark" ? t.light : t.dark}
        </button>
      </div>

      <div style={{ maxWidth: "620px", margin: "0 auto", padding: "24px 16px" }}>
        <div style={{
          padding: "14px 16px", marginBottom: "20px",
          borderLeft: `3px solid ${C.amber}`,
          fontSize: "13px", color: C.textDim, lineHeight: "1.9",
        }}>
          {t.onboarding}
        </div>
        <div style={{
          fontSize: "10px", letterSpacing: "2px",
          color: C.textDim, marginBottom: "16px",
        }}>
          {t.selectPain}
        </div>

        {pains.map(p => (
          <div key={p.id} onClick={() => onSelect(p)}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex", alignItems: "center", gap: "16px",
              padding: "15px 18px", marginBottom: "10px", cursor: "pointer",
              background: hovered === p.id ? C.surface : "transparent",
              border: `1px solid ${hovered === p.id ? C.amber : C.border}`,
              borderLeft: `3px solid ${hovered === p.id ? C.amber : C.border}`,
              borderRadius: "2px", transition: "all 0.18s",
            }}>
            <span style={{ fontSize: "20px", minWidth: "26px" }}>{p.icon}</span>
            <div>
              <div style={{ fontSize: "15px", marginBottom: "2px" }}>{p.label}</div>
              <div style={{ fontSize: "11px", color: C.textDim }}>{p.sub}</div>
            </div>
          </div>
        ))}

        <div style={{
          marginTop: "24px", padding: "16px",
          borderTop: `1px solid ${C.border}`,
          textAlign: "center", fontSize: "11px",
          color: C.textMute, lineHeight: "1.9",
        }}>
          {t.tagline}
        </div>
      </div>
    </div>
  );
}
