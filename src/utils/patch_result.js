// ResultScreen의 fetchResult try 블록을 이것으로 교체:
/*
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system, messages: [{ role: "user", content: prompt }] }),
      });
      const parsed = await fetchWithRetry("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system, messages: [{ role: "user", content: prompt }] }),
      });
      setResult(parsed);
*/
