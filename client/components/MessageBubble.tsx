import { Message } from "../types";
import { Check, CheckCheck } from "lucide-react";
import { formatTime } from "../utils/date";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isMe = message.senderId === 1;

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
        <div 
          className={`px-5 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed relative group transition-all hover:shadow-md
            ${isMe 
              ? 'bg-indigo-600 text-white rounded-tr-sm' 
              : 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-tl-sm border border-gray-100 dark:border-zinc-700'
            }`}
        >
          {message.text}
          {/* Time & Status Overlay */}
          <div className={`text-[10px] flex items-center gap-1 mt-1.5 opacity-70 select-none ${isMe ? 'justify-end text-indigo-100' : 'text-gray-400'}`}>
            {formatTime(message.time)}
            {isMe && (
               <span className="ml-0.5">
                 {message.status === 'read' ? <CheckCheck size={14} className="text-indigo-200" /> : <Check size={14} />}
               </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
