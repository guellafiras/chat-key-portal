const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

export const callGroqApi = async (userMessage: string, apiKey: string) => {
  const proxyUrl = `${CORS_PROXY}https://api.groq.com/openai/v1/chat/completions`;
  
  // First check if API key is provided
  if (!apiKey) {
    throw new Error("Groq API key is required");
  }

  try {
    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      }),
    });
    
    if (response.status === 403) {
      throw new Error(
        "CORS proxy access not granted. Please visit https://cors-anywhere.herokuapp.com/corsdemo and request temporary access."
      );
    }
    
    if (response.status === 401) {
      throw new Error(
        "Invalid Groq API key. Please check your API key and ensure it's correctly entered in the API Keys form."
      );
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to get response from Groq: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    // If it's our custom error, throw it directly
    if (error instanceof Error) {
      throw error;
    }
    // For unexpected errors
    throw new Error("Failed to communicate with Groq API");
  }
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
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userMessage
            }
          ]
        }
      ]
    }),
  });
  
  if (response.status === 403) {
    throw new Error(
      "CORS proxy access not granted. Please visit https://cors-anywhere.herokuapp.com/corsdemo and request temporary access."
    );
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to get response from Anthropic: ${errorData.error?.message || response.statusText}`);
  }
  
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
