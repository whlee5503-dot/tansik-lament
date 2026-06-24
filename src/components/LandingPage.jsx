import { useState } from "react";

const DARK = {
  bg:      "#0D0F14",
  surface: "#161922",
  border:  "#252A36",
  text:    "#E2DED6",
  textDim: "#7A8099",
  textMute:"#6B7090",
  amber:   "#C89B4A",
  amberDim:"#5C4520",
};

const LIGHT = {
  bg:      "#F7F4EE",
  surface: "#FFFFFF",
  border:  "#DDD8CC",
  text:    "#1C1810",
  textDim: "#6B6355",
  textMute:"#8B8070",
  amber:   "#8B6420",
  amberDim:"#E8D9B8",
};

const CONTENT = {
  ko: {
    subtitle: "성경의 절반은 탄식입니다",
    about: "이 앱에 대하여",
    aboutText: "이 앱은 성경 전체가 아닌, 탄식과 애도의 언어에 집중한 본문들을 모았습니다. 고통을 서둘러 해결하거나 위로하지 않고, 말씀이 곁에 앉아 있도록 돕는 것이 목적입니다.\n\n구약의 탄식(욥기·시편·예레미야애가)과 신약의 공감(히브리서 4:15·요한복음 11:35)을 함께 담아 신학적 균형을 맞추었습니다.",
    howTitle: "사용 방법",
    steps: ["언어 선택", "고통의 자리 선택", "지금 상태 선택", "말씀이 곁에 앉습니다"],
    bibleTitle: "성경 버전 (모두 공개 도메인)",
    bibles: [
      { lang: "한국어", version: "개역한글" },
      { lang: "English", version: "King James Version (KJV)" },
      { lang: "Indonesia", version: "AYT · WEB" },
    ],
    bibleNote: "* AI가 생성한 본문은 공개 도메인 버전을 기반으로 하며, 정확한 본문은 해당 성경을 직접 확인하세요.",
    start: "언어 선택하기 →",
    light: "☀️ 라이트",
    dark: "🌙 다크",
  },
  en: {
    subtitle: "Nearly half the Psalms are laments",
    about: "About This App",
    aboutText: "This app does not cover the whole Bible. It focuses on passages of lament and grief — the language of honest pain before God. The goal is not to quickly comfort or resolve suffering, but to let the Word sit beside you.\n\nOT lament (Job, Psalms, Lamentations) and NT empathy (Heb 4:15, John 11:35) are held together in theological balance.",
    howTitle: "How to Use",
    steps: ["Choose your language", "Choose where it hurts", "Choose how you feel right now", "The Word sits with you"],
    bibleTitle: "Bible Versions (All Public Domain)",
    bibles: [
      { lang: "한국어", version: "개역한글 (Korean)" },
      { lang: "English", version: "King James Version (KJV)" },
      { lang: "Indonesia", version: "AYT · WEB" },
    ],
    bibleNote: "* AI-generated text is based on public domain versions. Please verify exact wording in your own Bible.",
    start: "Choose Language →",
    light: "☀️ Light",
    dark: "🌙 Dark",
  },
  id: {
    subtitle: "Hampir setengah Mazmur adalah ratapan",
    about: "Tentang Aplikasi Ini",
    aboutText: "Aplikasi ini tidak mencakup seluruh Alkitab. Ini berfokus pada bagian-bagian ratapan dan dukacita — bahasa kejujuran di hadapan Allah. Tujuannya bukan untuk segera menghibur atau menyelesaikan penderitaan, tetapi membiarkan Firman duduk bersamamu.\n\nRatapan PL (Ayub, Mazmur, Ratapan) dan empati PB (Ibr 4:15, Yoh 11:35) disatukan dalam keseimbangan teologis.",
    howTitle: "Cara Menggunakan",
    steps: ["Pilih bahasa", "Pilih di mana sakitmu", "Pilih bagaimana perasaanmu sekarang", "Firman duduk bersamamu"],
    bibleTitle: "Versi Alkitab (Semua Domain Publik)",
    bibles: [
      { lang: "한국어", version: "개역한글 (Korea)" },
      { lang: "English", version: "King James Version (KJV)" },
      { lang: "Indonesia", version: "AYT · WEB" },
    ],
    bibleNote: "* Teks yang dihasilkan AI didasarkan pada versi domain publik. Harap verifikasi teks yang tepat di Alkitab Anda.",
    start: "Pilih Bahasa →",
    light: "☀️ Terang",
    dark: "🌙 Gelap",
  },
};

