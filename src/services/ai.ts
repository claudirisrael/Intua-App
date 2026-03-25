import { TarotResponse, YesNoResponse } from "../types";

export async function getTopic(question: string): Promise<string> {
  const response = await fetch("/api/ai/topic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get topic");
  }
  const data = await response.json();
  return data.topic;
}

export async function getTarotGuidance(question: string): Promise<TarotResponse> {
  const response = await fetch("/api/ai/tarot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get tarot guidance");
  }
  return await response.json();
}

export async function getYesNoGuidance(question: string): Promise<YesNoResponse> {
  const response = await fetch("/api/ai/yesno", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get yes/no guidance");
  }
  return await response.json();
}
