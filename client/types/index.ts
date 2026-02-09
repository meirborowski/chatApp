export interface User {
  id: number;
  name: string;
  avatar: string;
  status: string;
  lastMessage: string;
  time: string;
  lastSeen: string;
  unread: number;
}

export interface Message {
  id: number;
  senderId: number;
  text: string;
  time: string;
  status: string;
}
