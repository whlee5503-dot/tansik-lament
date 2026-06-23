import { useState, useEffect } from "react";
import VerseCard from "./VerseCard";

const DARK = {
  bg:       "#0D0F14",
  surface:  "#161922",
  border:   "#252A36",
  textPrim: "#E2DED6",
  textDim:  "#7A8099",
  textMute: "#3D4358",
  amber:    "#C89B4A",
  amberDim: "#5C4520",
};

const LIGHT = {
  bg:       "#F7F4EE",
  surface:  "#FFFFFF",
  border:   "#DDD8CC",
  textPrim: "#1C1810",
  textDim:  "#6B6355",
  textMute: "#B0A898",
  amber:    "#8B6420",
  amberDim: "#E8D9B8",
};

function LoadingDots({ color }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setFrame(f => (f + 1) % 4), 500);
    return () => clearInterval(iv);
  }, []);
  const dots = ["", ".", "..", "..."];
  return (
    <span style={{ color, letterSpacing: "2px", fontSize: "20px" }}>
      ✦{dots[frame]}
    </span>
  );
}

export default function ResultScreen({ pain, state, onRestart, mode, toggleMode }) {
  const C = mode === "dark" ? DARK : LIGHT;
  const [result, setResult]               = useState(null);
  const [loading, setLoading]             = useState(true);
  const [prayer, setPrayer]               = useState(null);
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [extraLang, setExtraLang]         = useState("ko");

  useEffect(() => { fetchResult(); }, []);

  async function fetchResult() {
    setLoading(true);
    const system = `당신은 한국의 한(恨)과 고통의 신학에 정통한 목회 상담자입니다.
탄식 신학(Lament Theology), 욥기, 탄식 시편(22, 42, 77, 88편), 예레미야애가에 깊습니다.
신약에서도 고통 관련 본문(롬 8:18, 고후 12:9, 히 4:15, 요 11:35 등)을 잘 압니다.
공허한 위로("다 잘 될 거예요")는 절대 금지. 함께 앉아 있습니다.`;

    const prompt = `고통 유형: ${pain.label} (${pain.sub})
지금 상태: "${state.text}"

JSON으로만 응답하세요:
{
  "comfort": "15자 이내 위로 한 마디",
  "verse": {
    "ref": "주 본문 출처",
    "text_ko": "본문 전문 (개역개정 2-4절)",
    "text_en": "본문 전문 (NIV)",
    "then_there": "역사적·언어적·신학적 맥락 2-3문장. 원어 단어 1개 포함.",
    "now_here": "'${state.text}'와 연결하여 2문장. reflection과 중복 금지."
  },
  "reflection": "함께 앉아서 건네는 말 3문장. 동반자의 언어로. then_there, now_here와 중복 금지.",
  "extra_ot": [
    { "ref": "구약 본문1 출처", "text_ko": "한 절 (개역개정)", "text_en": "한 절 (NIV)" },
    { "ref": "구약 본문2 출처", "text_ko": "한 절 (개역개정)", "text_en": "한 절 (NIV)" }
  ],
  "extra_nt": [
    { "ref": "신약 본문 출처", "text_ko": "한 절 (개역개정)", "text_en": "한 절 (NIV)" }
  ]
}`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const raw = data.content
        ?.map(i => i.text || "").join("")
        .replace(/```json|```/g, "").trim();
      setResult(JSON.parse(raw));
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPrayer() {
    setPrayerLoading(true);
    const prompt = `고통 유형: ${pain.label}, 상태: "${state.text}"
이 사람의 고통을 담아 하나님께 드리는 탄식 기도문. 6-8줄. 솔직하게 따져 묻는 형식.
JSON만 출력: {"prayer": "기도문 전문"}`;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "당신은 탄식 신학에 정통한 목회자입니다.",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const raw = data.content
        ?.map(i => i.text || "").join("")
        .replace(/```json|```/g, "").trim();
      setPrayer(JSON.parse(raw).prayer);
    } catch {
      setPrayer("기도문을 불러오지 못했습니다.");
    } finally {
      setPrayerLoading(false);
    }
  }

  if (loading) return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.textPrim,
      fontFamily: "'Georgia','Noto Serif KR',serif",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "16px",
    }}>
      <div style={{ fontSize: "32px" }}>{pain.icon}</div>
      <div style={{ fontSize: "13px", color: C.textDim, letterSpacing: "2px" }}>
        말씀을 찾고 있습니다
      </div>
      <LoadingDots color={C.amber} />
    </div>
  );

  if (!result) return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.textPrim,
      fontFamily: "'Georgia','Noto Serif KR',serif",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "16px",
    }}>
      <div style={{ fontSize: "14px", color: C.textDim }}>말씀을 불러오지 못했습니다.</div>
      <button onClick={fetchResult} style={{
        padding: "10px 24px", background: C.amber,
        color: mode === "dark" ? "#0D0F14" : "#FFFFFF",
        border: "none", borderRadius: "2px", cursor: "pointer",
        fontFamily: "inherit", fontSize: "13px",
      }}>다시 시도</button>
    </div>
  );

  const allExtra = [
    ...(result.extra_ot || []).map(e => ({ ...e, type: "OT" })),
    ...(result.extra_nt || []).map(e => ({ ...e, type: "NT" })),
  ];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.textPrim,
      fontFamily: "'Georgia','Noto Serif KR',serif",
    }}>
      {/* 헤더 */}
      <div style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "14px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: C.amber }}>
            {pain.icon} {pain.label}
          </div>
          <div style={{ fontSize: "13px", color: C.textDim, marginTop: "2px" }}>
            "{state.text}"
          </div>
        </div>
        <button onClick={toggleMode} style={{
          background: "transparent", border: `1px solid ${C.border}`,
          color: C.textDim, padding: "6px 12px", borderRadius: "2px",
          cursor: "pointer", fontSize: "12px", fontFamily: "inherit",
        }}>
          {mode === "dark" ? "☀️ 라이트" : "🌙 다크"}
        </button>
      </div>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 16px 48px" }}>

        {/* 위로 한 마디 */}
        <div style={{
          textAlign: "center", padding: "24px 0 20px",
          fontSize: "18px", color: C.amber, lineHeight: "1.7",
        }}>
          {result.comfort}
        </div>

        {/* 주 말씀 카드 */}
        {result.verse && (
          <div style={{ marginBottom: "16px" }}>
            <VerseCard verse={result.verse} reflection={result.reflection} mode={mode} />
          </div>
        )}

        {/* 함께 읽을 말씀 — 구약 + 신약 + 언어 토글 */}
        {allExtra.length > 0 && (
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            padding: "18px 20px", borderRadius: "2px", marginBottom: "16px",
          }}>
            {/* 헤더 + 언어 토글 */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: "14px",
            }}>
              <div style={{
                fontSize: "10px", color: C.textDim, letterSpacing: "2px",
              }}>
                함께 읽을 말씀
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                {["ko", "en"].map(l => (
                  <button key={l} onClick={() => setExtraLang(l)} style={{
                    padding: "2px 8px", fontSize: "10px",
                    border: `1px solid ${extraLang === l ? C.amber : C.border}`,
                    background: extraLang === l ? C.amberDim : "transparent",
                    color: extraLang === l ? C.amber : C.textDim,
                    borderRadius: "2px", cursor: "pointer",
                    fontFamily: "inherit", letterSpacing: "1px",
                  }}>
                    {l === "ko" ? "개역" : "NIV"}
                  </button>
                ))}
              </div>
            </div>

            {allExtra.map((e, i) => (
              <div key={i} style={{
                marginBottom: "12px", paddingBottom: "12px",
                borderBottom: i < allExtra.length - 1
                  ? `1px solid ${C.border}` : "none",
              }}>
                <div style={{
                  display: "flex", alignItems: "center",
                  gap: "8px", marginBottom: "5px",
                }}>
                  <div style={{
                    fontSize: "10px", color: C.amber, letterSpacing: "1px",
                  }}>
                    {e.ref}
                  </div>
                  <div style={{
                    fontSize: "9px", padding: "1px 6px",
                    border: `1px solid ${e.type === "NT" ? C.amber : C.border}`,
                    color: e.type === "NT" ? C.amber : C.textDim,
                    borderRadius: "2px",
                  }}>
                    {e.type === "NT" ? "신약" : "구약"}
                  </div>
                </div>
                <div style={{
                  fontSize: "13px", color: C.textDim,
                  lineHeight: "1.9", fontStyle: "italic",
                }}>
                  {extraLang === "ko" ? e.text_ko : e.text_en}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 탄식 기도문 버튼 */}
        {!prayer && (
          <button onClick={fetchPrayer} disabled={prayerLoading} style={{
            width: "100%", padding: "13px",
            background: prayerLoading ? C.amberDim : C.amber,
            color: mode === "dark" ? "#0D0F14" : "#FFFFFF",
            border: "none", borderRadius: "2px",
            fontSize: "13px", letterSpacing: "1px",
            cursor: prayerLoading ? "not-allowed" : "pointer",
            fontFamily: "inherit", marginBottom: "10px",
          }}>
            {prayerLoading ? "기도문을 쓰는 중..." : "✦ 나의 탄식 기도문 받기"}
          </button>
        )}

        {prayer && (
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${C.amber}`,
            padding: "20px", borderRadius: "2px", marginBottom: "16px",
          }}>
            <div style={{
              fontSize: "10px", color: C.amber,
              letterSpacing: "2px", marginBottom: "14px",
            }}>
              나의 탄식 기도
            </div>
            <div style={{
              fontSize: "14px", color: C.textPrim,
              lineHeight: "2.1", fontStyle: "italic", whiteSpace: "pre-line",
            }}>
              {prayer}
            </div>
          </div>
        )}

        <button onClick={onRestart} style={{
          width: "100%", padding: "12px", background: "transparent",
          border: `1px solid ${C.border}`, color: C.textDim,
          borderRadius: "2px", cursor: "pointer",
          fontFamily: "inherit", fontSize: "12px", letterSpacing: "1px",
        }}>
          다른 고통의 자리로
        </button>
      </div>
    </div>
  );
}
