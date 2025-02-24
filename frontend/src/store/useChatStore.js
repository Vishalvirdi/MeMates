import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

// Load API key from environment variables
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isAIResponding: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    // If chatting with AI, call OpenAI API directly
    if (selectedUser?.isAI) {
      return get().sendMessageToAI(messageData);
    }

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Message sending failed");
    }
  },

  sendMessageToAI: async (messageData) => {
    const { messages } = get();
    set({ isAIResponding: true });

    // Add user message to the state immediately for better UX
    const updatedMessages = [
      ...messages,
      messageData
    ];
    set({ messages: updatedMessages });

    try {
      // Prepare conversation history (last few messages for context)
      const conversationHistory = messages
        .slice(-5) // Get last 5 messages
        .map(msg => ({
          role: msg.senderId === "openrouter" ? "assistant" : "user",
          content: msg.text
        }));

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_DEEP_SEEK_API}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Chat Application",
        },
        body: JSON.stringify({
          model: "openai/o3-mini",
          messages: [
            { role: "system", content: "You are a helpful AI assistant." },
            ...conversationHistory,
            { role: "user", content: messageData.text }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `API error: ${response.status}`);
      }

      const aiResponse = data.choices?.[0]?.message?.content;

      if (!aiResponse) {
        throw new Error("Empty response from AI");
      }

      // Add AI response to messages
      set({
        messages: [
          ...updatedMessages,
          {
            _id: new Date().getTime(),
            senderId: "openrouter",
            text: aiResponse,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    } catch (error) {
      console.error("OpenRouter API Error:", error);
      toast.error(`AI response failed: ${error.message}`);
      
      // Remove the user message if AI response failed
      set({ messages: messages });
    } finally {
      set({ isAIResponding: false });
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
