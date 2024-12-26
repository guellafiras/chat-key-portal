import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "./ChatMessage";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ExternalLink } from "lucide-react";
import type { ApiKeys } from "./ApiKeyForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Message {
  content: string;
  isAi: boolean;
}

interface ChatInterfaceProps {
  apiKeys: ApiKeys;
}

export const ChatInterface = ({ apiKeys }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"openai" | "anthropic" | "perplexity" | "grok">("openai");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { content: userMessage, isAi: false }]);
    setIsLoading(true);

    try {
      if (!apiKeys[selectedModel]) {
        throw new Error(`Please add your ${selectedModel.toUpperCase()} API key first`);
      }

      let response;
      let aiMessage;

      switch (selectedModel) {
        case "openai":
          response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKeys.openai}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: userMessage }],
            }),
          });
          if (!response.ok) throw new Error("Failed to get response from OpenAI");
          const openAiData = await response.json();
          aiMessage = openAiData.choices[0].message.content;
          break;

        case "grok":
          const proxyUrl = "https://cors-anywhere.herokuapp.com/https://api.x.ai/chat/completions";
          response = await fetch(proxyUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKeys.grok}`,
              "X-Api-Key": apiKeys.grok,
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
          const grokData = await response.json();
          aiMessage = grokData.choices[0].message.content;
          break;

        case "anthropic":
          response = await fetch("https://api.anthropic.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKeys.anthropic}`,
            },
            body: JSON.stringify({
              messages: [{ role: "user", content: userMessage }],
            }),
          });
          if (!response.ok) throw new Error("Failed to get response from Anthropic");
          const anthropicData = await response.json();
          aiMessage = anthropicData.choices[0].message.content;
          break;

        case "perplexity":
          response = await fetch("https://api.perplexity.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKeys.perplexity}`,
            },
            body: JSON.stringify({
              messages: [{ role: "user", content: userMessage }],
            }),
          });
          if (!response.ok) throw new Error("Failed to get response from Perplexity");
          const perplexityData = await response.json();
          aiMessage = perplexityData.choices[0].message.content;
          break;

        default:
          throw new Error("Invalid model selected");
      }

      setMessages((prev) => [...prev, { content: aiMessage, isAi: true }]);
    } catch (error) {
      console.error("API Error:", error);
      if (error instanceof Error && error.message.includes("CORS proxy access not granted")) {
        toast({
          variant: "destructive",
          title: "CORS Proxy Access Required",
          description: (
            <div className="flex flex-col space-y-2">
              <span>Please enable CORS proxy access first:</span>
              <a
                href="https://cors-anywhere.herokuapp.com/corsdemo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                Visit CORS Demo Page <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          ),
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to get AI response",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <Select value={selectedModel} onValueChange={(value: any) => setSelectedModel(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
            <SelectItem value="perplexity">Perplexity</SelectItem>
            <SelectItem value="grok">Grok</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.content}
            isAi={message.isAi}
          />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>AI is thinking...</span>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};