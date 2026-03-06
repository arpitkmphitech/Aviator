"use client";
import { useUser } from "@/hooks/useUser";
import { SOCKET_BASE_URL } from "@/lib/config";
import { createContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

type ChatContextValue = {
  socket: Socket | null;
};

const ChatContext = createContext<ChatContextValue>({
  socket: null,
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user) return;
    const socketInstance = io(SOCKET_BASE_URL, {
      query: { userId: user?.userId },
      transports: ["websocket"], // optional but ensures stable connection
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });
    setSocket(socketInstance);
    const handleConnect = () => {
      console.log("✅ Socket connected:", socketInstance.id);
      socketInstance.emit("socketJoin", { userId: user?.userId });
    };

    const handleReconnect = () => {
      console.log("♻️ Reconnected:", socketInstance.id);
    };

    const handleDisconnect = (reason: string) => {
      console.log("⚠️ Socket disconnected:", reason);
    };

    socketInstance.on("connect", handleConnect);
    socketInstance.on("reconnect", handleReconnect);
    socketInstance.on("disconnect", handleDisconnect);

    return () => {
      console.log("🔌 Cleaning up socket...");
      socketInstance.off("connect", handleConnect);
      socketInstance.off("reconnect", handleReconnect);
      socketInstance.off("disconnect", handleDisconnect);
      socketInstance.emit("socketLeave", { userId: user?.userId });
      socketInstance.disconnect();
    };
  }, [user]);
  return (
    <ChatContext.Provider value={{ socket }}>{children}</ChatContext.Provider>
  );
};

export { ChatContext };
