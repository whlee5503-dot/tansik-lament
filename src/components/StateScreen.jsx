import { useState } from "react";

const C = {
  bg:       "#0D0F14",
  surface:  "#161922",
  border:   "#252A36",
  textPrim: "#E2DED6",
  textDim:  "#7A8099",
  textMute: "#3D4358",
  amber:    "#C89B4A",
};

export default function StateScreen({ pain, onSelect, onBack }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      color: C.textPrim,
      fontFamily: "'Georgia','Noto Serif KR',serif",
    }}>
      <div style={{
        borderBottom: `1px solid ${C.border}`,
        padding: "20px 20px 16px",
        background: C.surface,
      }}>
        <div style={{ fontSize: "10px", letterSpacing: "3px", color: C.amber, marginBottom: "5px" }}>
          {pain.icon} {pain.label}
        </div>
        <div style={{ fontSize: "20px" }}>지금 어떠세요?</div>
        <div style={{ fontSize: "12px", color: C.textDim, marginTop: "4px" }}>
          가장 가까운 것을 선택하세요
        </div>
      </div>

      <div style={{ maxWidth: "620px", margin: "0 auto", padding: "24px 16px" }}>
        {pain.states.map(s => (
          <div
            key={s.id}
            onClick={() => onSelect(s)}
            onMouseEnter={() => setHovered(s.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: "16px 20px",
              marginBottom: "10px",
              cursor: "pointer",
              background: hovered === s.id ? C.surface : "transparent",
              border: `1px solid ${hovered === s.id ? C.amber : C.border}`,
              borderLeft: `3px solid ${hovered === s.id ? C.amber : C.border}`,
              borderRadius: "2px",
              fontSize: "15px",
              lineHeight: "1.7",
              color: C.textPrim,
              transition: "all 0.18s",
            }}
          >
            {s.text}
          </div>
        ))}

        <button
          onClick={onBack}
          style={{
            marginTop: "8px",
            width: "100%",
            padding: "11px",
            background: "transparent",
            border: `1px solid ${C.border}`,
            color: C.textDim,
            borderRadius: "2px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "12px",
            letterSpacing: "1px",
          }}
        >
          ← 다시 선택
        </button>
      </div>
    </div>
  );
}
