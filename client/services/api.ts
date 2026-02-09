import { User, Message } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const CHAT_URL = `${BASE_URL}/chat`;
const AUTH_URL = `${BASE_URL}/auth`;

export async function login(username: string, password: string): Promise<User> {
    const res = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
}

export async function register(username: string, password: string, displayName: string): Promise<User> {
    const res = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, displayName })
    });
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
}

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${CHAT_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function fetchMessages(): Promise<Message[]> {
  const res = await fetch(`${CHAT_URL}/messages`);
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function postMessage(message: Message): Promise<void> {
    const res = await fetch(`${CHAT_URL}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
    if (!res.ok) throw new Error("Failed to send message");
}
