import { useState } from "react";
import { I18N } from "../data/i18n";

const DARK = {
  surface: "#161922", border: "#252A36", textPrim: "#E2DED6",
  textDim: "#7A8099", amber: "#C89B4A", amberDim: "#5C4520",
  dawn: "#8BA0C4", teal: "#4A8A6A",
};
const LIGHT = {
  surface: "#FFFFFF", border: "#DDD8CC", textPrim: "#1C1810",
  textDim: "#6B6355", amber: "#8B6420", amberDim: "#E8D9B8",
  dawn: "#2D5FA6", teal: "#2A6B4A",
};

export default function VerseCard({ verse, reflection, mode = "dark", lang = "ko" }) {
  const [tab, setTab]   = useState("text");
  const [vLang, setVLang] = useState(lang === "id" ? "en" : lang);
  const C = mode === "dark" ? DARK : LIGHT;
  const t = I18N[lang];

  const tabs = [
    { id: "text",       label: t.tabVerse },
    { id: "then",       label: t.tabThen },
    { id: "now",        label: t.tabNow },
    { id: "reflection", label: t.tabWith },
  ];

  // 인도네시아어는 개역 대신 TB(Terjemahan Baru) / NIV 토글
  const langOptions = lang === "ko"
    ? [{ id: "ko", label: "개역한글" }, { id: "en", label: "NIV" }]
    : lang === "en"
    ? [{ id: "en", label: "NIV" }]
    : [{ id: "id", label: "AYT" }, { id: "en", label: "NIV" }];

  return (
    <div style={{
      border: `1px solid ${C.amberDim}`,
      borderLeft: `3px solid ${C.amber}`,
      borderRadius: "2px", overflow: "hidden",
    }}>
      <div style={{
        display: "flex", borderBottom: `1px solid ${C.border}`,
        overflowX: "auto", background: C.surface,
      }}>
        {tabs.map(tab_ => (
          <button key={tab_.id} onClick={() => setTab(tab_.id)} style={{
            flex: 1, padding: "9px 4px", border: "none", cursor: "pointer",
            background: tab === tab_.id ? C.surface : "transparent",
            color: tab === tab_.id ? C.amber : C.textDim,
            fontSize: "11px", letterSpacing: "0.5px",
            fontFamily: "inherit", whiteSpace: "nowrap",
            borderBottom: tab === tab_.id
              ? `2px solid ${C.amber}` : "2px solid transparent",
            transition: "all 0.15s",
          }}>
            {tab_.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "14px 16px", background: C.surface }}>
        {tab === "text" && (
          <>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: "10px",
            }}>
              <div style={{ fontSize: "10px", color: C.amber, letterSpacing: "1.5px" }}>
                {verse.ref}
              </div>
              {langOptions.length > 1 && (
                <div style={{ display: "flex", gap: "4px" }}>
                  {langOptions.map(l => (
                    <button key={l.id} onClick={() => setVLang(l.id)} style={{
                      padding: "2px 8px", fontSize: "10px",
                      border: `1px solid ${vLang === l.id ? C.amber : C.border}`,
                      background: vLang === l.id ? C.amberDim : "transparent",
                      color: vLang === l.id ? C.amber : C.textDim,
                      borderRadius: "2px", cursor: "pointer",
                      fontFamily: "inherit", letterSpacing: "1px",
                    }}>{l.label}</button>
                  ))}
                </div>
              )}
            </div>
            <div style={{
              fontSize: "14px", color: C.textPrim,
              lineHeight: "2", fontStyle: "italic",
            }}>
              {vLang === "ko" ? verse.text_ko
                : vLang === "id" ? (verse.text_id || verse.text_en)
                : verse.text_en}
            </div>
          </>
        )}

        {tab === "then" && (
          <>
            <div style={{ fontSize: "10px", color: C.dawn, letterSpacing: "1.5px", marginBottom: "10px" }}>
              {t.tabContext}
            </div>
            <div style={{ fontSize: "13px", color: C.textPrim, lineHeight: "1.9" }}>
              {verse.then_there}
            </div>
          </>
        )}

        {tab === "now" && (
          <>
            <div style={{ fontSize: "10px", color: C.teal, letterSpacing: "1.5px", marginBottom: "10px" }}>
              {t.tabNowSub}
            </div>
            <div style={{ fontSize: "13px", color: C.textPrim, lineHeight: "1.9" }}>
              {verse.now_here}
            </div>
          </>
        )}

        {tab === "reflection" && (
          <>
            <div style={{ fontSize: "10px", color: C.teal, letterSpacing: "1.5px", marginBottom: "10px" }}>
              {t.tabWithSub}
            </div>
            <div style={{ fontSize: "13px", color: C.textPrim, lineHeight: "1.9" }}>
              {reflection}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
