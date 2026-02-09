import { User } from "../types";
import { Menu, Phone, Video, Search, MoreVertical } from "lucide-react";
import { formatLastSeen } from "../utils/date";

interface ChatHeaderProps {
  activeUser: User;
  onMobileMenuToggle: () => void;
}

export default function ChatHeader({ activeUser, onMobileMenuToggle }: ChatHeaderProps) {
  return (
    <header className="h-18 px-4 md:px-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 transition-all">
      <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
         <button 
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-gray-600 dark:text-gray-300"
         >
           <Menu size={24} />
         </button>
         <div className="relative shrink-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shadow-sm ${
               ['bg-linear-to-tr from-pink-500 to-rose-500', 
                'bg-linear-to-tr from-blue-500 to-cyan-500', 
                'bg-linear-to-tr from-green-500 to-emerald-500', 
                'bg-linear-to-tr from-purple-500 to-violet-500', 
                'bg-linear-to-tr from-orange-500 to-amber-500'][activeUser.id % 5]
            }`}>
              {activeUser.name.charAt(0)}
            </div>
            {activeUser.status === 'online' && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-950 rounded-full"></span>
            )}
         </div>
         <div className="min-w-0">
           <h2 className="font-bold text-gray-900 dark:text-white leading-tight truncate text-base md:text-lg">{activeUser.name}</h2>
           <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
             {activeUser.status === 'online' ? (
               <>
                 <span className="block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                 Active now
               </>
             ) : (
                <span className="text-gray-500 dark:text-gray-400">
                    {formatLastSeen(activeUser.lastSeen || activeUser.time)}
                </span>
             )}
           </p>
         </div>
      </div>
      
      <div className="flex items-center gap-1 md:gap-2 text-gray-500 dark:text-gray-400 shrink-0">
        <button className="p-2 hover:bg-indigo-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full transition-colors hidden sm:block">
          <Phone size={20} />
        </button>
        <button className="p-2 hover:bg-indigo-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full transition-colors hidden sm:block">
          <Video size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors hidden sm:block">
          <Search size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
    </header>
  );
}
