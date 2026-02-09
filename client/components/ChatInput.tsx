import { useState } from "react";
import { Smile, Paperclip, Mic, Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onTyping?: () => void;
}

export default function ChatInput({ onSendMessage, onTyping }: ChatInputProps) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    onSendMessage(inputText);
    setInputText("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (onTyping) onTyping();
  };

  return (
    <div className="p-3 md:p-4 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 z-20">
      <form 
        onSubmit={handleSubmit}
        className="flex items-end gap-2 max-w-4xl mx-auto"
      >
        <div className="flex-1 bg-gray-100 dark:bg-zinc-900 rounded-3xl flex items-center p-1 border border-transparent focus-within:border-indigo-300 dark:focus-within:border-indigo-800 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900/30 transition-all shadow-inner">
          <button type="button" className="p-2 md:p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-zinc-800 rounded-full transition-all duration-200">
            <Smile size={22} strokeWidth={1.5} />
          </button>
          <button type="button" className="p-2 md:p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-zinc-800 rounded-full transition-all duration-200 hidden sm:block">
            <Paperclip size={22} strokeWidth={1.5} />
          </button>
          <input 
            type="text" 
            value={inputText}
            onChange={handleChange}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-0 text-[15px] px-2 py-2.5 max-h-32 focus:outline-none"
          />
          <button type="button" className="p-2 md:p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-zinc-800 rounded-full transition-all duration-200">
            <Mic size={22} strokeWidth={1.5} />
          </button>
        </div>
        <button 
          type="submit" 
          className={`p-3 md:p-3.5 rounded-full shadow-md shrink-0 transition-all duration-200 transform ${
             inputText.trim() 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0' 
              : 'bg-gray-200 dark:bg-zinc-800 text-gray-400 cursor-default'
          }`}
          disabled={!inputText.trim()}
        >
          <Send size={20} className={inputText.trim() ? "translate-x-0.5" : ""} strokeWidth={2} />
        </button>
      </form>
    </div>
  );
}
