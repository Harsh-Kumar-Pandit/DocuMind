import useChatHook from '../hooks/useChat'
import ChatContext from './contextValue'

export function ChatProvider({ children }) {
  const chat = useChatHook()
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>
}

export default ChatProvider
