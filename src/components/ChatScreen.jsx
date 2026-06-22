import { useState, useRef, useEffect } from "react";
import TypingText from "./TypingText";
import VerseCard from "./VerseCard";
import { buildSystemPrompt } from "../utils/systemPrompt";

const C = {
  bg:       "#0D0F14",
  surface:  "#161922",
  border:   "#252A36",
  textPrim: "#E2DED6",
  textDim:  "#7A8099",
  textMute: "#3D4358",
  amber:    "#C89B4A",
  amberDim: "#5C4520",
  dawn:     "#8BA0C4",
};

export default function ChatScreen({ pain, onRestart }) {
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [inputReady, setInputReady] = useState(false);
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [prayerText, setPrayerText] = useState(null);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const historyRef = useRef([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, prayerText]);

  useEffect(() => {
    if (inputReady) inputRef.current?.focus();
  }, [inputReady]);

  useEffect(() => { fetchAI([]); }, []);

  const lastAiIdx = messages
    .map((m, i) => (m.role === "ai" ? i : -1))
    .filter(i => i >= 0)
    .slice(-1)[0];

  async function fetchAI(history) {
    setLoading(true);
    setInputReady(false);

    const isFirst = history.length === 0;
    const apiMessages = isFirst
      ? [{ role: "user", content: `나는 지금 "${pain.label}"로 힘듭니다. (${pain.sub})` }]
      : history;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: buildSystemPrompt(pain),
          messages: apiMessages,
        }),
      });

      const data = await res.json();
      const raw = data.content
        ?.map(i => i.text || "")
        .join("")
        .replace(/```json|```/g, "")
        .trim();
      const parsed = JSON.parse(raw);

      const aiMsg = { role: "ai", ...parsed };
      setMessages(prev => [...prev, aiMsg]);

      if (isFirst) {
        historyRef.current = [
          {
            role: "user",
            content: `나는 지금 "${pain.label}"로 힘듭니다. (${pain.sub})`,
          },
          { role: "assistant", content: parsed.message },
        ];
      } else {
        historyRef.current = [
          ...history,
          { role: "assistant", content: parsed.message },
        ];
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "ai", message: "잠시 연결이 끊어졌습니다. 다시 시도해 주세요.", type: "question" },
      ]);
      setInputReady(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    setInputReady(false);
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    const newHistory = [
      ...historyRef.current,
      { role: "user", content: userText },
    ];
    historyRef.current = newHistory;
    await fetchAI(newHistory);
  }

  async function handlePrayer() {
    setPrayerLoading(true);
    const histText = historyRef.current
      .map(h => `${h.role === "user" ? "사람" : "안내자"}: ${h.content}`)
      .join("\n");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: buildSystemPrompt(pain),
          messages: [{
            role: "user",
            content: `지금까지 대화:\n${histText}\n\n이 사람의 고통과 감정, 대화에서 나온 구체적 표현을 담아 하나님께 드리는 탄식 기도문을 쓰세요. 6-8줄. 솔직하게 따져 묻는 형식으로. JSON만 출력: {"prayer": "기도문 전문"}`,
          }],
        }),
      });

      const data = await res.json();
      const raw = data.content
        ?.map(i => i.text || "")
        .join("")
        .replace(/```json|```/g, "")
        .trim();
      setPrayerText(JSON.parse(raw).prayer);
    } catch {
      setPrayerText("기도문을 불러오지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setPrayerLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      color: C.textPrim,
      fontFamily: "'Georgia','Noto Serif KR',serif",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* 헤더 */}
      <div style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: "14px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: C.amber }}>
            {pain.icon} {pain.label}
          </div>
          <div style={{ fontSize: "11px", color: C.textDim, marginTop: "2px" }}>
            성경 본문은{" "}
            <span style={{ color: C.dawn }}>본문 · Then/There · Now/Here</span>{" "}
            탭으로 확인하세요
          </div>
        </div>
        <button
          onClick={onRestart}
          style={{
            background: "transparent",
            border: `1px solid ${C.border}`,
            color: C.textDim,
            padding: "6px 12px",
            borderRadius: "2px",
            cursor: "pointer",
            fontSize: "11px",
            fontFamily: "inherit",
          }}
        >
          처음으로
        </button>
      </div>

      {/* 대화 영역 */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px 16px",
        maxWidth: "640px",
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: "22px",
              display: "flex",
              flexDirection: "column",
              alignItems: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div style={{
              fontSize: "9px",
              letterSpacing: "1.5px",
              color: msg.role === "ai" ? C.amber : C.dawn,
              marginBottom: "5px",
            }}>
              {msg.role === "ai" ? "✦ 말씀 동반자" : "나"}
            </div>

            <div style={{
              maxWidth: "86%",
              padding: "13px 16px",
              borderRadius: "2px",
              background: msg.role === "ai" ? C.surface : "transparent",
              border: msg.role === "ai"
                ? `1px solid ${C.border}`
                : `1px solid ${C.dawn}`,
              fontSize: "15px",
              lineHeight: "1.9",
              color: C.textPrim,
            }}>
              {msg.role === "ai" && i === lastAiIdx && !inputReady
                ? (
                  <TypingText
                    text={msg.message || msg.text || ""}
                    onDone={() => setInputReady(true)}
                  />
                )
                : (msg.message || msg.text || "")
              }
            </div>

            {msg.verse && <VerseCard verse={msg.verse} />}

            {msg.showPrayerBtn && !prayerText && (
              <button
                onClick={handlePrayer}
                disabled={prayerLoading}
                style={{
                  marginTop: "12px",
                  padding: "10px 22px",
                  background: prayerLoading ? C.amberDim : C.amber,
                  color: C.bg,
                  border: "none",
                  borderRadius: "2px",
                  fontSize: "12px",
                  letterSpacing: "1px",
                  cursor: prayerLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {prayerLoading ? "기도문을 쓰는 중..." : "✦ 나의 탄식 기도문 받기"}
              </button>
            )}
          </div>
        ))}

        {prayerText && (
          <div style={{
            margin: "20px 0",
            padding: "20px",
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${C.amber}`,
            borderRadius: "2px",
          }}>
            <div style={{
              fontSize: "10px",
              color: C.amber,
              letterSpacing: "2px",
              marginBottom: "14px",
            }}>
              나의 탄식 기도
            </div>
            <div style={{
              fontSize: "14px",
              color: C.textPrim,
              lineHeight: "2.1",
              fontStyle: "italic",
              whiteSpace: "pre-line",
            }}>
              {prayerText}
            </div>
          </div>
        )}

        {loading && (
          <div style={{
            textAlign: "center",
            padding: "24px",
            color: C.textMute,
            fontSize: "13px",
            letterSpacing: "3px",
          }}>
            ✦ &nbsp; ✦ &nbsp; ✦
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      {inputReady && !prayerText && (
        <div style={{
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          padding: "14px 16px",
          flexShrink: 0,
        }}>
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="솔직하게 쓰세요. 여기서는 다 괜찮습니다. (Enter로 전송)"
              style={{
                width: "100%",
                background: C.bg,
                border: `1px solid ${C.border}`,
                color: C.textPrim,
                fontSize: "14px",
                padding: "10px 12px",
                borderRadius: "2px",
                outline: "none",
                resize: "none",
                fontFamily: "inherit",
                lineHeight: "1.8",
                minHeight: "64px",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                marginTop: "8px",
                width: "100%",
                padding: "11px",
                background: input.trim() ? C.amber : C.amberDim,
                color: C.bg,
                border: "none",
                borderRadius: "2px",
                fontSize: "12px",
                letterSpacing: "1.5px",
                cursor: input.trim() ? "pointer" : "not-allowed",
                fontFamily: "inherit",
              }}
            >
              전하기 →
            </button>
          </div>
        </div>
      )}

      {prayerText && (
        <div style={{
          padding: "14px 16px",
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          flexShrink: 0,
        }}>
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <button
              onClick={onRestart}
              style={{
                width: "100%",
                padding: "12px",
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
              다른 고통의 자리로
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
