import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export type ApiKeys = {
  openai?: string;
  anthropic?: string;
  perplexity?: string;
  grok?: string;
};

interface ApiKeyFormProps {
  onKeysUpdate: (keys: ApiKeys) => void;
}

export const ApiKeyForm = ({ onKeysUpdate }: ApiKeyFormProps) => {
  const [keys, setKeys] = useState<ApiKeys>({});
  const { toast } = useToast();

  useEffect(() => {
    const savedKeys = localStorage.getItem("llm-api-keys");
    if (savedKeys) {
      const parsed = JSON.parse(savedKeys);
      setKeys(parsed);
      onKeysUpdate(parsed);
    }
  }, [onKeysUpdate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("llm-api-keys", JSON.stringify(keys));
    onKeysUpdate(keys);
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been securely saved in your browser.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="space-y-2">
        <Label htmlFor="openai">OpenAI API Key</Label>
        <Input
          id="openai"
          type="password"
          value={keys.openai || ""}
          onChange={(e) => setKeys({ ...keys, openai: e.target.value })}
          placeholder="sk-..."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="anthropic">Anthropic API Key</Label>
        <Input
          id="anthropic"
          type="password"
          value={keys.anthropic || ""}
          onChange={(e) => setKeys({ ...keys, anthropic: e.target.value })}
          placeholder="sk-ant-..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="perplexity">Perplexity API Key</Label>
        <Input
          id="perplexity"
          type="password"
          value={keys.perplexity || ""}
          onChange={(e) => setKeys({ ...keys, perplexity: e.target.value })}
          placeholder="pplx-..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="grok">Grok API Key</Label>
        <Input
          id="grok"
          type="password"
          value={keys.grok || ""}
          onChange={(e) => setKeys({ ...keys, grok: e.target.value })}
          placeholder="xai-..."
        />
      </div>

      <Button type="submit" className="w-full">Save API Keys</Button>
    </form>
  );
};