const LANG_TABS = [
  { id: "ko", label: "한국어" },
  { id: "en", label: "English" },
  { id: "id", label: "Indonesia" },
];

export default function LandingPage({ onStart, mode, toggleMode }) {
  const C = mode === "dark" ? DARK : LIGHT;
  const [activeLang, setActiveLang] = useState("ko");
  const t = CONTENT[activeLang];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'Georgia','Noto Serif KR',serif",
    }}>
      {/* 헤더 */}
      <div style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "16px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="24" height="30" viewBox="0 0 32 40">
            <line x1="16" y1="2" x2="16" y2="38" stroke={C.amber} strokeWidth="5" strokeLinecap="round"/>
            <line x1="4" y1="13" x2="28" y2="13" stroke={C.amber} strokeWidth="5" strokeLinecap="round"/>
          </svg>
          <div>
            <div style={{ fontSize: "16px" }}>Lament · 탄식 · Ratapan</div>
            <div style={{ fontSize: "11px", color: C.amber, fontStyle: "italic" }}>
              "{t.subtitle}"
            </div>
          </div>
        </div>
        <button onClick={toggleMode} style={{
          background: "transparent", border: `1px solid ${C.border}`,
          color: C.textDim, padding: "6px 10px", borderRadius: "2px",
          cursor: "pointer", fontSize: "11px", fontFamily: "inherit",
        }}>
          {mode === "dark" ? t.light : t.dark}
        </button>
      </div>

      {/* 언어 탭 */}
      <div style={{
        display: "flex", borderBottom: `1px solid ${C.border}`,
        background: C.surface,
      }}>
        {LANG_TABS.map(l => (
          <button key={l.id} onClick={() => setActiveLang(l.id)} style={{
            flex: 1, padding: "10px", border: "none", cursor: "pointer",
            background: "transparent",
            color: activeLang === l.id ? C.amber : C.textDim,
            fontSize: "12px", fontFamily: "inherit", letterSpacing: "0.5px",
            borderBottom: activeLang === l.id ? `2px solid ${C.amber}` : "2px solid transparent",
            transition: "all 0.15s",
          }}>
            {l.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "620px", margin: "0 auto", padding: "24px 16px 48px" }}>

        {/* 이 앱에 대하여 */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderLeft: `3px solid ${C.amber}`,
          borderRadius: "2px", padding: "18px 20px", marginBottom: "16px",
        }}>
          <div style={{ fontSize: "10px", color: C.amber, letterSpacing: "2px", marginBottom: "12px" }}>
            {t.about}
          </div>
          <div style={{ fontSize: "14px", color: C.text, lineHeight: "1.9", whiteSpace: "pre-line" }}>
            {t.aboutText}
          </div>
        </div>

        {/* 사용 방법 */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: "2px", padding: "18px 20px", marginBottom: "16px",
        }}>
          <div style={{ fontSize: "10px", color: C.amber, letterSpacing: "2px", marginBottom: "14px" }}>
            {t.howTitle}
          </div>
          {t.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
              <div style={{
                width: "26px", height: "26px", borderRadius: "50%",
                background: C.amber, color: mode === "dark" ? "#0D0F14" : "#FFFFFF",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: "bold", flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <div style={{ fontSize: "14px", color: C.text, lineHeight: "1.6" }}>{step}</div>
            </div>
          ))}
        </div>

        {/* 성경 버전 */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: "2px", padding: "18px 20px", marginBottom: "24px",
        }}>
          <div style={{ fontSize: "10px", color: C.amber, letterSpacing: "2px", marginBottom: "14px" }}>
            {t.bibleTitle}
          </div>
          {t.bibles.map((b, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: "10px", paddingBottom: "10px",
              borderBottom: i < t.bibles.length - 1 ? `1px solid ${C.border}` : "none",
            }}>
              <div style={{ fontSize: "12px", color: C.textDim }}>{b.lang}</div>
              <div style={{ fontSize: "13px", color: C.text }}>{b.version}</div>
            </div>
          ))}
          <div style={{ fontSize: "11px", color: C.textMute, marginTop: "10px", lineHeight: "1.7" }}>
            {t.bibleNote}
          </div>
        </div>

        {/* 시작하기 버튼 */}
        <button onClick={onStart} style={{
          width: "100%", padding: "15px",
          background: C.amber, color: mode === "dark" ? "#0D0F14" : "#FFFFFF",
          border: "none", borderRadius: "2px",
          fontSize: "15px", letterSpacing: "2px",
          cursor: "pointer", fontFamily: "inherit",
        }}>
          {t.start}
        </button>
      </div>
    </div>
  );
}
