import type { ApiKeys } from "@/components/ApiKeyForm";

export const callGrokApi = async (userMessage: string, apiKey: string) => {
  const proxyUrl = "https://cors-anywhere.herokuapp.com/https://api.x.ai/v1/chat/completions";
  const response = await fetch(proxyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "X-Api-Key": apiKey,
      "X-Requested-With": "XMLHttpRequest"
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: userMessage }],
      stream: false,
      max_tokens: 1000,
      temperature: 0.7
    }),
  });
  
  if (response.status === 403) {
    throw new Error(
      "CORS proxy access not granted. Please visit https://cors-anywhere.herokuapp.com/corsdemo and request temporary access."
    );
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to get response from Grok: ${errorData.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
};

export const callOpenAiApi = async (userMessage: string, apiKey: string) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  
  if (!response.ok) throw new Error("Failed to get response from OpenAI");
  const data = await response.json();
  return data.choices[0].message.content;
};

export const callAnthropicApi = async (userMessage: string, apiKey: string) => {
  const response = await fetch("https://api.anthropic.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  
  if (!response.ok) throw new Error("Failed to get response from Anthropic");
  const data = await response.json();
  return data.choices[0].message.content;
};

export const callPerplexityApi = async (userMessage: string, apiKey: string) => {
  const response = await fetch("https://api.perplexity.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  
  if (!response.ok) throw new Error("Failed to get response from Perplexity");
  const data = await response.json();
  return data.choices[0].message.content;
};