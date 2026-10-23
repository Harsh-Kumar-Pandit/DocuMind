import { useContext } from "react";
import ChatContext from "../context/contextValue";

export default function useChatContext() {
  const context = useContext(ChatContext);
  return context || null;
}
