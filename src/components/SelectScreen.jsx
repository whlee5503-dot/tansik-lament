import { useState } from "react";
import { PAIN_TYPES } from "../data/painTypes";

const C = {
  bg:       "#0D0F14",
  surface:  "#161922",
  border:   "#252A36",
  textPrim: "#E2DED6",
  textDim:  "#7A8099",
  textMute: "#3D4358",
  amber:    "#C89B4A",
};

export default function SelectScreen({ onSelect }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      color: C.textPrim,
      fontFamily: "'Georgia','Noto Serif KR',serif",
    }}>
      {/* 헤더 */}
      <div style={{
        borderBottom: `1px solid ${C.border}`,
        padding: "20px 20px 16px",
        background: C.surface,
      }}>
        <div style={{
          fontSize: "10px",
          letterSpacing: "3px",
          color: C.amber,
          marginBottom: "5px",
        }}>
          LAMENT · 탄식
        </div>
        <div style={{ fontSize: "20px" }}>지금 어디가 아프신가요</div>
        <div style={{ fontSize: "12px", color: C.textDim, marginTop: "4px" }}>
          말씀이 당신 곁에 앉겠습니다
        </div>
      </div>

      <div style={{ maxWidth: "620px", margin: "0 auto", padding: "24px 16px" }}>
        {/* 신학적 전제 안내 */}
        <div style={{
          padding: "14px 16px",
          marginBottom: "20px",
          borderLeft: `3px solid ${C.amber}`,
          fontSize: "13px",
          color: C.textDim,
          lineHeight: "1.9",
        }}>
          성경은 '항상 기뻐하라'고 말하지만, 시편 150편 중 절반은 탄식입니다.
          예수님도 십자가에서 탄식시인 시편 22편을 인용하셨습니다.
          여기서는 솔직한 탄식이 기도입니다.
        </div>

        <div style={{
          fontSize: "10px",
          letterSpacing: "2px",
          color: C.textDim,
          marginBottom: "16px",
        }}>
          고통의 자리를 선택하세요
        </div>

        {PAIN_TYPES.map(p => (
          <div
            key={p.id}
            onClick={() => onSelect(p)}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "15px 18px",
              marginBottom: "10px",
              cursor: "pointer",
              background: hovered === p.id ? C.surface : "transparent",
              border: `1px solid ${hovered === p.id ? C.amber : C.border}`,
              borderLeft: `3px solid ${hovered === p.id ? C.amber : C.border}`,
              borderRadius: "2px",
              transition: "all 0.18s",
            }}
          >
            <span style={{ fontSize: "20px", minWidth: "26px" }}>{p.icon}</span>
            <div>
              <div style={{ fontSize: "15px", marginBottom: "2px" }}>{p.label}</div>
              <div style={{ fontSize: "11px", color: C.textDim }}>{p.sub}</div>
            </div>
          </div>
        ))}

        <div style={{
          marginTop: "24px",
          padding: "16px",
          borderTop: `1px solid ${C.border}`,
          textAlign: "center",
          fontSize: "11px",
          color: C.textMute,
          lineHeight: "1.9",
        }}>
          당신의 한이 기도가 될 수 있습니다.
        </div>
      </div>
    </div>
  );
}
