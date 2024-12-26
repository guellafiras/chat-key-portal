const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

export const callGrokApi = async (userMessage: string, apiKey: string) => {
  const proxyUrl = `${CORS_PROXY}https://api.x.ai/v1/chat/completions`;
  const response = await fetch(proxyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "X-Requested-With": "XMLHttpRequest"
    },
    body: JSON.stringify({
      model: "grok-2-1212",
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
  const proxyUrl = `${CORS_PROXY}https://api.openai.com/v1/chat/completions`;
  const response = await fetch(proxyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "X-Requested-With": "XMLHttpRequest"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  
  if (response.status === 403) {
    throw new Error(
      "CORS proxy access not granted. Please visit https://cors-anywhere.herokuapp.com/corsdemo and request temporary access."
    );
  }
  
  if (!response.ok) throw new Error("Failed to get response from OpenAI");
  const data = await response.json();
  return data.choices[0].message.content;
};

export const callAnthropicApi = async (userMessage: string, apiKey: string) => {
  const proxyUrl = `${CORS_PROXY}https://api.anthropic.com/v1/messages`;
  const response = await fetch(proxyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "X-Requested-With": "XMLHttpRequest",
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [{ role: "user", content: userMessage }]
    }),
  });
  
  if (response.status === 403) {
    throw new Error(
      "CORS proxy access not granted. Please visit https://cors-anywhere.herokuapp.com/corsdemo and request temporary access."
    );
  }
  
  if (!response.ok) throw new Error("Failed to get response from Anthropic");
  const data = await response.json();
  return data.content[0].text;
};

export const callPerplexityApi = async (userMessage: string, apiKey: string) => {
  const proxyUrl = `${CORS_PROXY}https://api.perplexity.ai/v1/chat/completions`;
  const response = await fetch(proxyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "X-Requested-With": "XMLHttpRequest"
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-instruct",
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  
  if (response.status === 403) {
    throw new Error(
      "CORS proxy access not granted. Please visit https://cors-anywhere.herokuapp.com/corsdemo and request temporary access."
    );
  }
  
  if (!response.ok) throw new Error("Failed to get response from Perplexity");
  const data = await response.json();
  return data.choices[0].message.content;
};