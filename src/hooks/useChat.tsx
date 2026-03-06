import { ChatContext } from "@/context/ChatContext";
import { useContext } from "react";

export const useChat = () => {
  const { socket } = useContext(ChatContext);
  return { socket };
};
