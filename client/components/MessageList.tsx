import { useRef, useEffect } from "react";
import { Message } from "../types";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  typingUser?: string | null;
}

export default function MessageList({ messages, typingUser }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUser]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50 dark:bg-black/40 scroll-smooth">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      
      {typingUser && (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 ml-4 animate-pulse">
            <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
            </div>
            <span>{typingUser} is typing...</span>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
