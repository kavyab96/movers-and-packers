

import axiosInstance from "../axios/axiosInstance"

export const startConversation = (providerId) => {
  return axiosInstance.post("/chat/start", {
    provider_id: providerId
  });
};

export const getMessages = (conversationId) => {
  return axiosInstance.get(`/chat/message/${conversationId}`);
};

export const getMyChats = () => {
  return axiosInstance.get(`/chat/get-chats`);
};

export const getConversationById = (conversationId) => {
  return axiosInstance.get(`/chat/conversation/${conversationId}`);
};



