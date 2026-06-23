export async function fetchWithRetry(url, options, maxRetries = 2) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      const raw = data.content
        ?.map(item => item.text || "").join("")
        .replace(/```json|```/g, "")
        .trim();

      if (!raw) throw new Error("Empty response");

      // JSON이 잘렸을 때 복구 시도
      let jsonStr = raw;
      if (!jsonStr.endsWith("}")) {
        // 마지막 완전한 } 찾기
        const lastBrace = jsonStr.lastIndexOf("}");
        if (lastBrace > 0) {
          jsonStr = jsonStr.slice(0, lastBrace + 1);
          // 열린 배열이나 객체 닫기
          const opens = (jsonStr.match(/\[/g) || []).length;
          const closes = (jsonStr.match(/\]/g) || []).length;
          if (opens > closes) jsonStr += "]".repeat(opens - closes);
          jsonStr += "}".repeat(
            (jsonStr.match(/\{/g) || []).length -
            (jsonStr.match(/\}/g) || []).length
          );
        }
      }

      return JSON.parse(jsonStr);
    } catch (err) {
      if (i === maxRetries) throw err;
      // 재시도 전 1초 대기
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}
