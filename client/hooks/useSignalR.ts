import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { Message } from "../types";

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || "http://localhost:5000/hubs/chat";

export function useSignalR(
  userId: number | undefined,
  onMessageReceived: (message: Message) => void,
  onUserTyping?: (user: string) => void,
  onUserStatusChange?: (userId: number, status: string, lastSeen: string) => void
) {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const onMessageReceivedRef = useRef(onMessageReceived);
  const onUserTypingRef = useRef(onUserTyping);
  const onUserStatusChangeRef = useRef(onUserStatusChange);

  // Keep the latest handler in a ref to avoid reconnecting when it changes
  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
    onUserTypingRef.current = onUserTyping;
    onUserStatusChangeRef.current = onUserStatusChange;
  }, [onMessageReceived, onUserTyping, onUserStatusChange]);

  useEffect(() => {
    if (!userId) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${HUB_URL}?userId=${userId}`)
      .withAutomaticReconnect()
      .build();

    newConnection.on("ReceiveMessage", (message: Message) => {
      if (onMessageReceivedRef.current) {
        onMessageReceivedRef.current(message);
      }
    });

    newConnection.on("UserTyping", (user: string) => {
        if (onUserTypingRef.current) {
            onUserTypingRef.current(user);
        }
    });

    newConnection.on("UserStatusChanged", (id: number, status: string, lastSeen: string) => {
        if (onUserStatusChangeRef.current) {
            onUserStatusChangeRef.current(id, status, lastSeen);
        }
    });

    newConnection.start()
      .then(() => {
        console.log("Connected to SignalR");
        setConnection(newConnection);
      })
      .catch((err) => console.log("SignalR Connection failed: ", err));

    return () => {
      newConnection.off("ReceiveMessage");
      newConnection.off("UserTyping");
      newConnection.off("UserStatusChanged");
      newConnection.stop();
    };
  }, [userId]); // Re-connect when userId changes

  const sendMessage = async (user: string, message: string) => {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
        try {
            await connection.invoke("SendMessage", user, message);
        } catch (err) {
            console.error("SendMessage failed", err);
        }
    }
  };

  const sendTyping = async (user: string) => {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
        try {
            await connection.invoke("SendTyping", user);
        } catch (err) {
            console.error("SendTyping failed", err);
        }
    }
  };

  return { sendMessage, sendTyping, connection };
}
