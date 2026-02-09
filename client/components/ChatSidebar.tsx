import { User } from "../types";
import { Plus, MoreVertical, Search } from "lucide-react";
import { formatTime } from "../utils/date";

interface ChatSidebarProps {
  users: User[];
  activeChatId: number;
  onSelectChat: (id: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatSidebar({ 
  users, 
  activeChatId, 
  onSelectChat, 
  isOpen, 
  onClose 
}: ChatSidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed md:relative z-30 w-80 h-full flex flex-col border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
               Me
             </div>
             <span className="font-bold text-xl tracking-tight">Chats</span>
          </div>
          <div className="flex gap-1 text-gray-500">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
              <Plus size={20} />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800/50 border border-transparent focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {users.map((user) => (
            <div 
              key={user.id}
              onClick={() => {
                onSelectChat(user.id);
                onClose();
              }}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                activeChatId === user.id 
                  ? 'bg-indigo-50 dark:bg-zinc-800 shadow-sm' 
                  : 'hover:bg-gray-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <div className="relative shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium text-white shadow-sm ${
                  ['bg-linear-to-tr from-pink-500 to-rose-500', 
                   'bg-linear-to-tr from-blue-500 to-cyan-500', 
                   'bg-linear-to-tr from-green-500 to-emerald-500', 
                   'bg-linear-to-tr from-purple-500 to-violet-500', 
                   'bg-linear-to-tr from-orange-500 to-amber-500'][user.id % 5]
                }`}>
                  {user.name.charAt(0)}
                </div>
                {user.status === 'online' && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-[2.5px] border-white dark:border-zinc-900 rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className={`font-semibold truncate text-[15px] ${activeChatId === user.id ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-2">{formatTime(user.time)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-sm truncate pr-2 ${user.unread > 0 ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {user.lastMessage}
                  </p>
                  {user.unread > 0 && (
                    <span className="shrink-0 flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold shadow-sm">
                      {user.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
