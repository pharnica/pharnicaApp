import React, { createContext, useState, useEffect, useContext } from "react";
import io, { Socket } from "socket.io-client";
import { useUserData } from "@/context/UserContext";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocketContext must be used within a SocketContextProvider");
  }
  return context;
};

export const SocketContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData } = useUserData();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userData?.user_id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const newSocket = io(`${process.env.EXPO_PUBLIC_SERVER_SIDE_API}`, {
      transports: ["websocket"],
      query: {
        userId: userData.user_id,
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    const onConnect = () => {
      setIsConnected(true);
      console.log("Socket connected");
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    };

    const onConnectError = (error: Error) => {
      console.error("Socket connection error:", error);
    };

    const onOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };

    newSocket.on("connect", onConnect);
    newSocket.on("disconnect", onDisconnect);
    newSocket.on("connect_error", onConnectError);
    newSocket.on("getOnlineUsers", onOnlineUsers);

    return () => {
      newSocket.off("connect", onConnect);
      newSocket.off("disconnect", onDisconnect);
      newSocket.off("connect_error", onConnectError);
      newSocket.off("getOnlineUsers", onOnlineUsers);
      newSocket.disconnect();
    };
  }, [userData?.user_id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};