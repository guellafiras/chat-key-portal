import { useState } from "react";
import { ApiKeyForm, type ApiKeys } from "@/components/ApiKeyForm";
import { ChatInterface } from "@/components/ChatInterface";
import { LLMConversation } from "@/components/LLMConversation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Multi-LLM Chat</h1>
          <p className="text-gray-600">Chat with different AI models using your API keys</p>
        </div>

        <div className="grid gap-8 md:grid-cols-[300px,1fr]">
          <div>
            <h2 className="text-xl font-semibold mb-4">API Keys</h2>
            <ApiKeyForm onKeysUpdate={setApiKeys} />
          </div>
          
          <div>
            <Tabs defaultValue="chat">
              <TabsList className="mb-4">
                <TabsTrigger value="chat">Single Chat</TabsTrigger>
                <TabsTrigger value="conversation">LLM Conversation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat">
                <ChatInterface apiKeys={apiKeys} />
              </TabsContent>
              
              <TabsContent value="conversation">
                <LLMConversation apiKeys={apiKeys} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;