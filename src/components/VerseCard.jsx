import { useState } from "react";

const DARK = {
  surface:  "#161922",
  border:   "#252A36",
  textPrim: "#E2DED6",
  textDim:  "#7A8099",
  amber:    "#C89B4A",
  amberDim: "#5C4520",
  dawn:     "#8BA0C4",
  teal:     "#4A8A6A",
};

const LIGHT = {
  surface:  "#FFFFFF",
  border:   "#DDD8CC",
  textPrim: "#1C1810",
  textDim:  "#6B6355",
  amber:    "#8B6420",
  amberDim: "#E8D9B8",
  dawn:     "#2D5FA6",
  teal:     "#2A6B4A",
};

export default function VerseCard({ verse, reflection, mode = "dark" }) {
  const [tab, setTab]   = useState("text");
  const [lang, setLang] = useState("ko");
  const C = mode === "dark" ? DARK : LIGHT;

  const tabs = [
    { id: "text",       label: "본문" },
    { id: "then",       label: "그때 / 거기서" },
    { id: "now",        label: "지금 / 여기서" },
    { id: "reflection", label: "함께 앉아서" },
  ];

  return (
    <div style={{
      border: `1px solid ${C.amberDim}`,
      borderLeft: `3px solid ${C.amber}`,
      borderRadius: "2px",
      overflow: "hidden",
    }}>
      {/* 탭 헤더 */}
      <div style={{
        display: "flex",
        borderBottom: `1px solid ${C.border}`,
        overflowX: "auto",
        background: C.surface,
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1,
            padding: "9px 4px",
            border: "none",
            cursor: "pointer",
            background: tab === t.id ? C.surface : "transparent",
            color: tab === t.id ? C.amber : C.textDim,
            fontSize: "11px",
            letterSpacing: "0.5px",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
            borderBottom: tab === t.id
              ? `2px solid ${C.amber}`
              : "2px solid transparent",
            transition: "all 0.15s",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div style={{ padding: "14px 16px", background: C.surface }}>

        {/* 본문 탭 */}
        {tab === "text" && (
          <>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}>
              <div style={{ fontSize: "10px", color: C.amber, letterSpacing: "1.5px" }}>
                {verse.ref}
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                {["ko", "en"].map(l => (
                  <button key={l} onClick={() => setLang(l)} style={{
                    padding: "2px 8px",
                    fontSize: "10px",
                    border: `1px solid ${lang === l ? C.amber : C.border}`,
                    background: lang === l ? C.amberDim : "transparent",
                    color: lang === l ? C.amber : C.textDim,
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    letterSpacing: "1px",
                  }}>
                    {l === "ko" ? "개역" : "NIV"}
                  </button>
                ))}
              </div>
            </div>
            <div style={{
              fontSize: "14px", color: C.textPrim,
              lineHeight: "2", fontStyle: "italic",
            }}>
              {lang === "ko" ? verse.text_ko : verse.text_en}
            </div>
          </>
        )}

        {/* 그때/거기서 탭 */}
        {tab === "then" && (
          <>
            <div style={{
              fontSize: "10px", color: C.dawn,
              letterSpacing: "1.5px", marginBottom: "10px",
            }}>
              역사적 · 언어적 · 신학적 맥락
            </div>
            <div style={{ fontSize: "13px", color: C.textPrim, lineHeight: "1.9" }}>
              {verse.then_there}
            </div>
          </>
        )}

        {/* 지금/여기서 탭 */}
        {tab === "now" && (
          <>
            <div style={{
              fontSize: "10px", color: C.teal,
              letterSpacing: "1.5px", marginBottom: "10px",
            }}>
              지금 · 여기 · 당신
            </div>
            <div style={{ fontSize: "13px", color: C.textPrim, lineHeight: "1.9" }}>
              {verse.now_here}
            </div>
          </>
        )}

        {/* 함께 앉아서 탭 */}
        {tab === "reflection" && (
          <>
            <div style={{
              fontSize: "10px", color: C.teal,
              letterSpacing: "1.5px", marginBottom: "10px",
            }}>
              동반자의 말
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
