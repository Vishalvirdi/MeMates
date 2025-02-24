import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    sendMessage,
    sendMessageToAI,
    isMessagesLoading,
    isAIResponding,
    selectedUser,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (!selectedUser) return;
    getMessages(selectedUser._id);
  }, [selectedUser, getMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const messageData = {
      text: inputText,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      createdAt: new Date().toISOString(),
    };

    setInputText("");

    if (selectedUser?.isAI) {
      sendMessageToAI(messageData);
    } else {
      sendMessage(messageData);
    }
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput onSendMessage={handleSendMessage} inputText={inputText} setInputText={setInputText} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.senderId === "openrouter" ? "justify-start" : "justify-end"}`}
            ref={messageEndRef}
          >
            <div
              className={`relative p-3 rounded-lg max-w-xs mb-5 ${
                msg.senderId === "openrouter" ? "bg-gray-300 text-black" : "bg-blue-500 text-white"
              }`}
            >
              {msg.text}
              <span className={`absolute bottom-[-20px] right-1 text-xs ${
                msg.senderId === "openrouter" ? "text-gray-500" : "text-gray-400"
              }`}>
                {msg.createdAt ? formatMessageTime(msg.createdAt) : ''}
              </span>
            </div>
          </div>
        ))}
        
        {isAIResponding && (
          <div className="flex justify-start">
            <div className="bg-gray-300 text-black p-3 rounded-lg">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <MessageInput onSendMessage={handleSendMessage} inputText={inputText} setInputText={setInputText} />
    </div>
  );
};

export default ChatContainer;