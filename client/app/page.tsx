"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import ChatSidebar from "../components/ChatSidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";
import { fetchUsers, fetchMessages } from "../services/api";
import { useSignalR } from "../hooks/useSignalR";
import { User, Message } from "../types";

export default function Chat() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeChatId, setActiveChatId] = useState(1);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [typingUser, setTypingUser] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingSentRef = useRef<number>(0);

  // Check auth
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    setCurrentUser(JSON.parse(storedUser));
  }, [router]);

  // Load initial data
  useEffect(() => {
    if (!currentUser) return;

    async function loadData() {
      try {
        const [usersData, messagesData] = await Promise.all([
            fetchUsers(),
            fetchMessages()
        ]);
        // Filter out current user from the list if desired, or keep them
        setUsers(usersData.filter(u => u.id !== currentUser?.id));
        setChatMessages(messagesData);
      } catch (error) {
        console.error("Failed to load chat data", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  // Handle incoming realtime messages
  const handleMessageReceived = useCallback((newMessage: Message) => {
    setChatMessages((prevMessages) => {
      if (prevMessages.some(m => m.id === newMessage.id)) { 
          return prevMessages; 
      }
      return [...prevMessages, newMessage];
    });
    
    // Clear typing indicator if the user sent a message
    if (typingUser && newMessage.senderId !== currentUser?.id) { // Assuming typingUser matches sender name or similar logic
         // Simplified: just clear on any message for now or improve logic if typingUser matches
         setTypingUser(null);
    }
  }, [typingUser, currentUser]);

  const handleUserTyping = useCallback((user: string) => {
      setTypingUser(user);
      
      // Clear after 3 seconds of no updates
      if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
          setTypingUser(null);
      }, 3000);
  }, []);

  const handleUserStatusChange = useCallback((userId: number, status: string, lastSeen: string) => {
    setUsers(prevUsers => prevUsers.map(u => 
        u.id === userId ? { ...u, status, lastSeen } : u
    ));
  }, []);

  const { sendMessage, sendTyping } = useSignalR(
    currentUser?.id, 
    handleMessageReceived, 
    handleUserTyping, 
    handleUserStatusChange
  );
  
  const activeUser = users.find((u) => u.id === activeChatId) || users[0];

  const handleSendMessage = async (text: string) => {
    if (!currentUser) return;
    await sendMessage(currentUser.name, text);
  };
  
  const handleTyping = () => {
      if (!currentUser) return;
      
      const now = Date.now();
      if (now - lastTypingSentRef.current > 2000) { // Send at most every 2 seconds
          sendTyping(currentUser.name);
          lastTypingSentRef.current = now;
      }
  };

  if (isLoading || !currentUser) {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950">
            <div className="text-indigo-600 font-medium">Loading chat...</div>
        </div>
    );
  }

  // Fallback if no users loaded
  if (!activeUser && users.length > 0) return null; 

  if (users.length === 0) {
      return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950">
           <div className="text-center">
                <p className="text-gray-500 mb-4">No other users found.</p>
                <div className="text-sm text-gray-400">Open this app in a new incognito window to register a second user!</div>
           </div>
        </div>
      );
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
      
      <ChatSidebar 
        users={users} 
        activeChatId={activeChatId} 
        onSelectChat={setActiveChatId}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col bg-white dark:bg-zinc-950 relative w-full">
        <ChatHeader 
          activeUser={activeUser} 
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
        />

        <MessageList messages={chatMessages} typingUser={typingUser} />

        <ChatInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
      </main>
    </div>
  );
}
