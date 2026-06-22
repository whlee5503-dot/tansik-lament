import { useState, useRef, useEffect } from "react";

export default function TypingText({ text, speed = 18, onDone }) {
  const [shown, setShown] = useState("");
  const i = useRef(0);

  useEffect(() => {
    setShown("");
    i.current = 0;
    const iv = setInterval(() => {
      if (i.current < text.length) {
        setShown(text.slice(0, ++i.current));
      } else {
        clearInterval(iv);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);

  return (
    <span>
      {shown}
      {i.current < text.length ? "▊" : ""}
    </span>
  );
}
