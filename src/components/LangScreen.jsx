const C = {
  bg:      "#0D0F14",
  surface: "#161922",
  border:  "#252A36",
  text:    "#E2DED6",
  textDim: "#7A8099",
  amber:   "#C89B4A",
};

const LANGS = [
  { id: "ko", label: "한국어",           sub: "Korean",             flag: "🇰🇷" },
  { id: "en", label: "English",          sub: "영어",                flag: "🇺🇸" },
  { id: "id", label: "Bahasa Indonesia", sub: "인도네시아어",        flag: "��🇩" },
];

export default function LangScreen({ onSelect }) {
  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'Georgia','Noto Serif KR',serif",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "24px",
    }}>
      <div style={{
        fontSize: "32px", marginBottom: "12px", color: C.amber,
      }}>✝</div>
      <div style={{
        fontSize: "22px", marginBottom: "6px", textAlign: "center",
      }}>
        Lament · 탄식 · Ratapan
      </div>
      <div style={{
        fontSize: "12px", color: C.textDim, marginBottom: "40px",
        textAlign: "center", letterSpacing: "1px",
      }}>
        Choose your language · 언어를 선택하세요 · Pilih bahasa
      </div>

      <div style={{ width: "100%", maxWidth: "380px" }}>
        {LANGS.map(l => (
          <div
            key={l.id}
            onClick={() => onSelect(l.id)}
            style={{
              display: "flex", alignItems: "center", gap: "16px",
              padding: "18px 20px", marginBottom: "12px",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderLeft: `3px solid ${C.amber}`,
              borderRadius: "2px", cursor: "pointer",
              transition: "all 0.18s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.amber}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.borderLeftColor = C.amber;
            }}
          >
            <span style={{ fontSize: "28px" }}>{l.flag}</span>
            <div>
              <div style={{ fontSize: "17px", color: C.text }}>{l.label}</div>
              <div style={{ fontSize: "12px", color: C.textDim, marginTop: "2px" }}>{l.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
