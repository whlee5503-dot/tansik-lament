const C = {
  bg:      "#0D0F14",
  surface: "#161922",
  border:  "#252A36",
  text:    "#E2DED6",
  textDim: "#7A8099",
  amber:   "#C89B4A",
};

const LANGS = [
  { id: "ko", label: "한국어",           sub: "Korean",          badge: "KO" },
  { id: "en", label: "English",          sub: "",                badge: "EN" },
  { id: "id", label: "Bahasa Indonesia", sub: "",                badge: "ID" },
];

export default function LangScreen({ onSelect }) {
  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'Georgia','Noto Serif KR',serif",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "24px",
    }}>
      <svg width="36" height="44" viewBox="0 0 36 44" style={{ marginBottom: "16px" }}>
        <line x1="18" y1="2"  x2="18" y2="42" stroke="#C89B4A" strokeWidth="5" strokeLinecap="round"/>
        <line x1="4"  y1="14" x2="32" y2="14" stroke="#C89B4A" strokeWidth="5" strokeLinecap="round"/>
      </svg>

      <div style={{ fontSize: "22px", marginBottom: "6px", textAlign: "center" }}>
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
            <div style={{
              width: "40px", height: "40px", borderRadius: "4px",
              background: C.amber, color: C.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: "bold", letterSpacing: "1px",
              flexShrink: 0,
            }}>
              {l.badge}
            </div>
            <div>
              <div style={{ fontSize: "17px", color: C.text }}>{l.label}</div>
              {l.sub && (
                <div style={{ fontSize: "12px", color: C.textDim, marginTop: "2px" }}>{l.sub}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
