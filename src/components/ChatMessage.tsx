import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isAi: boolean;
  animate?: boolean;
}

export const ChatMessage = ({ message, isAi, animate = true }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "px-4 py-2 rounded-lg max-w-[80%] animate-message-fade-in",
        isAi ? "bg-chat-ai text-white ml-2" : "bg-chat-user mr-2 self-end"
      )}
    >
      <p className="whitespace-pre-wrap">{message}</p>
    </div>
  );
};