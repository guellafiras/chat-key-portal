import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "./ChatMessage";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import type { ApiKeys } from "./ApiKeyForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { callOpenAiApi, callAnthropicApi, callPerplexityApi, callGrokApi, callGroqApi } from "@/utils/apiUtils";

type LLMType = "openai" | "anthropic" | "perplexity" | "grok" | "groq";

interface LLMConversationProps {
  apiKeys: ApiKeys;
}

export const LLMConversation = ({ apiKeys }: LLMConversationProps) => {
  const [messages, setMessages] = useState<Array<{ content: string; isAi: boolean; model: LLMType }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [llm1, setLlm1] = useState<LLMType>("openai");
  const [llm2, setLlm2] = useState<LLMType>("anthropic");
  const { toast } = useToast();

  const callLLMApi = async (message: string, model: LLMType) => {
    if (!apiKeys[model]) {
      throw new Error(`Please add your ${model.toUpperCase()} API key first`);
    }

    switch (model) {
      case "openai":
        return await callOpenAiApi(message, apiKeys.openai!);
      case "grok":
        return await callGrokApi(message, apiKeys.grok!);
      case "anthropic":
        return await callAnthropicApi(message, apiKeys.anthropic!);
      case "perplexity":
        return await callPerplexityApi(message, apiKeys.perplexity!);
      case "groq":
        return await callGroqApi(message, apiKeys.groq!);
      default:
        throw new Error("Invalid model selected");
    }
  };

  const startConversation = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Initial prompt to start the conversation
      const initialPrompt = "Hello! Let's have an interesting discussion about the future of artificial intelligence.";
      setMessages([{ content: initialPrompt, isAi: true, model: llm1 }]);

      // Start conversation loop (3 exchanges)
      for (let i = 0; i < 3; i++) {
        // LLM 2 responds
        const llm2Response = await callLLMApi(
          `You are having a conversation about AI. Respond to this message: "${initialPrompt}"`,
          llm2
        );
        setMessages(prev => [...prev, { content: llm2Response, isAi: true, model: llm2 }]);

        // LLM 1 responds to LLM 2
        const llm1Response = await callLLMApi(
          `You are having a conversation about AI. Respond to this message: "${llm2Response}"`,
          llm1
        );
        setMessages(prev => [...prev, { content: llm1Response, isAi: true, model: llm1 }]);
      }
    } catch (error) {
      console.error("Conversation Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate conversation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="space-x-4 flex items-center">
          <Select value={llm1} onValueChange={(value: LLMType) => setLlm1(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select LLM 1" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="anthropic">Anthropic</SelectItem>
              <SelectItem value="perplexity">Perplexity</SelectItem>
              <SelectItem value="grok">Grok</SelectItem>
              <SelectItem value="groq">Groq</SelectItem>
            </SelectContent>
          </Select>

          <span>vs</span>

          <Select value={llm2} onValueChange={(value: LLMType) => setLlm2(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select LLM 2" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="anthropic">Anthropic</SelectItem>
              <SelectItem value="perplexity">Perplexity</SelectItem>
              <SelectItem value="grok">Grok</SelectItem>
              <SelectItem value="groq">Groq</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={startConversation} 
          disabled={isLoading || llm1 === llm2}
        >
          Start Conversation
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">
              {message.model.toUpperCase()}
            </span>
            <ChatMessage
              message={message.content}
              isAi={message.isAi}
            />
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>AIs are conversing...</span>
          </div>
        )}
      </div>
    </div>
  );
};