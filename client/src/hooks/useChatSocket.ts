import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Env } from "@/lib/env";
import { useChatStore, Message } from "@/store/useChatStore";

export type { Message };

export const useChatSocket = (groupId: string, userName: string) => {
  const { messages, isLoading, fetchMessages, addMessage } = useChatStore();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // 1. Fetch Initial Messages
  useEffect(() => {
    if (groupId) {
        fetchMessages(groupId);
    }
  }, [groupId, fetchMessages]);

  // 2. Socket.io Connection
  useEffect(() => {
    if (!groupId) return;

    // A. Connect
    socketRef.current = io(Env.NEXT_PUBLIC_BACKEND_URL, {
      auth: {
        room: groupId,
      },
    });

    // B. Listeners
    socketRef.current.on("connect", () => {
        console.log("Connected to Chat Socket");
        setIsConnected(true);
    });

    socketRef.current.on("message", (newMessage: Message) => {
        console.log("Received new message:", newMessage);
        addMessage(newMessage); // Update Zustand Store
    });

    // C. Cleanup
    return () => {
      socketRef.current?.disconnect();
    };
  }, [groupId, addMessage]);


  // 3. Send Message Function
  const sendMessage = async (messageText: string) => {
      return new Promise<void>((resolve, reject) => {
          if (!socketRef.current) return reject("No socket connection");
          
          const payload = {
              group_id: groupId,
              name: userName,
              message: messageText,
              created_at: new Date().toISOString(),
          };

          // Emit to server
          socketRef.current.emit("message", payload);
          
          // Optimistic Update (Immediate Feedback)
          const tempMsg: Message = { 
              ...payload, 
              id: Math.random().toString(), // Temp ID
          };
          addMessage(tempMsg);
          
          resolve();
      });
  };

  return {
    messages,
    isLoading,
    isConnected,
    sendMessage,
  };
};
