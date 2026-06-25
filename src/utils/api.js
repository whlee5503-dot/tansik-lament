export async function callClaude(system, messages) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      system,
      messages: Array.isArray(messages)
        ? messages
        : [{ role: "user", content: messages }],
    }),
  });
  return response.json();
}
