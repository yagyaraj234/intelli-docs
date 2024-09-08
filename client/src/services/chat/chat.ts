import { API_URL } from "../constant";

export async function streamChat(message: string, workspaceId: string) {
  const encoder = new TextEncoder();
  const body = encoder.encode(JSON.stringify({ message, workspaceId }));

  const response = await fetch(`${API_URL}chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: body,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();

  return {
    async *[Symbol.asyncIterator]() {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) return;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");

          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (line.startsWith("data: ")) {
              const jsonStr = line.slice(5);
              try {
                const parsed = JSON.parse(jsonStr);
                if (parsed.done) {
                  return;
                }
                yield parsed;
              } catch (error) {
                console.error("Error parsing JSON:", error);
              }
            }
          }

          buffer = lines[lines.length - 1];
        }
      } finally {
        reader.releaseLock();
      }
    },
  };
}

export async function updateHistory(messages: any, workspaceId: string) {
  return await fetch(`${API_URL}updateChat`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ messages, workspaceId }),
  });
}
