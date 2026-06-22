import { useState } from "react";

const C = {
  surface:  "#161922",
  border:   "#252A36",
  textPrim: "#E2DED6",
  textDim:  "#7A8099",
  amber:    "#C89B4A",
  amberDim: "#5C4520",
  dawn:     "#8BA0C4",
  teal:     "#4A8A6A",
};

export default function VerseCard({ verse }) {
  const [tab, setTab] = useState("text");

  const tabs = [
    { id: "text", label: "본문" },
    { id: "then", label: "Then / There" },
    { id: "now",  label: "Now / Here" },
  ];

  return (
    <div style={{
      maxWidth: "86%",
      marginTop: "12px",
      border: `1px solid ${C.amberDim}`,
      borderLeft: `3px solid ${C.amber}`,
      borderRadius: "2px",
      overflow: "hidden",
    }}>
      {/* 탭 헤더 */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1,
            padding: "8px 4px",
            border: "none",
            cursor: "pointer",
            background: tab === t.id ? C.surface : "transparent",
            color: tab === t.id ? C.amber : C.textDim,
            fontSize: "11px",
            letterSpacing: "1px",
            fontFamily: "inherit",
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
      <div style={{ padding: "14px 16px" }}>
        {tab === "text" && (
          <>
            <div style={{
              fontSize: "10px",
              color: C.amber,
              letterSpacing: "1.5px",
              marginBottom: "10px",
            }}>
              {verse.ref}
            </div>
            <div style={{
              fontSize: "14px",
              color: C.textPrim,
              lineHeight: "2",
              fontStyle: "italic",
            }}>
              {verse.text}
            </div>
          </>
        )}

        {tab === "then" && (
          <>
            <div style={{
              fontSize: "10px",
              color: C.dawn,
              letterSpacing: "1.5px",
              marginBottom: "10px",
            }}>
              역사적 · 언어적 · 신학적 맥락
            </div>
            <div style={{
              fontSize: "13px",
              color: C.textPrim,
              lineHeight: "1.9",
            }}>
              {verse.then_there}
            </div>
          </>
        )}

        {tab === "now" && (
          <>
            <div style={{
              fontSize: "10px",
              color: C.teal,
              letterSpacing: "1.5px",
              marginBottom: "10px",
            }}>
              지금 · 여기 · 당신
            </div>
            <div style={{
              fontSize: "13px",
              color: C.textPrim,
              lineHeight: "1.9",
            }}>
              {verse.now_here}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
